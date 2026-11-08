import React, { useState } from 'react';
import {
  Database,
  CloudUpload,
  Copy,
  Check,
  Download,
  RotateCcw,
  X,
  Smartphone,
  Laptop,
  Tablet,
  Sparkles,
  ShieldCheck,
  Radio,
  Zap
} from 'lucide-react';
import { Student, MonthMeta } from '../data/studentsData';
import { initialDatabase } from '../data/initialDatabase';

interface SyncPublishModalProps {
  students: Student[];
  monthsConfig: MonthMeta[];
  onResetToDefault: () => void;
  onClose: () => void;
  isRealtimeLive?: boolean;
  lastSyncTime?: Date;
}

export const SyncPublishModal: React.FC<SyncPublishModalProps> = ({
  students,
  monthsConfig,
  onResetToDefault,
  onClose,
  isRealtimeLive = true,
  lastSyncTime,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Check if current state has any modifications compared to initialDatabase
  const isModified =
    students.length !== initialDatabase.students.length ||
    JSON.stringify(students) !== JSON.stringify(initialDatabase.students);

  // Export current students dataset as JSON formatted text
  const handleCopyData = () => {
    const jsonStr = JSON.stringify(students, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download students JSON file
  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(students, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BioGrade_students_database_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#132A13] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#ECF39E] text-[#132A13]">
              <Zap className="w-5 h-5 text-[#132A13]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#ECF39E]">
                Đồng Bộ Tự Động Theo Thời Gian Thực (Live)
              </h3>
              <p className="text-xs text-[#ECF39E]/80">
                Tự động cập nhật tức thì trên tất cả thiết bị khi chỉnh sửa, không cần nhấn nút đồng bộ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          {/* Synchronized across all devices badge */}
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                </span>
                Kênh thời gian thực: {isRealtimeLive ? 'ĐANG KẾT NỐI TRỰC TIẾP' : 'Đang kết nối lại'}
              </div>
              {lastSyncTime && (
                <span className="text-[11px] text-emerald-700 font-mono">
                  {lastSyncTime.toLocaleTimeString()}
                </span>
              )}
            </div>

            <p className="text-slate-700 leading-relaxed text-xs">
              Mỗi khi thầy/cô <strong>nhập điểm, sửa nhận xét, thêm hoặc xóa học sinh</strong> trên bất kỳ thiết bị nào (Máy tính, iPad, hay Điện thoại), thay đổi sẽ <strong>tự động truyền ngay lập tức</strong> đến tất cả các thiết bị còn lại đang truy cập trang web qua kênh WebSocket & SSE server. Thầy/cô <strong>hoàn toàn không cần nhấn nút đồng bộ thủ công</strong>.
            </p>

            <div className="flex items-center gap-6 pt-1 text-slate-600 font-semibold text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Laptop className="w-3.5 h-3.5 text-teal-600" /> Máy tính (PC/Mac)
              </span>
              <span className="flex items-center gap-1.5 text-slate-800">
                <Tablet className="w-3.5 h-3.5 text-teal-600" /> iPad / Máy tính bảng
              </span>
              <span className="flex items-center gap-1.5 text-slate-800">
                <Smartphone className="w-3.5 h-3.5 text-teal-600" /> Điện thoại (iOS/Android)
              </span>
            </div>
          </div>

          {/* Current Database Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Tổng số học sinh</div>
              <div className="text-lg font-black text-[#132A13] mt-0.5">{students.length}</div>
              <div className="text-[10px] text-slate-500">Đầy đủ 5 lớp học</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Bài Luyện Đề</div>
              <div className="text-lg font-black text-[#132A13] mt-0.5">18 bài</div>
              <div className="text-[10px] text-slate-500">Tháng 6 - Tháng 10</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Kho mẫu nhận xét</div>
              <div className="text-lg font-black text-[#132A13] mt-0.5">192 mẫu</div>
              <div className="text-[10px] text-slate-500">KT · UD · HC · BP</div>
            </div>
          </div>

          {/* Modification status */}
          {isModified ? (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Đã có dữ liệu được chỉnh sửa trực tiếp và đang đồng bộ live trên các máy.
                </span>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Đặt lại toàn bộ dữ liệu trên server và các thiết bị về trạng thái gốc trong mã nguồn?')) {
                    onResetToDefault();
                  }
                }}
                className="px-2.5 py-1 text-[11px] font-bold bg-amber-600 text-white rounded-lg hover:bg-amber-700 cursor-pointer"
              >
                Khôi phục gốc
              </button>
            </div>
          ) : (
            <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-800 flex items-center gap-2">
              <Check className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Dữ liệu trên tất cả các thiết bị đang đồng bộ 100% với nhau và với mã nguồn gốc.</span>
            </div>
          )}

          {/* Action Cards */}
          <div className="space-y-2.5 pt-1">
            <div className="text-xs font-bold text-slate-800">
              Sao lưu và xuất dữ liệu khi cần:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleCopyData}
                className="p-3 bg-white border border-slate-200 hover:border-[#31572C] rounded-xl text-left flex items-start gap-2.5 transition-colors shadow-2xs group cursor-pointer"
              >
                <div className="p-2 bg-slate-100 text-slate-700 rounded-lg group-hover:bg-[#132A13] group-hover:text-[#ECF39E] transition-colors">
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-bold text-slate-800">
                    {copied ? 'Đã sao chép vào bộ nhớ!' : 'Sao chép dữ liệu (JSON)'}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Copy toàn bộ mảng dữ liệu học sinh & điểm số
                  </p>
                </div>
              </button>

              <button
                onClick={handleDownloadJson}
                className="p-3 bg-white border border-slate-200 hover:border-[#31572C] rounded-xl text-left flex items-start gap-2.5 transition-colors shadow-2xs group cursor-pointer"
              >
                <div className="p-2 bg-slate-100 text-slate-700 rounded-lg group-hover:bg-[#132A13] group-hover:text-[#ECF39E] transition-colors">
                  {downloadSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-bold text-slate-800">
                    {downloadSuccess ? 'Đang tải file...' : 'Tải file sao lưu (JSON)'}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Xuất file backup dữ liệu đầy đủ
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="font-mono text-[11px]">Real-Time Sync Protocol: WebSocket + SSE v2.0</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#132A13] hover:bg-[#31572C] rounded-lg shadow-xs cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
