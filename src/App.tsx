/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Menu,
  Dna,
  UserPlus,
  Sparkles,
  BookOpen,
  GraduationCap,
  BarChart3,
  UserCheck,
  UploadCloud,
  Database,
  ShieldCheck,
  Wifi,
  ChevronDown,
  Layers,
  FileSpreadsheet,
  Plus,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import { Student, CLASSES_LIST, MonthMeta } from './data/studentsData';
import { initialDatabase, getFreshInitialStudents, getFreshInitialMonths } from './data/initialDatabase';
import { Cohort, DEFAULT_COHORTS, getFreshInitialCohorts } from './data/cohortsData';
import { useRealtimeSync } from './hooks/useRealtimeSync';
import { Sidebar, TabType } from './components/Sidebar';
import { StudentListView } from './components/StudentListView';
import { StudentProfileView } from './components/StudentProfileView';
import { GradingCommentView } from './components/GradingCommentView';
import { GradebookRankingView } from './components/GradebookRankingView';
import { ScoreDistributionView } from './components/ScoreDistributionView';
import { CommentLibraryView } from './components/CommentLibraryView';
import { AddStudentModal } from './components/AddStudentModal';
import { ImportDataModal } from './components/ImportDataModal';
import { SyncPublishModal } from './components/SyncPublishModal';
import { CohortSwitcherModal } from './components/CohortSwitcherModal';
import { DraftActionBar } from './components/DraftActionBar';
import { PendingChange } from './types/draft';

