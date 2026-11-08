import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { WebSocketServer, WebSocket } from 'ws';
import { INITIAL_STUDENTS, MONTHS_CONFIG, Student, MonthMeta } from './src/data/studentsData';

const app = express();
const server = http.createServer(app);

// Support large payloads (full student rosters with all 18 test results)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Storage directory for real-time persisted database
const DATA_DIR = path.resolve(process.cwd(), 'data_store');
const STATE_FILE = path.join(DATA_DIR, 'biograde_realtime_state.json');

interface ServerState {
  version: number;
  updatedAt: string;
  students: Student[];
  monthsConfig: MonthMeta[];
}

let serverState: ServerState;

function hasValidFullNames(students: Student[]): boolean {
  if (!Array.isArray(students) || students.length === 0) return false;
  // Kiểm tra nếu phần lớn học sinh có đầy đủ họ và tên (nhiều hơn 1 từ)
  const fullNamesCount = students.filter(s => s.name && s.name.trim().split(/\s+/).length >= 2).length;
  return fullNamesCount >= Math.floor(students.length * 0.7);
}

function loadInitialState(): ServerState {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STATE_FILE)) {
      const raw = fs.readFileSync(STATE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.students) && parsed.students.length > 0 && hasValidFullNames(parsed.students)) {
        console.log(`[Storage] Loaded existing state from disk with ${parsed.students.length} students (v${parsed.version || 1}).`);
        return {
          version: parsed.version || 1,
          updatedAt: parsed.updatedAt || new Date().toISOString(),
          students: parsed.students,
          monthsConfig: parsed.monthsConfig || MONTHS_CONFIG,
        };
      } else {
        console.log('[Storage] Initializing canonical dataset with full names.');
      }
    }
  } catch (err) {
    console.log('[Storage] Initializing canonical data:', err);
  }

  // Fallback to canonical data from source code with 100% full names
  console.log(`[Storage] Initializing fresh state from canonical INITIAL_STUDENTS (${INITIAL_STUDENTS.length} students with full names).`);
  const fresh: ServerState = {
    version: 1,
    updatedAt: new Date().toISOString(),
    students: INITIAL_STUDENTS,
    monthsConfig: MONTHS_CONFIG,
  };
  saveStateToDisk(fresh);
  return fresh;
}

let saveTimeout: NodeJS.Timeout | null = null;
function saveStateToDisk(stateToSave: ServerState) {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(STATE_FILE, JSON.stringify(stateToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Storage] Failed to save state to disk:', err);
    }
  }, 200);
}

serverState = loadInitialState();

// Initialize WebSocket server on the same HTTP server instance
const wss = new WebSocketServer({ server });

// Track active SSE client response objects
const sseClients = new Set<Response>();

function broadcast(event: { type: string; payload: any; senderId?: string }, excludeWs?: WebSocket) {
  serverState.version += 1;
  serverState.updatedAt = new Date().toISOString();
  saveStateToDisk(serverState);

  const enrichedEvent = {
    ...event,
    version: serverState.version,
    updatedAt: serverState.updatedAt,
  };
  const data = JSON.stringify(enrichedEvent);

  // 1. Send to all WebSocket clients
  wss.clients.forEach(client => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      try {
        client.send(data);
      } catch (e) {
        // silent client send catch
      }
    }
  });

  // 2. Send to all Server-Sent Events clients (guarantee delivery on mobile networks)
  const sseData = `data: ${data}\n\n`;
  sseClients.forEach(res => {
    try {
      res.write(sseData);
    } catch {
      sseClients.delete(res);
    }
  });
}

// WebSocket connection lifecycle
wss.on('connection', (ws: WebSocket) => {
  // Send immediate current snapshot to the newly connected device
  const initMessage = JSON.stringify({
    type: 'sync:init',
    payload: {
      students: serverState.students,
      monthsConfig: serverState.monthsConfig,
      version: serverState.version,
      updatedAt: serverState.updatedAt,
    },
  });
  ws.send(initMessage);

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      handleClientEvent(msg, ws);
    } catch (err) {
      console.error('[WS] Parse error:', err);
    }
  });

  ws.on('error', () => {
    // silent socket error catch
  });
});

