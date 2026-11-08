import React, { useState } from 'react';
import {
  Save,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Clock,
  Sparkles,
  Layers,
  FileCheck
} from 'lucide-react';
import { PendingChange } from '../types/draft';

interface DraftActionBarProps {
  pendingChanges: PendingChange[];
  isSaving: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

export const DraftActionBar: React.FC<DraftActionBarProps> = ({
  pendingChanges,
  isSaving,
  onSave,
  onDiscard,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  if (pendingChanges.length === 0) return null;

  return (
    <>
      {/* Floating Sticky Action Bar */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl animate-in slide-in-from-bottom-5 duration-300">
        <div className="bg-[#132A13]/95 text-white rounded-2xl shadow-2xl border border-emerald-500/40 p-3 sm:p-4 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Left Info: Badge & message */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-[#ECF39E] shrink-0 shadow-inner">
                <Sparkles className="w-5 h-5 text-[#ECF39E]" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#ECF39E] text-[#132A13]">
                    Bản nháp
                  </span>
                  <span className="text-xs text-emerald-200/80 font-mono hidden sm:inline">
                    (Chờ lưu)
                  </span>
                </div>
                <div className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-2 mt-0.5">
                  <span>Bạn có <span className="text-[#ECF39E] underline font-black">{pendingChanges.length}</span> thay đổi đang chỉnh sửa</span>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-xs text-[#ECF39E] hover:underline flex items-center gap-0.5 ml-1 cursor-pointer font-semibold"
                    title="Xem chi tiết các thay đổi"
                  >
                    <span>{showDetails ? 'Ẩn chi tiết' : 'Xem chi tiết'}</span>
                    {showDetails ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Buttons: Discard & Save */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={onDiscard}
                disabled={isSaving}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl border border-rose-400/50 text-rose-200 hover:bg-rose-950/60 hover:text-white hover:border-rose-300 text-xs sm:text-sm font-bold transition-all cursor-pointer disabled:opacity-50"
                title="Hủy bỏ mọi chỉnh sửa và hoàn tác về trạng thái đã lưu trước đó"
              >
                <RotateCcw className="w-4 h-4 text-rose-300" />
                <span>Hủy thay đổi (Discard)</span>
              </button>

              <button
                type="button"
                onClick={onSave}
                disabled={isSaving}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black transition-all shadow-lg shadow-emerald-950/50 cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                title="Ghi vĩnh viễn các thay đổi vào Cơ sở dữ liệu và đồng bộ thiết bị"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>ĐANG LƯU...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-[#ECF39E]" />
                    <span>LƯU THAY ĐỔI (Save)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Collapsible Details Drawer */}
          {showDetails && (
            <div className="mt-3 pt-3 border-t border-white/10 max-h-56 overflow-y-auto space-y-1.5 pr-1 text-xs">
              <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Danh sách thao tác sửa đổi đang chờ chốt:</span>
                <span className="text-[10px] text-slate-300 font-mono font-normal">
                  Tổng {pendingChanges.length} mục
                </span>
              </div>
              {pendingChanges.map((change, idx) => (
                <div
                  key={change.id || idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/5 hover:border-amber-400/30 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="truncate">
                      <span className="font-bold text-white">
                        {change.studentName ? `${change.studentName}: ` : ''}
                      </span>
                      <span className="text-slate-200">{change.description}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                    {new Date(change.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
