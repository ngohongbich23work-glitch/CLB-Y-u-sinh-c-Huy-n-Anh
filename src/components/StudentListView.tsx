import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  ExternalLink,
  Edit2,
  Trash2,
  Check,
  X,
  FileText,
  GraduationCap,
  FileSpreadsheet
} from 'lucide-react';
import {
  Student,
  CLASSES_LIST,
  STUDENT_CLASSES_OPTIONS,
  getStudentOverallAverage,
  sortStudentsByClassAndLastName,
  getLastName
} from '../data/studentsData';

interface StudentListViewProps {
  students: Student[];
  selectedClass: string;
  onSelectClass: (c: string) => void;
  onSelectStudentForProfile: (s: Student) => void;
  onSelectStudentForGrading: (s: Student) => void;
  onAddStudent: (s: Student) => void;
  onUpdateStudent: (s: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onOpenImportData?: () => void;
  pendingStudentIds?: Set<string>;
}

export const StudentListView: React.FC<StudentListViewProps> = ({
  students,
  selectedClass,
  onSelectClass,
  onSelectStudentForProfile,
  onSelectStudentForGrading,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onOpenImportData,
  pendingStudentIds,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form states for manual student entry
  const [newName, setNewName] = useState('');
  const [newClass, setNewClass] = useState('Lớp thứ 4');
  const [newId, setNewId] = useState('');

  // Edit form states
  const [editName, setEditName] = useState('');
  const [editClass, setEditClass] = useState('');
  const [editId, setEditId] = useState('');

  // Filter and sort students:
  // Requirement: "Danh sách được xếp theo alphabet dựa trên tên cuối của học sinh (ví dụ HỒ NGỌC BẢO AN thì tên cuối là 'AN', LÊ NHƯ BÌNH thì tên cuối là 'BÌNH').
  // Rồi đến thứ tự Lớp thứ 4, Lớp thứ 5, Lớp thứ 6, Lớp thứ 7_OT, Lớp chủ nhật (Tất cả học sinh lớp thứ 4 rồi đến lớp thứ 5,...)"
  const filteredAndSortedStudents = useMemo(() => {
    const filtered = students.filter(s => {
      const normalizedClass = s.className === 'Lớp Chiều Chủ Nhật' ? 'Lớp chủ nhật' : s.className;
      const matchClass = selectedClass === 'Tất cả lớp' || normalizedClass === selectedClass;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.className.toLowerCase().includes(q);
      return matchClass && matchSearch;
    });

    return sortStudentsByClassAndLastName(filtered);
  }, [students, selectedClass, searchQuery]);

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const idToUse =
      newId.trim() ||
      `SH-${(students.length + 1).toString().padStart(3, '0')}`;

    const newStudent: Student = {
      id: idToUse.toUpperCase(),
      name: newName.trim().toUpperCase(),
      className: newClass.trim(),
      results: {},
    };

    onAddStudent(newStudent);
    setNewName('');
    setNewId('');
    setIsAddOpen(false);
  };

  const startEdit = (s: Student) => {
    setEditingStudent(s);
    setEditName(s.name);
    setEditClass(s.className === 'Lớp Chiều Chủ Nhật' ? 'Lớp chủ nhật' : s.className);
    setEditId(s.id);
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !editName.trim()) return;

    const updated: Student = {
      ...editingStudent,
      name: editName.trim().toUpperCase(),
      className: editClass.trim(),
      id: editId.trim().toUpperCase(),
    };

    onUpdateStudent(updated);
    setEditingStudent(null);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Control Bar */}
      <div className="bg-white rounded-2xl border border-[#90A955]/30 p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#132A13] text-[#ECF39E] rounded-xl shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#132A13]">
                Danh Sách Học Sinh ({filteredAndSortedStudents.length} / {students.length} HS)
              </h2>
              <p className="text-xs text-[#4F772D] font-medium">
                Xếp theo tên cuối A-Z và theo thứ tự: Lớp thứ 4 → Lớp thứ 5 → Lớp thứ 6 → Lớp thứ 7_OT → Lớp chủ nhật
              </p>
            </div>
          </div>
        </div>