function handleClientEvent(msg: { type: string; payload: any; senderId?: string }, wsSender?: WebSocket) {
  const { type, payload, senderId } = msg;

  switch (type) {
    case 'student:update': {
      const updated = payload as Student;
      if (!updated || !updated.id) return;
      const idx = serverState.students.findIndex(s => s.id === updated.id);
      if (idx >= 0) {
        serverState.students[idx] = updated;
      } else {
        serverState.students.push(updated);
      }
      broadcast({ type: 'student:update', payload: updated, senderId }, wsSender);
      break;
    }

    case 'student:add': {
      const newStudent = payload as Student;
      if (!newStudent || !newStudent.id) return;
      const exists = serverState.students.some(s => s.id === newStudent.id);
      if (!exists) {
        serverState.students.unshift(newStudent);
      }
      broadcast({ type: 'student:add', payload: newStudent, senderId }, wsSender);
      break;
    }

    case 'student:delete': {
      const studentId = payload as string;
      if (!studentId) return;
      serverState.students = serverState.students.filter(s => s.id !== studentId);
      broadcast({ type: 'student:delete', payload: studentId, senderId }, wsSender);
      break;
    }

    case 'students:import': {
      const imported = payload as Student[];
      if (Array.isArray(imported) && imported.length > 0) {
        serverState.students = imported;
        broadcast({ type: 'students:import', payload: imported, senderId }, wsSender);
      }
      break;
    }

    case 'months:update': {
      const newMonths = payload as MonthMeta[];
      if (Array.isArray(newMonths) && newMonths.length > 0) {
        serverState.monthsConfig = newMonths;
        broadcast({ type: 'months:update', payload: newMonths, senderId }, wsSender);
      }
      break;
    }

    case 'sync:commit': {
      const { students, monthsConfig } = payload || {};
      if (Array.isArray(students) && students.length > 0) {
        serverState.students = students;
      }
      if (Array.isArray(monthsConfig) && monthsConfig.length > 0) {
        serverState.monthsConfig = monthsConfig;
      }
      broadcast({
        type: 'sync:init',
        payload: {
          students: serverState.students,
          monthsConfig: serverState.monthsConfig,
        },
        senderId,
      }, wsSender);
      break;
    }

    case 'sync:reset': {
      serverState.students = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
      serverState.monthsConfig = JSON.parse(JSON.stringify(MONTHS_CONFIG));
      broadcast({
        type: 'sync:reset',
        payload: {
          students: serverState.students,
          monthsConfig: serverState.monthsConfig,
        },
        senderId,
      });
      break;
    }

    case 'sync:request': {
      if (wsSender && wsSender.readyState === WebSocket.OPEN) {
        wsSender.send(JSON.stringify({
          type: 'sync:init',
          payload: {
            students: serverState.students,
            monthsConfig: serverState.monthsConfig,
            version: serverState.version,
            updatedAt: serverState.updatedAt,
          },
        }));
      }
      break;
    }

    default:
      break;
  }
}

// REST API Endpoints for standard HTTP queries and fallbacks
app.get('/api/sync', (req: Request, res: Response) => {
  res.json({
    ok: true,
    students: serverState.students,
    monthsConfig: serverState.monthsConfig,
    version: serverState.version,
    updatedAt: serverState.updatedAt,
  });
});

app.post('/api/students/update', (req: Request, res: Response) => {
  const { student, senderId } = req.body;
  if (!student || !student.id) {
    return res.status(400).json({ error: 'Missing student data' });
  }
  handleClientEvent({ type: 'student:update', payload: student, senderId });
  res.json({ ok: true, version: serverState.version });
});

app.post('/api/students/add', (req: Request, res: Response) => {
  const { student, senderId } = req.body;
  if (!student || !student.id) {
    return res.status(400).json({ error: 'Missing student data' });
  }
  handleClientEvent({ type: 'student:add', payload: student, senderId });
  res.json({ ok: true, version: serverState.version });
});

app.post('/api/students/delete', (req: Request, res: Response) => {
  const { studentId, senderId } = req.body;
  if (!studentId) {
    return res.status(400).json({ error: 'Missing studentId' });
  }
  handleClientEvent({ type: 'student:delete', payload: studentId, senderId });
  res.json({ ok: true, version: serverState.version });
});

app.post('/api/students/import', (req: Request, res: Response) => {
  const { students, senderId } = req.body;
  if (!Array.isArray(students)) {
    return res.status(400).json({ error: 'Invalid students array' });
  }
  handleClientEvent({ type: 'students:import', payload: students, senderId });
  res.json({ ok: true, version: serverState.version });
});

// Draft-and-Commit: Permanent Batch Commit Endpoint
app.post('/api/commit-save', (req: Request, res: Response) => {
  const { students, monthsConfig, senderId } = req.body;
  if (!Array.isArray(students)) {
    return res.status(400).json({ error: 'Invalid students payload' });
  }
  handleClientEvent({
    type: 'sync:commit',
    payload: { students, monthsConfig },
    senderId,
  });
  console.log(`[Commit] Successfully persisted ${students.length} students to permanent database.`);
  res.json({ ok: true, version: serverState.version, count: students.length });
});

app.post('/api/months/update', (req: Request, res: Response) => {
  const { monthsConfig, senderId } = req.body;
  if (!Array.isArray(monthsConfig)) {
    return res.status(400).json({ error: 'Invalid monthsConfig array' });
  }
  handleClientEvent({ type: 'months:update', payload: monthsConfig, senderId });
  res.json({ ok: true, version: serverState.version });
});

app.post('/api/reset', (req: Request, res: Response) => {
  handleClientEvent({ type: 'sync:reset', payload: null });
  res.json({ ok: true, version: serverState.version });
});

// Server-Sent Events endpoint for unbreakable real-time streaming
app.get('/api/sse', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Send initial data immediately
  res.write(`data: ${JSON.stringify({
    type: 'sync:init',
    payload: {
      students: serverState.students,
      monthsConfig: serverState.monthsConfig,
      version: serverState.version,
      updatedAt: serverState.updatedAt,
    },
  })}\n\n`);

  sseClients.add(res);

  // Heartbeat ping every 20s to prevent mobile proxy timeouts
  const interval = setInterval(() => {
    try {
      res.write(': ping\n\n');
    } catch {
      clearInterval(interval);
      sseClients.delete(res);
    }
  }, 20000);

  req.on('close', () => {
    clearInterval(interval);
    sseClients.delete(res);
  });
});

app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    connectedWsClients: wss.clients.size,
    connectedSseClients: sseClients.size,
    studentsCount: serverState.students.length,
    version: serverState.version,
    updatedAt: serverState.updatedAt,
  });
});

// Configure Vite in development or serve static build in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const PORT = 3000;

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Server] Vite middleware mounted in development mode.');
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[Server] Production static files serving from dist.');
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[BioGrade] Real-time collaboration server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
