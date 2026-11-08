import { useState, useEffect, useRef, useCallback } from 'react';
import { Student, MonthMeta } from '../data/studentsData';
import { initialDatabase, getFreshInitialStudents, getFreshInitialMonths } from '../data/initialDatabase';

interface RealtimeSyncOptions {
  onRemoteStudentUpdate?: (student: Student) => void;
  onRemoteStudentAdd?: (student: Student) => void;
  onRemoteStudentDelete?: (studentId: string) => void;
  onRemoteStudentsImport?: (students: Student[]) => void;
  onRemoteMonthsUpdate?: (months: MonthMeta[]) => void;
  onRemoteReset?: (data: { students: Student[]; monthsConfig: MonthMeta[] }) => void;
}

export function useRealtimeSync(
  students: Student[],
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>,
  monthsConfig: MonthMeta[],
  setMonthsConfig: React.Dispatch<React.SetStateAction<MonthMeta[]>>,
  setSelectedStudent: React.Dispatch<React.SetStateAction<Student>>,
  options?: RealtimeSyncOptions
) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [syncStatusText, setSyncStatusText] = useState<string>('Đang kết nối thời gian thực...');

  const wsRef = useRef<WebSocket | null>(null);
  const sseRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDestroyedRef = useRef<boolean>(false);

  // Generate unique client identifier for this tab/device session
  const clientIdRef = useRef<string>(
    `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  );

  // Handle incoming real-time payload
  const handleRealtimePayload = useCallback((data: any) => {
    if (!data || !data.type) return;

    // Ignore broadcasts that were sent by this exact tab/device (we already applied optimistically)
    if (data.senderId && data.senderId === clientIdRef.current) {
      return;
    }

    setLastSyncTime(new Date());

    switch (data.type) {
      case 'sync:init': {
        const payload = data.payload;
        if (payload && Array.isArray(payload.students) && payload.students.length > 0) {
          setStudents(payload.students);
          if (Array.isArray(payload.monthsConfig) && payload.monthsConfig.length > 0) {
            setMonthsConfig(payload.monthsConfig);
          }
          // Ensure selected student stays valid
          setSelectedStudent(prev => {
            const found = payload.students.find((s: Student) => s.id === prev.id);
            return found || payload.students[0];
          });
        }
        break;
      }

      case 'student:update': {
        const updated = data.payload as Student;
        if (updated && updated.id) {
          setStudents(prev =>
            prev.map(s => (s.id === updated.id ? updated : s))
          );
          setSelectedStudent(prev => (prev.id === updated.id ? updated : prev));
          options?.onRemoteStudentUpdate?.(updated);
        }
        break;
      }

      case 'student:add': {
        const newStudent = data.payload as Student;
        if (newStudent && newStudent.id) {
          setStudents(prev => {
            if (prev.some(s => s.id === newStudent.id)) return prev;
            return [newStudent, ...prev];
          });
          options?.onRemoteStudentAdd?.(newStudent);
        }
        break;
      }

      case 'student:delete': {
        const studentId = data.payload as string;
        if (studentId) {
          setStudents(prev => prev.filter(s => s.id !== studentId));
          options?.onRemoteStudentDelete?.(studentId);
        }
        break;
      }

      case 'students:import': {
        const imported = data.payload as Student[];
        if (Array.isArray(imported)) {
          setStudents(imported);
          if (imported.length > 0) {
            setSelectedStudent(imported[0]);
          }
          options?.onRemoteStudentsImport?.(imported);
        }
        break;
      }

      case 'months:update': {
        const newMonths = data.payload as MonthMeta[];
        if (Array.isArray(newMonths)) {
          setMonthsConfig(newMonths);
          options?.onRemoteMonthsUpdate?.(newMonths);
        }
        break;
      }

      case 'sync:reset': {
        const payload = data.payload;
        if (payload && Array.isArray(payload.students)) {
          setStudents(payload.students);
          setMonthsConfig(payload.monthsConfig || getFreshInitialMonths());
          setSelectedStudent(
            payload.students.find((s: Student) => s.name.includes('BẢO AN')) ||
            payload.students[0]
          );
          options?.onRemoteReset?.(payload);
        }
        break;
      }

      default:
        break;
    }
  }, [setStudents, setMonthsConfig, setSelectedStudent, options]);

  // Initial HTTP fetch as immediate baseline
  const fetchInitialBaseline = useCallback(async () => {
    try {
      const res = await fetch('/api/sync');
      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.students) && json.students.length > 0) {
          handleRealtimePayload({ type: 'sync:init', payload: json });
          setIsConnected(true);
          setSyncStatusText('Thời gian thực: Đã kết nối');
        }
      }
    } catch (e) {
      // silent baseline fetch fallback
    }
  }, [handleRealtimePayload]);

  // Connect WebSocket
  const connectWebSocket = useCallback(() => {
    if (isDestroyedRef.current) return;

    try {
      const isHttps = window.location.protocol === 'https:';
      const wsProtocol = isHttps ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${window.location.host}`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (isDestroyedRef.current) {
          ws.close();
          return;
        }
        setIsConnected(true);
        setSyncStatusText('Thời gian thực: Đang kết nối live');
      };

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          handleRealtimePayload(parsed);
        } catch (err) {
          console.error('[WS Client] Error parsing event:', err);
        }
      };

      ws.onerror = () => {
        // rely on SSE/HTTP silently
      };

      ws.onclose = () => {
        if (!isDestroyedRef.current) {
          setIsConnected(false);
          setSyncStatusText('Đang tự động kết nối lại...');
          // Auto reconnect after 2 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, 2000);
        }
      };
    } catch (err) {
      // silent setup fallback
    }
  }, [handleRealtimePayload]);

  // Connect Server-Sent Events (SSE) as unbreakable redundant channel
  const connectSSE = useCallback(() => {
    if (typeof EventSource === 'undefined' || isDestroyedRef.current) return;

    try {
      const sse = new EventSource('/api/sse');
      sseRef.current = sse;

      sse.onopen = () => {
        setIsConnected(true);
        setSyncStatusText('Thời gian thực: Đã đồng bộ');
      };

      sse.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          handleRealtimePayload(parsed);
        } catch (err) {
          // ignore heartbeats
        }
      };

      sse.onerror = () => {
        // SSE will automatically attempt reconnection by standard browser spec
      };
    } catch (e) {
      // silent SSE fallback
    }
  }, [handleRealtimePayload]);

  // Lifecycle initialization
  useEffect(() => {
    isDestroyedRef.current = false;

    // 1. Fetch initial baseline
    fetchInitialBaseline();

    // 2. Connect live channels
    connectWebSocket();
    connectSSE();

    return () => {
      isDestroyedRef.current = true;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (sseRef.current) {
        sseRef.current.close();
        sseRef.current = null;
      }
    };
  }, [fetchInitialBaseline, connectWebSocket, connectSSE]);

  // Helper to send message via WS or fallback to REST POST
  const sendRealtimeEvent = useCallback(async (type: string, payload: any, restEndpoint: string, restBody: any) => {
    const senderId = clientIdRef.current;
    let sentViaWs = false;

    // 1. Try WebSocket first (sub-millisecond instant transport)
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify({ type, payload, senderId }));
        sentViaWs = true;
      } catch (err) {
        // fallback to HTTP silently
      }
    }

    // 2. Always fallback or ensure HTTP write if WS was not ready
    if (!sentViaWs) {
      try {
        await fetch(restEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...restBody, senderId }),
        });
      } catch (err) {
        console.error('[REST Client] Failed to POST real-time update:', err);
      }
    }
  }, []);

  // 1. Update Student in real time across all devices
  const syncUpdateStudent = useCallback((updatedStudent: Student) => {
    // Optimistic UI update locally (instant zero-delay feedback)
    setStudents(prev =>
      prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    setSelectedStudent(updatedStudent);

    // Broadcast in real-time to all other devices
    sendRealtimeEvent(
      'student:update',
      updatedStudent,
      '/api/students/update',
      { student: updatedStudent }
    );
  }, [setStudents, setSelectedStudent, sendRealtimeEvent]);

  // 2. Add Student in real time across all devices
  const syncAddStudent = useCallback((newStudent: Student) => {
    // Optimistic UI update locally
    setStudents(prev => [newStudent, ...prev]);
    setSelectedStudent(newStudent);

    // Broadcast in real-time
    sendRealtimeEvent(
      'student:add',
      newStudent,
      '/api/students/add',
      { student: newStudent }
    );
  }, [setStudents, setSelectedStudent, sendRealtimeEvent]);

  // 3. Delete Student in real time across all devices
  const syncDeleteStudent = useCallback((studentId: string) => {
    // Optimistic UI update locally
    setStudents(prev => prev.filter(s => s.id !== studentId));

    // Broadcast in real-time
    sendRealtimeEvent(
      'student:delete',
      studentId,
      '/api/students/delete',
      { studentId }
    );
  }, [setStudents, sendRealtimeEvent]);

  // 4. Bulk import students in real time across all devices
  const syncImportStudents = useCallback((importedStudents: Student[]) => {
    setStudents(importedStudents);
    if (importedStudents.length > 0) {
      setSelectedStudent(importedStudents[0]);
    }

    sendRealtimeEvent(
      'students:import',
      importedStudents,
      '/api/students/import',
      { students: importedStudents }
    );
  }, [setStudents, setSelectedStudent, sendRealtimeEvent]);

  // 5. Update Months Configuration in real time
  const syncUpdateMonthsConfig = useCallback((newMonths: MonthMeta[]) => {
    setMonthsConfig(newMonths);

    sendRealtimeEvent(
      'months:update',
      newMonths,
      '/api/months/update',
      { monthsConfig: newMonths }
    );
  }, [setMonthsConfig, sendRealtimeEvent]);

  // 6. Reset all devices to canonical initial database
  const syncResetData = useCallback(() => {
    const freshStudents = getFreshInitialStudents();
    const freshMonths = getFreshInitialMonths();
    setStudents(freshStudents);
    setMonthsConfig(freshMonths);
    setSelectedStudent(
      freshStudents.find(s => s.name.includes('BẢO AN')) ||
      freshStudents.find(s => s.name.includes('BÌNH')) ||
      freshStudents[0]
    );

    sendRealtimeEvent(
      'sync:reset',
      null,
      '/api/reset',
      {}
    );
  }, [setStudents, setMonthsConfig, setSelectedStudent, sendRealtimeEvent]);

  // 7. Commit draft changes permanently to database and broadcast to all devices
  const syncCommitSave = useCallback(async (committedStudentsList: Student[], newMonths?: MonthMeta[]) => {
    await sendRealtimeEvent(
      'sync:commit',
      { students: committedStudentsList, monthsConfig: newMonths },
      '/api/commit-save',
      { students: committedStudentsList, monthsConfig: newMonths }
    );
  }, [sendRealtimeEvent]);

  return {
    isConnected,
    lastSyncTime,
    syncStatusText,
    syncUpdateStudent,
    syncAddStudent,
    syncDeleteStudent,
    syncImportStudents,
    syncUpdateMonthsConfig,
    syncResetData,
    syncCommitSave,
    forceRefresh: fetchInitialBaseline,
  };
}