        {/* Right filters & Add Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Class Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-semibold">Lớp:</span>
            <select
              value={selectedClass}
              onChange={e => onSelectClass(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-[#90A955]/40 rounded-lg text-[#132A13] font-bold focus:outline-none focus:ring-1 focus:ring-[#31572C]"
            >
              {CLASSES_LIST.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên hoặc mã HS..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-[#90A955]/40 rounded-lg text-[#132A13] focus:outline-none focus:ring-1 focus:ring-[#31572C] w-48 sm:w-56"
            />
          </div>

          {onOpenImportData && (
            <button
              onClick={onOpenImportData}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#132A13] bg-[#ECF39E] hover:bg-[#ECF39E]/80 border border-[#90A955]/40 rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#132A13]" />
              Nhập từ Excel / CSV
            </button>
          )}

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#31572C] hover:bg-[#132A13] rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#ECF39E]" />
            Thêm Học Sinh Mới
          </button>
        </div>
      </div>

      {/* Manual Add Student Panel */}
      {isAddOpen && (
        <div className="bg-[#ECF39E]/25 border border-[#90A955]/40 rounded-2xl p-5 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#90A955]/30">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#31572C]" />
              <h3 className="text-sm font-extrabold text-[#132A13]">
                Nhập Liệu Thủ Công Học Sinh Mới
              </h3>
            </div>
            <button
              onClick={() => setIsAddOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form
            onSubmit={handleCreateStudent}
            className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
          >
            <div>
              <label className="block text-xs font-bold text-[#31572C] mb-1">
                Họ và Tên Học Sinh *
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Vd: HỒ NGỌC BẢO AN"
                className="w-full px-3 py-2 text-xs bg-white border border-[#90A955]/50 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#31572C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#31572C] mb-1">
                Lớp học *
              </label>
              <select
                value={newClass}
                onChange={e => setNewClass(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#90A955]/50 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#31572C] font-semibold"
              >
                {STUDENT_CLASSES_OPTIONS.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#31572C] mb-1">
                Mã Số Học Sinh
              </label>
              <input
                type="text"
                value={newId}
                onChange={e => setNewId(e.target.value)}
                placeholder={`Vd: SH-${(students.length + 1).toString().padStart(3, '0')}`}
                className="w-full px-3 py-2 text-xs bg-white border border-[#90A955]/50 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#31572C]"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-xs font-bold text-white bg-[#132A13] hover:bg-[#31572C] rounded-lg shadow-xs transition-colors"
              >
                Lưu Học Sinh
              </button>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg"
              >
                Đóng
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Students Data Grid Table - Bỏ cột số bài đã thi */}
      <div className="bg-white rounded-2xl border border-[#90A955]/30 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-[#ECF39E]/20 border-b border-[#90A955]/30 text-[#132A13] font-bold uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">STT</th>
                <th className="py-3 px-3 w-28 font-mono">Mã HS</th>
                <th className="py-3 px-4 min-w-[240px]">Họ và Tên Học Sinh</th>
                <th className="py-3 px-3 w-24">Tên Cuối</th>
                <th className="py-3 px-4">Lớp Học</th>
                <th className="py-3 px-4 text-center font-mono">ĐTB Toàn Khóa</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAndSortedStudents.map((student, idx) => {
                const isEditing = editingStudent?.id === student.id;
                const overallAvg = getStudentOverallAverage(student) ?? 0;
                const lastName = getLastName(student.name);
                const isPending = pendingStudentIds?.has(student.id);

                return (
                  <tr
                    key={student.id}
                    className={
                      isPending
                        ? "bg-emerald-50/70 hover:bg-emerald-100/60 border-l-4 border-l-emerald-600 transition-colors"
                        : "hover:bg-[#ECF39E]/20 transition-colors"
                    }
                  >
                    {/* STT */}
                    <td className="py-3 px-4 text-center font-mono text-slate-400">
                      {idx + 1}
                    </td>

                    {/* ID */}
                    <td className="py-3 px-3 font-mono font-bold text-[#31572C]">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editId}
                          onChange={e => setEditId(e.target.value)}
                          className="w-24 px-1.5 py-1 text-xs font-mono border border-[#90A955] rounded"
                        />
                      ) : (
                        student.id
                      )}
                    </td>

                    {/* Full Name: Hiển thị đầy đủ 100% họ và tên của học sinh */}
                    <td className="py-3 px-4 font-bold text-[#132A13] whitespace-nowrap min-w-[240px]">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-[#90A955] rounded font-bold"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-[#132A13] text-[#ECF39E] font-black flex items-center justify-center text-[10px] shrink-0">
                            {student.name.charAt(0)}
                          </span>
                          <span className="font-extrabold text-[#132A13] tracking-wide text-xs">
                            {student.name}
                          </span>
                          {isPending && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              Bản nháp
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Last Name (Tên cuối) */}
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-[#ECF39E]/60 text-[#132A13] font-bold rounded text-[11px]">
                        {lastName}
                      </span>
                    </td>

                    {/* Class */}
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <select
                          value={editClass}
                          onChange={e => setEditClass(e.target.value)}
                          className="px-2 py-1 text-xs border border-[#90A955] rounded"
                        >
                          {STUDENT_CLASSES_OPTIONS.map(c => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-[#31572C]">
                          {student.className === 'Lớp Chiều Chủ Nhật' ? 'Lớp chủ nhật' : student.className}
                        </span>
                      )}
                    </td>

                    {/* Overall Average */}
                    <td className="py-3 px-4 text-center font-mono font-bold text-[#132A13]">
                      {overallAvg !== null ? (
                        <span className="px-2.5 py-0.5 bg-slate-100 rounded-md">
                          {overallAvg === 0 ? '0' : overallAvg.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-bold">-</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={saveEdit}
                            title="Lưu"
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingStudent(null)}
                            title="Hủy"
                            className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onSelectStudentForProfile(student)}
                            title="Xem Hồ sơ & Phiếu nhận xét"
                            className="p-1.5 text-[#31572C] hover:bg-[#ECF39E]/50 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectStudentForGrading(student)}
                            title="Nhận xét bài làm"
                            className="p-1.5 text-[#4F772D] hover:bg-[#ECF39E]/50 rounded-lg transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => startEdit(student)}
                            title="Chỉnh sửa thông tin"
                            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Xác nhận xóa học sinh ${student.name}?`)) {
                                onDeleteStudent(student.id);
                              }
                            }}
                            title="Xóa học sinh"
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredAndSortedStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold">Không tìm thấy học sinh phù hợp.</p>
                    <p className="text-xs mt-1">Vui lòng kiểm tra lại bộ lọc lớp hoặc từ khóa tìm kiếm.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
