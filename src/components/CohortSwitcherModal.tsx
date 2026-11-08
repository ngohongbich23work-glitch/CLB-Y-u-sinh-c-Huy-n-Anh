import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Check,
  Calendar,
  Users,
  Layers,
  X,
  FileSpreadsheet,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { Cohort } from '../data/cohortsData';
import { MonthMeta, MONTHS_CONFIG } from '../data/studentsData';

interface CohortSwitcherModalProps {
  cohorts: Cohort[];
  activeCohortId: string;
  onSelectCohort: (cohortId: string) => void;
  onCreateCohort: (newCohort: Cohort) => void;
  onDeleteCohort?: (cohortId: string) => void;
  onClose: () => void;
  onOpenImportForNewCohort?: () => void;
}

export const CohortSwitcherModal: React.FC<CohortSwitcherModalProps> = ({
  cohorts,
  activeCohortId,
  onSelectCohort,
  onCreateCohort,
  onDeleteCohort,
  onClose,
  onOpenImportForNewCohort,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [schoolYear, setSchoolYear] = useState('2025 - 2026');
  const [description, setDescription] = useState('');
  const [templateType, setTemplateType] = useState<'copy' | 'empty'>('copy');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const activeCohort = cohorts.find(c => c.id === activeCohortId) || cohorts[0];

    const newCohort: Cohort = {
      id: `cohort_${Date.now()}`,
      name: name.trim(),
      schoolYear: schoolYear.trim() || '2025 - 2026',
      description: description.trim() || undefined,
      students: [],
      monthsConfig: templateType === 'copy'
        ? JSON.parse(JSON.stringify(activeCohort?.monthsConfig || MONTHS_CONFIG))
        : JSON.parse(JSON.stringify(MONTHS_CONFIG)),
      createdAt: new Date().toISOString().split('T')[0],
    };

    onCreateCohort(newCohort);
    setIsCreating(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-50 via-slate-50 to-white border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#132A13] text-[#ECF39E] shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#132A13]">
                Quản Lý Khóa Học & Niên Khóa (Cohorts)
              </h3>
              <p className="text-xs text-[#31572C]">
                Mỗi khóa học quản lý độc lập danh sách học sinh, bài luyện đề và bảng điểm
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!isCreating ? (
            <>
              {/* Existing Cohorts List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Danh sách khóa học hiện có ({cohorts.length}):</span>
                  <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-1 text-xs font-bold text-[#1e7e34] hover:text-[#132A13] hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Thêm Khóa Học Mới
                  </button>
                </div>

                <div className="space-y-2">
                  {cohorts.map(cohort => {
                    const isActive = cohort.id === activeCohortId;
                    const testCount = cohort.monthsConfig.flatMap(m => m.tests).length;
                    return (
                      <div
                        key={cohort.id}
                        onClick={() => {
                          onSelectCohort(cohort.id);
                          onClose();
                        }}
                        className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isActive
                            ? 'border-[#132A13] bg-[#ECF39E]/20 shadow-xs ring-1 ring-[#132A13]'
                            : 'border-slate-200 bg-white hover:border-[#90A955]/60 hover:bg-slate-50'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-[#132A13] text-sm">
                              {cohort.name}
                            </span>
                            {isActive && (
                              <span className="px-2 py-0.5 bg-[#132A13] text-[#ECF39E] text-[10px] font-bold rounded-full">
                                Đang Kích Hoạt
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              Niên khóa: {cohort.schoolYear}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 font-medium">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              {cohort.students.length} học sinh
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 font-medium">
                              <Layers className="w-3.5 h-3.5 text-slate-400" />
                              {testCount} bài thi
                            </span>
                          </div>
                          {cohort.description && (
                            <p className="text-[11px] text-slate-400 italic">
                              {cohort.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {isActive ? (
                            <div className="w-7 h-7 rounded-full bg-[#132A13] text-[#ECF39E] flex items-center justify-center">
                              <Check className="w-4 h-4" />
                            </div>
                          ) : (
                            <button
                              type="button"
                              className="px-3 py-1.5 text-xs font-semibold text-[#132A13] bg-white border border-[#90A955]/40 rounded-lg hover:bg-[#ECF39E]/30"
                            >
                              Chọn Khóa Này
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  onClick={() => setIsCreating(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#132A13] hover:bg-[#31572C] rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#ECF39E]" />
                  Tạo Niên Khóa Mới
                </button>
                {onOpenImportForNewCohort && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenImportForNewCohort();
                    }}
                    className="px-3.5 py-2 text-xs font-bold text-[#1e7e34] bg-emerald-50 border border-emerald-300 rounded-xl hover:bg-emerald-100 flex items-center gap-1.5 transition-colors"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    Tạo Khóa Từ File Excel
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Creation Form */
            <form onSubmit={handleCreate} className="space-y-4 animate-in fade-in">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#132A13]">
                  Tên Khóa Học / Lớp Luyện Đề: *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ví dụ: Khóa Luyện Đề 2026 - 2027 (Mục Tiêu 9+)"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-[#31572C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#132A13]">
                    Niên Khóa / Năm Học:
                  </label>
                  <input
                    type="text"
                    value={schoolYear}
                    onChange={e => setSchoolYear(e.target.value)}
                    placeholder="2025 - 2026"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-[#31572C]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#132A13]">
                    Cấu Trúc Ban Đầu:
                  </label>
                  <select
                    value={templateType}
                    onChange={e => setTemplateType(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-[#31572C]"
                  >
                    <option value="copy">Kế thừa 18 bài thi & cấu trúc tháng</option>
                    <option value="empty">Khóa học trống (Chờ nạp từ Excel)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#132A13]">
                  Mô Tả / Ghi Chú (Tùy chọn):
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Ghi chú về mục tiêu, lịch học của khóa này..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#31572C]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Quay Lại
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#132A13] hover:bg-[#31572C] rounded-xl shadow-xs"
                >
                  Xác Nhận Tạo Khóa Học
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
