import React from 'react';
import {
  Users,
  UserCheck,
  FileText,
  GraduationCap,
  BarChart3,
  BookOpen,
  UserPlus,
  Dna,
  RotateCcw,
  Sparkles,
  UploadCloud,
  Database
} from 'lucide-react';
import { CLASSES_LIST } from '../data/studentsData';

export type TabType =
  | 'students'
  | 'profile'
  | 'grading'
  | 'gradebook'
  | 'distribution'
  | 'library';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  selectedClass: string;
  onSelectClass: (c: string) => void;
  studentCount: number;
  onOpenAddStudent: () => void;
  onOpenImportData: () => void;
  onResetData: () => void;
  onOpenSyncModal?: () => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  selectedClass,
  onSelectClass,
  studentCount,
  onOpenAddStudent,
  onOpenImportData,
  onResetData,
  onOpenSyncModal,
  isOpen,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'students' as TabType,
      label: '1. Danh sách học sinh',
      icon: Users,
      description: 'Sắp xếp theo tên cuối A-Z & theo lớp',
    },
    {
      id: 'profile' as TabType,
      label: '2. Tìm kiếm & Hồ sơ Học sinh',
      icon: UserCheck,
      description: 'Tra cứu thông minh & 4 khối KT, UD, HC, BP',
    },
    {
      id: 'grading' as TabType,
      label: '3. Nhận xét bài làm',
      icon: FileText,
      description: 'Điểm 4 số thập phân, quản lý bài & ghép mã',
    },
    {
      id: 'gradebook' as TabType,
      label: '4. Bảng điểm & Xếp hạng',
      icon: GraduationCap,
      description: 'Vinh danh tiến bộ & Top 30 cần theo dõi',
    },
    {
      id: 'distribution' as TabType,
      label: '5. Phổ điểm lớp học',
      icon: BarChart3,
      description: 'Cột #132A13 & chấm đỏ định vị học sinh',
    },
    {
      id: 'library' as TabType,
      label: '6. Kho mẫu nhận xét',
      icon: BookOpen,
      description: 'Tra cứu hơn 180 mẫu & thêm mã mới',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-72 bg-white border-r border-[#90A955]/30 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top: Logo & Title (CLB Yêu sinh học cô Huyền Anh) */}
        <div className="p-4 border-b border-[#90A955]/20 bg-gradient-to-b from-[#ECF39E]/20 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#132A13] flex items-center justify-center text-[#ECF39E] shadow-sm shrink-0">
              <Dna className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-[#132A13] tracking-tight leading-tight">
                  Cô Huyền Anh
                </span>
                <span className="px-1.5 py-0.5 bg-[#ECF39E] text-[#132A13] text-[9px] font-bold rounded">
                  BioGrade
                </span>
              </div>
              <p className="text-[11px] text-[#31572C] font-semibold leading-tight mt-0.5">
                CLB Yêu sinh học cô Huyền Anh
              </p>
            </div>
          </div>

          {/* Class Filter Dropdown */}
          <div className="mt-3.5 pt-3 border-t border-[#90A955]/20">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] uppercase font-bold text-[#4F772D] tracking-wider">
                Phạm Vi Lớp Học
              </label>
              <span className="text-[10px] text-[#90A955] font-medium">
                {studentCount} học sinh
              </span>
            </div>
            <select
              value={selectedClass}
              onChange={e => onSelectClass(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-[#90A955]/40 rounded-lg text-[#132A13] font-semibold focus:outline-none focus:ring-1 focus:ring-[#31572C]"
            >
              {CLASSES_LIST.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Middle: Navigation Links */}
        <div className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-[#4F772D] uppercase tracking-wider px-3 py-1">
            Phân Hệ Chức Năng
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-[#132A13] text-white shadow-sm'
                    : 'text-[#31572C] hover:bg-[#ECF39E]/40 hover:text-[#132A13]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                    isActive ? 'text-[#ECF39E]' : 'text-[#4F772D]'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-[#132A13]'}`}>
                    {item.label}
                  </div>
                  <div
                    className={`text-[10px] truncate mt-0.5 ${
                      isActive ? 'text-[#ECF39E]/80' : 'text-slate-500'
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom: Quick Actions */}
        <div className="p-3 border-t border-[#90A955]/20 bg-slate-50/70 space-y-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenAddStudent}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#31572C] hover:bg-[#132A13] rounded-lg transition-colors shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#ECF39E]" />
              Thêm Học Sinh
            </button>
            <button
              onClick={onOpenImportData}
              title="Nhập dữ liệu CSV / Excel"
              className="p-2 text-[#31572C] hover:bg-[#ECF39E]/50 border border-[#90A955]/30 rounded-lg transition-colors"
            >
              <UploadCloud className="w-4 h-4 text-[#4F772D]" />
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
            <button
              onClick={onOpenSyncModal}
              className="hover:text-[#31572C] text-emerald-700 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Đồng bộ tự động theo thời gian thực (Real-time live sync)"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
              Đồng bộ Live
            </button>
            <button
              onClick={onResetData}
              className="hover:text-rose-600 transition-colors flex items-center gap-0.5"
              title="Đặt lại dữ liệu ban đầu"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              Reset dữ liệu
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