export default function App() {
  // QUẢN LÝ ĐA KHÓA HỌC / NIÊN KHÓA (MULTI-COHORT MANAGEMENT)
  const [cohorts, setCohorts] = useState<Cohort[]>(() => getFreshInitialCohorts());
  const [activeCohortId, setActiveCohortId] = useState<string>('cohort_2025_2026');
  const [isCohortModalOpen, setIsCohortModalOpen] = useState(false);
  const [cohortDropdownOpen, setCohortDropdownOpen] = useState(false);

  const activeCohort = cohorts.find(c => c.id === activeCohortId) || cohorts[0];

  // COMMITTED BASELINE (Bản dữ liệu đã chốt vĩnh viễn trên Server/Database)
  const [committedStudents, setCommittedStudents] = useState<Student[]>(() => activeCohort.students);
  const [committedMonthsConfig, setCommittedMonthsConfig] = useState<MonthMeta[]>(() => activeCohort.monthsConfig);

  // ACTIVE WORKING STATE (Chế độ nháp đang hiển thị trên giao diện)
  const [students, setStudents] = useState<Student[]>(() => activeCohort.students);
  const [monthsConfig, setMonthsConfig] = useState<MonthMeta[]>(() => activeCohort.monthsConfig);

  // PENDING CHANGES TRACKER (Danh sách thay đổi nháp đang chờ chốt)
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState<string | null>(null);

  const [selectedStudent, setSelectedStudent] = useState<Student>(() => {
    return (
      students.find(s => s.name.includes('BẢO AN')) ||
      students.find(s => s.name.includes('BÌNH')) ||
      students[0] ||
      initialDatabase.students[0]
    );
  });

  const [activeTab, setActiveTab] = useState<TabType>('students');
  const [selectedClass, setSelectedClass] = useState<string>('Tất cả lớp');
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isImportDataOpen, setIsImportDataOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Tính tập hợp ID học sinh có thay đổi chưa lưu để tô màu hàng và gắn nhãn "Chưa lưu"
  const pendingStudentIds = useMemo(() => {
    const ids = new Set<string>();
    pendingChanges.forEach(c => {
      if (c.studentId) ids.add(c.studentId);
    });
    return ids;
  }, [pendingChanges]);

  // HỆ THỐNG ĐỒNG BỘ THỜI GIAN THỰC & PERSISTENCE
  const {
    isConnected,
    lastSyncTime,
    syncCommitSave,
    syncResetData,
  } = useRealtimeSync(
    students,
    setStudents,
    monthsConfig,
    setMonthsConfig,
    setSelectedStudent,
    {
      onRemoteReset: (data) => {
        setCommittedStudents(data.students);
        setCommittedMonthsConfig(data.monthsConfig);
        setPendingChanges([]);
        try {
          localStorage.removeItem('biograde_draft_students_v1');
          localStorage.removeItem('biograde_draft_changes_v1');
        } catch (e) {
          // ignore
        }
      },
      onRemoteStudentsImport: (remoteStudents) => {
        // Chỉ cập nhật baseline nếu client này không có thay đổi nháp đang dang dở
        setCommittedStudents(remoteStudents);
        if (pendingChanges.length === 0) {
          setStudents(remoteStudents);
        }
      },
      onRemoteMonthsUpdate: (remoteMonths) => {
        setCommittedMonthsConfig(remoteMonths);
        if (pendingChanges.length === 0) {
          setMonthsConfig(remoteMonths);
        }
      },
    }
  );

  // 1. TỰ ĐỘNG LƯU VẾT BẢN NHÁP VÀO LOCALSTORAGE (BẢO VỆ DỮ LIỆU)
  useEffect(() => {
    if (pendingChanges.length > 0) {
      try {
        localStorage.setItem('biograde_draft_students_v1', JSON.stringify(students));
        localStorage.setItem('biograde_draft_changes_v1', JSON.stringify(pendingChanges));
        localStorage.setItem('biograde_draft_cohort_id_v1', activeCohortId);
      } catch (e) {
        // silent
      }
    } else {
      try {
        localStorage.removeItem('biograde_draft_students_v1');
        localStorage.removeItem('biograde_draft_changes_v1');
        localStorage.removeItem('biograde_draft_cohort_id_v1');
      } catch (e) {
        // silent
      }
    }
  }, [pendingChanges, students, activeCohortId]);

  // 2. TỰ ĐỘNG KHÔI PHỤC BẢN NHÁP KHI NẠP TRANG MÀ KHÔNG HIỂN THỊ CẢNH BÁO
  useEffect(() => {
    try {
      const savedDraftRaw = localStorage.getItem('biograde_draft_students_v1');
      const savedChangesRaw = localStorage.getItem('biograde_draft_changes_v1');
      if (savedDraftRaw && savedChangesRaw) {
        const parsedStudents = JSON.parse(savedDraftRaw);
        const parsedChanges = JSON.parse(savedChangesRaw);
        if (Array.isArray(parsedStudents) && Array.isArray(parsedChanges) && parsedChanges.length > 0) {
          setStudents(parsedStudents);
          setPendingChanges(parsedChanges);
        }
      }
    } catch (e) {
      // silent
    }
  }, []);

  // CẬP NHẬT TRẠNG THÁI HỌC SINH ĐƯỢC CHỌN KHI DANH SÁCH STUDENTS THAY ĐỔI
  useEffect(() => {
    const updated = students.find(s => s.id === selectedStudent.id);
    if (updated) {
      setSelectedStudent(updated);
    }
  }, [students]);

  // ==========================================
  // DRAFT STAGING HANDLERS (GHI VÀO BẢN NHÁP)
  // ==========================================

  // 1. Thêm mới học sinh vào bản nháp
  const handleDraftAddStudent = (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);
    setSelectedStudent(newStudent);

    const newChange: PendingChange = {
      id: `add_${newStudent.id}_${Date.now()}`,
      type: 'add_student',
      studentId: newStudent.id,
      studentName: newStudent.name,
      description: `Thêm học sinh mới: ${newStudent.name} (${newStudent.className})`,
      timestamp: Date.now(),
    };

    setPendingChanges(prev => [newChange, ...prev]);
  };

  // 2. Chỉnh sửa điểm số / nhận xét / thông tin học sinh vào bản nháp
  const handleDraftUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev =>
      prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    if (selectedStudent.id === updatedStudent.id) {
      setSelectedStudent(updatedStudent);
    }

    const newChange: PendingChange = {
      id: `upd_${updatedStudent.id}_${Date.now()}`,
      type: 'update_student',
      studentId: updatedStudent.id,
      studentName: updatedStudent.name,
      description: `Chỉnh sửa kết quả/thông tin của ${updatedStudent.name}`,
      timestamp: Date.now(),
    };

    // Loại bỏ mục update cũ của cùng học sinh để tránh duplicate danh sách
    setPendingChanges(prev => [
      newChange,
      ...prev.filter(c => !(c.studentId === updatedStudent.id && c.type === 'update_student')),
    ]);
  };

  // 3. Xóa học sinh trong bản nháp
  const handleDraftDeleteStudent = (studentId: string) => {
    const target = students.find(s => s.id === studentId);
    const targetName = target ? target.name : studentId;

    setStudents(prev => prev.filter(s => s.id !== studentId));

    const newChange: PendingChange = {
      id: `del_${studentId}_${Date.now()}`,
      type: 'delete_student',
      studentId: studentId,
      studentName: targetName,
      description: `Xóa học sinh ${targetName}`,
      timestamp: Date.now(),
    };

    setPendingChanges(prev => [newChange, ...prev]);
  };

  // 4. Nhập dữ liệu từ Excel / CSV vào bản nháp
  const handleDraftImportStudents = (newStudents: Student[], newMonths?: MonthMeta[]) => {
    setStudents(newStudents);
    if (newMonths) setMonthsConfig(newMonths);
    if (newStudents.length > 0) {
      setSelectedStudent(newStudents[0]);
    }

    const newChange: PendingChange = {
      id: `imp_${Date.now()}`,
      type: 'import_data',
      description: `Nạp dữ liệu từ file Excel (${newStudents.length} học sinh)`,
      timestamp: Date.now(),
    };

    setPendingChanges(prev => [newChange, ...prev]);
  };

  // 5. Cập nhật danh sách bài kiểm tra vào bản nháp
  const handleDraftUpdateMonthsConfig = (newMonths: MonthMeta[]) => {
    setMonthsConfig(newMonths);

    const newChange: PendingChange = {
      id: `mth_${Date.now()}`,
      type: 'update_months',
      description: `Cập nhật cấu hình bài kiểm tra theo tháng`,
      timestamp: Date.now(),
    };

    setPendingChanges(prev => [newChange, ...prev]);
  };

  // ==========================================
  // COMMIT & DISCARD (LƯU HOẶC HỦY THAY ĐỔI)
  // ==========================================

  // HỦY BỎ TẤT CẢ THAY ĐỔI NHÁP (DISCARD)
  const handleDiscardAllDrafts = () => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn hủy bỏ tất cả ${pendingChanges.length} thay đổi chưa lưu và quay lại trạng thái đã lưu gần nhất?`
      )
    ) {
      setStudents(committedStudents);
      setMonthsConfig(committedMonthsConfig);
      setPendingChanges([]);

      try {
        localStorage.removeItem('biograde_draft_students_v1');
        localStorage.removeItem('biograde_draft_changes_v1');
        localStorage.removeItem('biograde_draft_cohort_id_v1');
      } catch (e) {
        // ignore
      }

      setSaveSuccessToast('Đã hủy bỏ toàn bộ thay đổi nháp.');
      setTimeout(() => setSaveSuccessToast(null), 3000);
    }
  };

  // LƯU THAY ĐỔI VĨNH VIỄN VÀO CƠ SỞ DỮ LIỆU (SAVE CHANGES / COMMIT)
  const handleSaveAllDrafts = async () => {
    if (pendingChanges.length === 0) return;
    setIsSaving(true);

    try {
      // 1. Gửi payload cập nhật hoàn chỉnh đến Backend API qua /api/commit-save và truyền WebSocket
      await syncCommitSave(students, monthsConfig);

      // 2. Lưu bản sao lưu dự phòng vào localStorage (fallback)
      try {
        localStorage.setItem('biograde_committed_backup_v1', JSON.stringify(students));
        localStorage.removeItem('biograde_draft_students_v1');
        localStorage.removeItem('biograde_draft_changes_v1');
        localStorage.removeItem('biograde_draft_cohort_id_v1');
      } catch (e) {
        // silent
      }

      // 3. Cập nhật baseline committed và trạng thái cohort
      setCommittedStudents(students);
      setCommittedMonthsConfig(monthsConfig);
      setCohorts(prev =>
        prev.map(c =>
          c.id === activeCohortId
            ? {
                ...c,
                students: students,
                monthsConfig: monthsConfig,
              }
            : c
        )
      );

      // 4. Xóa sạch trạng thái pendingChanges và bỏ tô sáng
      setPendingChanges([]);

      // 5. Hiển thị thông báo thành công
      setSaveSuccessToast('Đã chốt và lưu dữ liệu thành công!');
      setTimeout(() => setSaveSuccessToast(null), 3500);
    } catch (err) {
      console.error('[Commit] Save failed:', err);
      alert('Có lỗi xảy ra khi lưu dữ liệu vào hệ thống. Vui lòng thử lại!');
    } finally {
      setIsSaving(false);
    }
  };

  // ==========================================
  // COHORT MANAGEMENT HANDLERS
  // ==========================================

  const handleSwitchCohort = (cohortId: string) => {
    if (pendingChanges.length > 0) {
      if (!window.confirm('Bạn đang có thay đổi chưa lưu trong khóa học này. Chuyển khóa học sẽ hủy bỏ các thay đổi nháp. Bạn có muốn tiếp tục không?')) {
        return;
      }
    }

    const target = cohorts.find(c => c.id === cohortId);
    if (!target) return;
    setActiveCohortId(cohortId);
    setStudents(target.students);
    setCommittedStudents(target.students);
    setMonthsConfig(target.monthsConfig);
    setCommittedMonthsConfig(target.monthsConfig);
    setPendingChanges([]);
    setSelectedClass('Tất cả lớp');
    if (target.students.length > 0) {
      setSelectedStudent(target.students[0]);
    }
    setCohortDropdownOpen(false);
  };

  const handleCreateCohort = (newCohort: Cohort) => {
    setCohorts(prev => [newCohort, ...prev]);
    setActiveCohortId(newCohort.id);
    setStudents(newCohort.students);
    setCommittedStudents(newCohort.students);
    setMonthsConfig(newCohort.monthsConfig);
    setCommittedMonthsConfig(newCohort.monthsConfig);
    setPendingChanges([]);
    if (newCohort.students.length > 0) {
      setSelectedStudent(newCohort.students[0]);
    }
  };

  const handleImportAsNewCohort = (
    cohortName: string,
    schoolYear: string,
    importedStudents: Student[],
    importedMonths: MonthMeta[]
  ) => {
    const newCohort: Cohort = {
      id: `cohort_${Date.now()}`,
      name: cohortName,
      schoolYear: schoolYear,
      description: `Khóa học được nạp tự động từ file Excel (${importedStudents.length} học sinh)`,
      students: importedStudents,
      monthsConfig: importedMonths,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCohorts(prev => [newCohort, ...prev]);
    setActiveCohortId(newCohort.id);
    setStudents(importedStudents);
    setCommittedStudents(importedStudents);
    setMonthsConfig(importedMonths);
    setCommittedMonthsConfig(importedMonths);
    setPendingChanges([]);
    if (importedStudents.length > 0) {
      setSelectedStudent(importedStudents[0]);
    }

    // Tự động chốt và lưu vĩnh viễn khóa học mới vào CSDL
    syncCommitSave(importedStudents, importedMonths);
    setSaveSuccessToast(`Đã tạo và lưu thành công khóa học mới: ${cohortName}!`);
    setTimeout(() => setSaveSuccessToast(null), 3500);
  };

  const handleSelectStudentAndNavigate = (student: Student) => {
    setSelectedStudent(student);
    setActiveTab('profile');
  };

  const handleSelectStudentForGrading = (student: Student) => {
    setSelectedStudent(student);
    setActiveTab('grading');
  };

  return (
    <div className="min-h-screen bg-[#f8faf7] flex font-sans text-slate-900 pb-20">
      {/* Toast Notification khi Lưu/Hủy thành công */}
      {saveSuccessToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#132A13] text-[#ECF39E] border-2 border-emerald-400 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-black text-xs sm:text-sm animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{saveSuccessToast}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedClass={selectedClass}
        onSelectClass={setSelectedClass}
        studentCount={students.length}
        onOpenAddStudent={() => setIsAddStudentOpen(true)}
        onOpenImportData={() => setIsImportDataOpen(true)}
        onResetData={() => {
          if (
            window.confirm(
              'Bạn có chắc chắn muốn đặt lại dữ liệu học sinh về trạng thái ban đầu từ mã nguồn gốc và đồng bộ toàn bộ thiết bị?'
            )
          ) {
            syncResetData();
          }
        }}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        isOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-[#90A955]/30 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          {/* Brand title, breadcrumb & Cohort Switcher */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 md:hidden"
              aria-label="Mở menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="whitespace-nowrap shrink-0">
              <span className="text-sm font-black text-[#132A13] tracking-tight">
                Cô Huyền Anh
              </span>
              <span className="hidden lg:inline text-xs text-[#31572C] font-semibold ml-2">
                / {activeTab === 'students'
                  ? '1. Danh sách học sinh'
                  : activeTab === 'profile'
                  ? '2. Tìm kiếm & Hồ sơ học sinh'
                  : activeTab === 'grading'
                  ? '3. Nhận xét bài làm'
                  : activeTab === 'gradebook'
                  ? '4. Bảng điểm & Xếp hạng'
                  : activeTab === 'distribution'
                  ? '5. Phổ điểm lớp học'
                  : '6. Kho mẫu nhận xét'}
              </span>
            </div>

            {/* BỘ CHUYỂN ĐỔI KHÓA HỌC / NIÊN KHÓA (MULTI-COHORT SWITCHER) */}
            <div className="relative">
              <button
                onClick={() => setCohortDropdownOpen(!cohortDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#ECF39E]/30 border border-[#90A955]/40 text-xs font-bold text-[#132A13] transition-all cursor-pointer shadow-2xs"
                title="Chuyển đổi hoặc quản lý các khóa học / niên khóa"
              >
                <GraduationCap className="w-4 h-4 text-[#31572C] shrink-0" />
                <span className="max-w-36 sm:max-w-56 truncate">{activeCohort.name}</span>
                <span className="hidden sm:inline text-[10px] text-slate-500 font-normal">
                  ({activeCohort.schoolYear})
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {/* Dropdown Menu */}
              {cohortDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in">
                  <div className="px-3.5 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Chọn Khóa Học / Niên Khóa
                  </div>
                  {cohorts.map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleSwitchCohort(c.id)}
                      className={`w-full px-3.5 py-2 text-left flex items-center justify-between text-xs hover:bg-[#ECF39E]/20 transition-colors ${
                        c.id === activeCohortId ? 'bg-emerald-50 text-[#132A13] font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold truncate">{c.name}</div>
                        <div className="text-[10.5px] text-slate-400 font-mono">
                          {c.schoolYear} · {c.students.length} HS
                        </div>
                      </div>
                      {c.id === activeCohortId && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      )}
                    </button>
                  ))}

                  <div className="mt-1 pt-1 border-t border-slate-100 px-2">
                    <button
                      onClick={() => {
                        setCohortDropdownOpen(false);
                        setIsCohortModalOpen(true);
                      }}
                      className="w-full px-2 py-1.5 text-xs font-bold text-[#1e7e34] hover:bg-emerald-50 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Quản Lý & Tạo Khóa Học Mới
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* NÚT NHẬP DỮ LIỆU EXCEL / CSV NỔI BẬT */}
            <button
              onClick={() => setIsImportDataOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#132A13] hover:bg-[#31572C] text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
              title="Nhập dữ liệu từ Excel (.xlsx, .xls) hoặc CSV (One-Way Engine)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#ECF39E]" />
              <span className="hidden sm:inline">Nhập từ Excel</span>
              <span className="sm:hidden">Excel</span>
            </button>

            {/* REAL-TIME LIVE SYNC & DRAFT STATUS INDICATOR */}
            <button
              onClick={() => setIsSyncModalOpen(true)}
              title={
                pendingChanges.length > 0
                  ? `Đang có ${pendingChanges.length} thay đổi nháp chưa lưu. Bấm để xem tình trạng đồng bộ.`
                  : `Hệ thống đồng bộ trực tuyến. Lần tín hiệu cuối: ${lastSyncTime.toLocaleTimeString()}`
              }
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-colors shadow-2xs cursor-pointer ${
                pendingChanges.length > 0
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    pendingChanges.length > 0
                      ? 'bg-amber-400'
                      : isConnected
                      ? 'bg-emerald-400'
                      : 'bg-amber-400'
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    pendingChanges.length > 0
                      ? 'bg-amber-600'
                      : isConnected
                      ? 'bg-emerald-600'
                      : 'bg-amber-500'
                  }`}
                ></span>
              </span>
              <span>
                {pendingChanges.length > 0
                  ? `${pendingChanges.length} thay đổi chưa lưu`
                  : isConnected
                  ? 'LIVE ĐỒNG BỘ'
                  : 'Kết nối...'}
              </span>
            </button>

            {/* Quick Active Student Indicator */}
            <div
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-[#90A955]/40 rounded-xl cursor-pointer hover:bg-[#ECF39E]/25 transition-all text-xs shrink-0"
            >
              <div className="w-6 h-6 rounded-lg bg-[#132A13] text-[#ECF39E] font-black flex items-center justify-center text-[10px]">
                {selectedStudent.name.charAt(0)}
              </div>
              <div className="hidden xl:block text-left">
                <div className="font-extrabold text-[#132A13] leading-none">
                  {selectedStudent.name}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {selectedStudent.id} · {selectedStudent.className === 'Lớp Chiều Chủ Nhật' ? 'Lớp chủ nhật' : selectedStudent.className}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'students' && (
            <StudentListView
              students={students}
              selectedClass={selectedClass}
              onSelectClass={setSelectedClass}
              onSelectStudentForProfile={handleSelectStudentAndNavigate}
              onSelectStudentForGrading={handleSelectStudentForGrading}
              onAddStudent={handleDraftAddStudent}
              onUpdateStudent={handleDraftUpdateStudent}
              onDeleteStudent={handleDraftDeleteStudent}
              onOpenImportData={() => setIsImportDataOpen(true)}
              pendingStudentIds={pendingStudentIds}
            />
          )}

          {activeTab === 'profile' && (
            <StudentProfileView
              students={students}
              selectedStudent={selectedStudent}
              onSelectStudent={setSelectedStudent}
              onUpdateStudent={handleDraftUpdateStudent}
              monthsConfig={monthsConfig}
            />
          )}

          {activeTab === 'grading' && (
            <GradingCommentView
              students={students}
              currentStudent={selectedStudent}
              onSelectStudent={setSelectedStudent}
              onUpdateStudent={handleDraftUpdateStudent}
              monthsConfig={monthsConfig}
              onUpdateMonthsConfig={handleDraftUpdateMonthsConfig}
            />
          )}

          {activeTab === 'gradebook' && (
            <GradebookRankingView
              students={students}
              selectedClass={selectedClass}
              onSelectClass={setSelectedClass}
              onSelectStudent={handleSelectStudentAndNavigate}
              monthsConfig={monthsConfig}
              pendingStudentIds={pendingStudentIds}
            />
          )}

          {activeTab === 'distribution' && (
            <ScoreDistributionView
              students={students}
              selectedClass={selectedClass}
              onSelectClass={setSelectedClass}
              onSelectStudent={handleSelectStudentAndNavigate}
              currentStudent={selectedStudent}
              monthsConfig={monthsConfig}
            />
          )}

          {activeTab === 'library' && <CommentLibraryView />}
        </main>
      </div>

      {/* THANH CÔNG CỤ NỔI CHỐT LƯU DỮ LIỆU (STICKY DRAFT ACTION BAR) */}
      <DraftActionBar
        pendingChanges={pendingChanges}
        isSaving={isSaving}
        onSave={handleSaveAllDrafts}
        onDiscard={handleDiscardAllDrafts}
      />

      {/* Global Modals */}
      {isAddStudentOpen && (
        <AddStudentModal
          onAdd={handleDraftAddStudent}
          onClose={() => setIsAddStudentOpen(false)}
          existingCount={students.length}
        />
      )}

      {isImportDataOpen && (
        <ImportDataModal
          onClose={() => setIsImportDataOpen(false)}
          onImportStudents={(newStudents, newMonths) => {
            handleDraftImportStudents(newStudents, newMonths);
          }}
          onImportAsNewCohort={handleImportAsNewCohort}
          onResetToDefault={syncResetData}
          currentCohortName={activeCohort.name}
          monthsConfig={monthsConfig}
        />
      )}

      {isSyncModalOpen && (
        <SyncPublishModal
          students={students}
          monthsConfig={monthsConfig}
          onResetToDefault={syncResetData}
          onClose={() => setIsSyncModalOpen(false)}
          isRealtimeLive={isConnected}
          lastSyncTime={lastSyncTime}
        />
      )}

      {isCohortModalOpen && (
        <CohortSwitcherModal
          cohorts={cohorts}
          activeCohortId={activeCohortId}
          onSelectCohort={handleSwitchCohort}
          onCreateCohort={handleCreateCohort}
          onClose={() => setIsCohortModalOpen(false)}
          onOpenImportForNewCohort={() => setIsImportDataOpen(true)}
        />
      )}
    </div>
  );
}
