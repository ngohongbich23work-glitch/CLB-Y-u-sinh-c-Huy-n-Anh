import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  X,
  Check,
  AlertCircle,
  Download,
  Database,
  RotateCcw,
  Sparkles,
  Layers,
  ShieldCheck,
  CheckCircle2,
  FolderPlus,
  ArrowRight
} from 'lucide-react';
import { Student, MonthMeta, MONTHS_CONFIG } from '../data/studentsData';
import {
  parseExcelOrCsvFile,
  downloadSampleExcelTemplate,
  ExcelImportSummary
} from '../utils/excelImportEngine';

interface ImportDataModalProps {
  onImportStudents: (students: Student[], newMonthsConfig?: MonthMeta[]) => void;
  onImportAsNewCohort?: (cohortName: string, schoolYear: string, students: Student[], monthsConfig: MonthMeta[]) => void;
  onResetToDefault: () => void;
  onClose: () => void;
  currentCohortName?: string;
  monthsConfig?: MonthMeta[];
}

export const ImportDataModal: React.FC<ImportDataModalProps> = ({
  onImportStudents,
  onImportAsNewCohort,
  onResetToDefault,
  onClose,
  currentCohortName = 'Khóa Luyện Đề 2025 - 2026',
  monthsConfig = MONTHS_CONFIG,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'templates'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSummary, setImportSummary] = useState<ExcelImportSummary | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Import Action Mode
  const [importMode, setImportMode] = useState<'merge' | 'replace' | 'new_cohort'>('merge');
  const [newCohortName, setNewCohortName] = useState('Khóa Luyện Đề Mới (Từ Excel)');
  const [newCohortYear, setNewCohortYear] = useState('2025 - 2026');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setImportSummary(null);

    try {
      const summary = await parseExcelOrCsvFile(file, monthsConfig);
      setImportSummary(summary);
      // Gợi ý tên khóa học mới từ tên file
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_\\-]+/g, ' ');
      setNewCohortName(`Khóa Học ${cleanName}`);
    } catch (err: any) {
      console.error('Lỗi khi đọc file Excel/CSV:', err);
      setErrorMessage(err.message || 'Không thể đọc file. Vui lòng kiểm tra định dạng Excel (.xlsx, .xls) hoặc CSV.');
    } finally {
      setIsProcessing(false);
      // Reset input để có thể chọn lại file cùng tên nếu muốn
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleApplyData = () => {
    if (!importSummary) return;

    if (importMode === 'new_cohort' && onImportAsNewCohort) {
      onImportAsNewCohort(
        newCohortName.trim() || 'Khóa Học Mới',
        newCohortYear.trim() || '2025 - 2026',
        importSummary.students,
        importSummary.monthsConfig
      );
    } else {
      onImportStudents(importSummary.students, importSummary.monthsConfig);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#90A955]/30 overflow-hidden flex flex-col my-6 max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-50 via-slate-50 to-white border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#132A13] text-[#ECF39E] shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-[#132A13]">
                  Nhập Dữ Liệu Excel / CSV Một Chiều
                </h3>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                  One-Way Engine
                </span>
              </div>
              <p className="text-xs text-[#31572C]">
                Tự động nhận diện nhiều sheet (Tổng hợp, Tháng...), ghép bài luyện đề & mã nhận xét chuẩn hóa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security & One-Way Banner */}
        <div className="bg-[#ECF39E]/30 px-6 py-2 border-b border-[#90A955]/20 flex items-center gap-2 text-xs text-[#132A13]">
          <ShieldCheck className="w-4 h-4 text-[#31572C] shrink-0" />
          <span>
            <strong>Đọc dữ liệu một chiều:</strong> Hệ thống chỉ đọc và phân tích dữ liệu vào web, tuyệt đối <em>không ghi đè hay thay đổi</em> file Excel trên máy tính của bạn.
          </span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-[#132A13] text-[#132A13]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            Tải File Bảng Điểm & Nhận Xét
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'templates'
                ? 'border-[#132A13] text-[#132A13]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            File Mẫu Excel & Dữ Liệu Gốc
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'upload' && (
            <>
              {/* Drag/Drop & File Input Box */}
              <div className="border-2 border-dashed border-[#90A955]/60 hover:border-[#132A13] bg-[#ECF39E]/10 hover:bg-[#ECF39E]/20 rounded-2xl p-6 text-center transition-all cursor-pointer relative">
                <FileSpreadsheet className="w-12 h-12 text-[#31572C] mx-auto mb-2" />
                <h4 className="text-sm font-bold text-[#132A13]">
                  Chọn hoặc Kéo thả file Excel (.xlsx, .xls) hoặc CSV vào đây
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-lg mx-auto">
                  Hỗ trợ workbook nhiều sheet: <em>"Tổng hợp nhận xét và điểm"</em>, <em>"Tháng 6"</em>, <em>"Tháng 7"</em>... Tự động tìm cột Họ tên, Mã HS, Bài 1-18 và mã nhận xét (KT, UD, HC, BP).
                </p>

                <div className="mt-4 flex items-center justify-center gap-3">
                  <label className="px-5 py-2.5 text-xs font-bold text-white bg-[#132A13] hover:bg-[#31572C] rounded-xl cursor-pointer shadow-sm transition-all inline-flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-[#ECF39E]" />
                    <span>{isProcessing ? 'Đang phân tích...' : 'Chọn File Excel / CSV Từ Máy Tính'}</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isProcessing}
                    />
                  </label>
                  <button
                    onClick={downloadSampleExcelTemplate}
                    type="button"
                    className="px-3.5 py-2.5 text-xs font-semibold text-[#132A13] bg-white border border-[#90A955]/50 hover:bg-[#ECF39E]/30 rounded-xl transition-all inline-flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-[#31572C]" />
                    <span>Tải Mẫu Excel Chuẩn (.xlsx)</span>
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-800 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Import Results Summary & Options */}
              {importSummary && (
                <div className="space-y-4 border border-emerald-200 bg-emerald-50/40 rounded-2xl p-5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-extrabold text-emerald-950">
                        Đã đọc và nhận diện thành công: {importSummary.fileName}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      {(importSummary.fileSize / 1024).toFixed(1)} KB
                    </span>
                  </div>

                  {/* Summary Metric Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-200/60 shadow-2xs">
                      <div className="text-[11px] text-slate-500">Số Học Sinh</div>
                      <div className="text-base font-black text-[#132A13]">{importSummary.totalStudents}</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-200/60 shadow-2xs">
                      <div className="text-[11px] text-slate-500">Số Bài Luyện Đề</div>
                      <div className="text-base font-black text-[#132A13]">{importSummary.totalTests} bài</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-200/60 shadow-2xs">
                      <div className="text-[11px] text-slate-500">Điểm Đã Quét</div>
                      <div className="text-base font-black text-emerald-700">{importSummary.totalScoresRecorded} điểm</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-200/60 shadow-2xs">
                      <div className="text-[11px] text-slate-500">Nhận Xét (KT,UD,HC,BP)</div>
                      <div className="text-base font-black text-blue-700">{importSummary.totalCommentsRecorded} mục</div>
                    </div>
                  </div>

                  {/* Detected Sheets */}
                  <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap">
                    <span className="font-semibold text-slate-700">Các sheet được quét:</span>
                    {importSummary.sheetNames.map((sName, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[11px] font-mono text-slate-700">
                        📄 {sName}
                      </span>
                    ))}
                  </div>

                  {/* Warnings if any */}
                  {importSummary.warnings.length > 0 && (
                    <div className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                      {importSummary.warnings.map((w, i) => (
                        <div key={i}>• {w}</div>
                      ))}
                    </div>
                  )}

                  {/* Target Cohort Option */}
                  <div className="bg-white p-4 rounded-xl border border-emerald-200 space-y-3">
                    <label className="text-xs font-bold text-[#132A13] block">
                      Chọn hình thức lưu dữ liệu vào hệ thống:
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setImportMode('merge')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          importMode === 'merge'
                            ? 'border-[#132A13] bg-[#ECF39E]/20 text-[#132A13] font-bold shadow-2xs ring-1 ring-[#132A13]'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="font-bold">1. Hòa trộn / Cập nhật</div>
                        <div className="text-[10.5px] text-slate-500 font-normal mt-0.5">
                          Giữ học sinh cũ, cập nhật điểm/nhận xét mới cho khóa hiện tại ({currentCohortName})
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setImportMode('replace')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          importMode === 'replace'
                            ? 'border-[#132A13] bg-[#ECF39E]/20 text-[#132A13] font-bold shadow-2xs ring-1 ring-[#132A13]'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="font-bold">2. Thay thế toàn bộ</div>
                        <div className="text-[10.5px] text-slate-500 font-normal mt-0.5">
                          Thay thế toàn bộ danh sách trong khóa hiện tại bằng dữ liệu file này
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setImportMode('new_cohort')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          importMode === 'new_cohort'
                            ? 'border-[#132A13] bg-[#ECF39E]/20 text-[#132A13] font-bold shadow-2xs ring-1 ring-[#132A13]'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="font-bold">3. Tạo Khóa học mới</div>
                        <div className="text-[10.5px] text-slate-500 font-normal mt-0.5">
                          Tạo hẳn một niên khóa độc lập mới từ file Excel này
                        </div>
                      </button>
                    </div>

                    {importMode === 'new_cohort' && (
                      <div className="pt-2 flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">
                            Tên Khóa Học Mới:
                          </label>
                          <input
                            type="text"
                            value={newCohortName}
                            onChange={e => setNewCohortName(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-[#31572C]"
                          />
                        </div>
                        <div className="w-full sm:w-36">
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">
                            Niên Khóa:
                          </label>
                          <input
                            type="text"
                            value={newCohortYear}
                            onChange={e => setNewCohortYear(e.target.value)}
                            placeholder="2025 - 2026"
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-[#31572C]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Preview Table */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Xem trước dữ liệu trích xuất ({importSummary.students.length} học sinh):</span>
                    </div>
                    <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl text-xs bg-white">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 sticky top-0 border-b border-slate-200">
                          <tr>
                            <th className="p-2">STT</th>
                            <th className="p-2">Mã HS</th>
                            <th className="p-2">Họ và Tên</th>
                            <th className="p-2">Lớp</th>
                            <th className="p-2 text-center">Bài 1</th>
                            <th className="p-2 text-center">Bài 2</th>
                            <th className="p-2 text-center">Bài 3</th>
                            <th className="p-2">Nhận xét (Mã/Nội dung)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {importSummary.students.slice(0, 10).map((s, idx) => {
                            const res1 = s.results[1];
                            const res2 = s.results[2];
                            const res3 = s.results[3];
                            const sampleCodes = [
                              ...(res1?.comment.ktCodes || []),
                              ...(res1?.comment.udCodes || []),
                            ].join(', ');
                            return (
                              <tr key={s.id} className="hover:bg-slate-50">
                                <td className="p-2 font-mono text-slate-400">{idx + 1}</td>
                                <td className="p-2 font-mono text-[#31572C] font-bold">{s.id}</td>
                                <td className="p-2 font-bold text-[#132A13]">{s.name}</td>
                                <td className="p-2 text-slate-600">{s.className}</td>
                                <td className="p-2 text-center font-mono font-bold text-emerald-700">
                                  {res1?.score !== null && res1?.score !== undefined ? (res1.score === 0 ? '0' : res1.score) : '-'}
                                </td>
                                <td className="p-2 text-center font-mono font-bold text-emerald-700">
                                  {res2?.score !== null && res2?.score !== undefined ? (res2.score === 0 ? '0' : res2.score) : '-'}
                                </td>
                                <td className="p-2 text-center font-mono font-bold text-emerald-700">
                                  {res3?.score !== null && res3?.score !== undefined ? (res3.score === 0 ? '0' : res3.score) : '-'}
                                </td>
                                <td className="p-2 text-slate-500 text-[11px] max-w-xs truncate">
                                  {sampleCodes || res1?.comment.customKt || 'Chuẩn hóa tự động'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {importSummary.students.length > 10 && (
                      <p className="text-[11px] text-slate-400 text-center italic">
                        và {importSummary.students.length - 10} học sinh khác...
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm">
                  <Database className="w-4 h-4 text-[#31572C]" />
                  Bộ Dữ Liệu Gốc Chuẩn Hóa: 79 Học Sinh · 18 Bài Luyện Đề
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Web tích hợp sẵn cơ sở dữ liệu gốc chuẩn của <strong>CLB Yêu Sinh Học Cô Huyền Anh</strong>, bao gồm đầy đủ 18 bài luyện đề thực chiến và 192 mẫu nhận xét chuẩn hóa chuyên sâu (KT, UD, HC, BP).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={downloadSampleExcelTemplate}
                  className="p-4 bg-white border border-slate-200 hover:border-emerald-500 rounded-xl text-left flex items-start gap-3 transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg group-hover:bg-[#132A13] group-hover:text-[#ECF39E] transition-colors">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Tải File Excel Mẫu (.xlsx)</h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      File mẫu có sẵn sheet "Tổng hợp nhận xét và điểm" và sheet "Mã nhận xét chuẩn hóa" để giáo viên điền nhanh.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Khôi phục danh sách 79 học sinh chính thức ban đầu?')) {
                      onResetToDefault();
                      onClose();
                    }
                  }}
                  className="p-4 bg-white border border-slate-200 hover:border-rose-400 rounded-xl text-left flex items-start gap-3 transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Khôi Phục Gốc 79 Học Sinh</h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Đặt lại trạng thái chuẩn có đầy đủ 79 học sinh và 18 bài luyện đề.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Quy trình nạp dữ liệu một chiều an toàn 100%</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Đóng
            </button>
            {importSummary && (
              <button
                onClick={handleApplyData}
                className="px-5 py-2 text-xs font-bold text-white bg-[#132A13] hover:bg-[#31572C] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Xác Nhận Nạp {importSummary.students.length} Học Sinh</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#ECF39E]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
