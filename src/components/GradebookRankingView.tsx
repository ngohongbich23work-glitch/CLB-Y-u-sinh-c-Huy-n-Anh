import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  TrendingUp,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  ExternalLink,
  Search,
  Check,
  AlertTriangle,
  UserCheck,
  Calendar
} from 'lucide-react';
import {
  Student,
  MONTHS_CONFIG,
  CLASSES_LIST,
  MonthMeta,
  computeClassRankings,
  StudentRankRecord
} from '../data/studentsData';

interface GradebookRankingViewProps {
  students: Student[];
  selectedClass: string;
  onSelectClass: (c: string) => void;
  onSelectStudent: (s: Student) => void;
  monthsConfig?: MonthMeta[];
  pendingStudentIds?: Set<string>;
}

export const GradebookRankingView: React.FC<GradebookRankingViewProps> = ({
  students,
  selectedClass,
  onSelectClass,
  onSelectStudent,
  monthsConfig = MONTHS_CONFIG,
  pendingStudentIds,
}) => {
  const [selectedMonthId, setSelectedMonthId] = useState<string>(() => monthsConfig[monthsConfig.length - 1]?.id || 'm9');
  const [viewMode, setViewMode] = useState<'ranking' | 'improved' | 'bottom30'>('ranking');
  const [searchQuery, setSearchQuery] = useState('');

  const currentMonthMeta = useMemo(() => {
    return monthsConfig.find(m => m.id === selectedMonthId) || monthsConfig[0];
  }, [selectedMonthId, monthsConfig]);

  // Compute rankings for selected month and class
  const rankings = useMemo(() => {
    return computeClassRankings(students, selectedMonthId, selectedClass, monthsConfig);
  }, [students, selectedMonthId, selectedClass, monthsConfig]);

  // Filter by search query
  const filteredRankings = useMemo(() => {
    if (!searchQuery.trim()) return rankings;
    const q = searchQuery.toLowerCase();
    return rankings.filter(
      r =>
        r.student.name.toLowerCase().includes(q) ||
        r.student.id.toLowerCase().includes(q)
    );
  }, [rankings, searchQuery]);

  // Compute most improved students (sorted by rankDelta or scoreDelta)
  const mostImprovedList = useMemo(() => {
    return [...rankings]
      .filter(r => (r.rankDelta !== null && r.rankDelta > 0) || (r.scoreDelta !== null && r.scoreDelta > 0))
      .sort((a, b) => {
        const deltaRankA = a.rankDelta ?? 0;
        const deltaRankB = b.rankDelta ?? 0;
        if (deltaRankB !== deltaRankA) return deltaRankB - deltaRankA;
        return (b.scoreDelta ?? 0) - (a.scoreDelta ?? 0);
      });
  }, [rankings]);

  // Requirement: "Bảng thống kê 30 học sinh xếp cuối cần theo dõi: Liệt kê 30 học sinh đứng cuối cùng theo tháng"
  const bottom30List = useMemo(() => {
    if (rankings.length <= 30) return [...rankings].reverse();
    return rankings.slice(-30).reverse(); // lowest rank first
  }, [rankings]);

  // Confetti effect when switching to Most Improved
  useEffect(() => {
    if (viewMode === 'improved' && mostImprovedList.length > 0) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#132A13', '#31572C', '#4F772D', '#90A955', '#ECF39E'],
        });
      } catch (e) {
        // ignore in headless env
      }
    }
  }, [viewMode, mostImprovedList.length]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Xếp hạng',
      'Họ và tên',
      'Lớp',
      'Mã HS',
      ...currentMonthMeta.tests.map(t => `${t.title} (${t.date})`),
      `ĐTB ${currentMonthMeta.name}`,
      'ĐTB Tháng trước',
      'Delta Điểm',
      'Tiến bộ (Hạng)'
    ];

    const rows = filteredRankings.map(r => [
      r.rank,
      `"${r.student.name}"`,
      `"${r.student.className}"`,
      r.student.id,
      ...currentMonthMeta.tests.map(t => {
        const sc = r.testsScores[t.id];
        return sc !== null && sc !== undefined ? (sc === 0 ? '0' : sc.toFixed(4)) : '-';
      }),
      r.currentAvg !== null ? (r.currentAvg === 0 ? '0' : r.currentAvg.toFixed(4)) : '-',
      r.prevAvg !== null ? (r.prevAvg === 0 ? '0' : r.prevAvg.toFixed(4)) : '-',
      r.scoreDelta !== null ? (r.scoreDelta > 0 ? `+${r.scoreDelta.toFixed(4)}` : r.scoreDelta.toFixed(4)) : '-',
      r.rankDelta !== null ? (r.rankDelta > 0 ? `+${r.rankDelta}` : r.rankDelta) : '-'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bang_Diem_Xep_Hang_${currentMonthMeta.id}_${selectedClass.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls Bar */}
      <div className="bg-white rounded-2xl border border-[#90A955]/30 p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Left: View Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto">
          <button
            onClick={() => setViewMode('ranking')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
              viewMode === 'ranking'
                ? 'bg-[#132A13] text-[#ECF39E] shadow-xs'
                : 'text-[#31572C] hover:text-[#132A13]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Bảng Điểm & Xếp Hạng ({rankings.length})
          </button>

          <button
            onClick={() => setViewMode('improved')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
              viewMode === 'improved'
                ? 'bg-[#132A13] text-[#ECF39E] shadow-xs'
                : 'text-[#31572C] hover:text-[#132A13]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Vinh Danh Tiến Bộ ({mostImprovedList.length})
          </button>

          {/* New Tab: Top 30 xếp cuối cần theo dõi */}
          <button
            onClick={() => setViewMode('bottom30')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
              viewMode === 'bottom30'
                ? 'bg-rose-800 text-white shadow-xs'
                : 'text-rose-700 hover:text-rose-900 hover:bg-rose-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Top 30 Cần Theo Dõi ({Math.min(30, rankings.length)})
          </button>
        </div>

        {/* Right filters: Month, Class, Search, Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Month selector */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-500 font-semibold">Tháng:</span>
            <select
              value={selectedMonthId}
              onChange={e => setSelectedMonthId(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-[#90A955]/40 rounded-lg text-[#132A13] font-bold focus:outline-none focus:ring-1 focus:ring-[#31572C]"
            >
              {monthsConfig.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-500 font-semibold">Lớp:</span>
            <select
              value={selectedClass}
              onChange={e => onSelectClass(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-[#90A955]/40 rounded-lg text-[#132A13] font-bold focus:outline-none focus:ring-1 focus:ring-[#31572C]"
            >
              {CLASSES_LIST.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Search box */}
          {viewMode === 'ranking' && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm học sinh..."
                className="pl-7 pr-3 py-1.5 text-xs bg-slate-50 border border-[#90A955]/40 rounded-lg text-[#132A13] focus:outline-none focus:ring-1 focus:ring-[#31572C] w-36 sm:w-44 font-medium"
              />
            </div>
          )}

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#31572C] hover:bg-[#132A13] rounded-lg transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#ECF39E]" />
            Xuất Excel/CSV
          </button>
        </div>
      </div>

      {/* VIEW 1: Standard Full Ranking Table */}
      {viewMode === 'ranking' && (
        <div className="bg-white rounded-2xl border border-[#90A955]/30 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#90A955]/20 flex items-center justify-between bg-gradient-to-r from-slate-50 to-[#ECF39E]/20">
            <div>
              <h3 className="text-xs font-extrabold text-[#132A13] uppercase tracking-wider">
                Bảng Xếp Hạng & Điểm Số Tháng: {currentMonthMeta.name}
              </h3>
              <p className="text-[11px] text-[#4F772D] font-medium">
                Tự động tính ĐTB tháng (4 chữ số thập phân) và biến động thứ hạng so với tháng trước
              </p>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Hiển thị: <strong>{filteredRankings.length}</strong> học sinh
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[#132A13] font-bold uppercase tracking-wider">
                  <th className="py-3 px-3 w-16 text-center">Hạng</th>
                  <th className="py-3 px-4">Họ và Tên</th>
                  <th className="py-3 px-3 w-28 font-mono">Lớp / Mã HS</th>
                  {currentMonthMeta.tests.map(t => (
                    <th key={t.id} className="py-3 px-2 text-center font-mono w-16">
                      <div>{t.title}</div>
                      <div className="text-[9px] text-slate-400 font-normal">{t.date}</div>
                    </th>
                  ))}
                  <th className="py-3 px-3 text-center font-mono bg-[#ECF39E]/40 text-[#132A13] font-black">
                    ĐTB {currentMonthMeta.name}
                  </th>
                  <th className="py-3 px-3 text-center font-mono">Delta Điểm</th>
                  <th className="py-3 px-3 text-center">Tiến Bộ (Hạng)</th>
                  <th className="py-3 px-3 text-right">Xem Hồ Sơ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRankings.map(record => {
                  const isTop3 = record.rank <= 3;
                  const isBottom = record.rank > rankings.length - 10;
                  const isPending = pendingStudentIds?.has(record.student.id);

                  return (
                    <tr
                      key={record.student.id}
                      className={`transition-colors ${
                        isPending
                          ? 'bg-emerald-50/70 hover:bg-emerald-100/60 border-l-4 border-l-emerald-600'
                          : isTop3
                          ? 'bg-amber-50/20 hover:bg-[#ECF39E]/20'
                          : isBottom
                          ? 'bg-rose-50/15 hover:bg-[#ECF39E]/20'
                          : 'hover:bg-[#ECF39E]/20'
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-2.5 px-3 text-center">
                        {record.rank === 1 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-slate-900 font-black text-xs shadow-xs">
                            1
                          </span>
                        ) : record.rank === 2 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-black text-xs shadow-xs">
                            2
                          </span>
                        ) : record.rank === 3 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white font-black text-xs shadow-xs">
                            3
                          </span>
                        ) : (
                          <span className="font-mono font-bold text-slate-500">
                            #{record.rank}
                          </span>
                        )}
                      </td>

                      {/* Name */}
                      <td className="py-2.5 px-4 font-bold text-[#132A13] whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelectStudent(record.student)}
                            className="hover:text-[#31572C] hover:underline text-left font-extrabold"
                          >
                            {record.student.name}
                          </button>
                          {isPending && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1 shrink-0 shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              Bản nháp
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Class & ID */}
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        <div>{record.student.id}</div>
                        <div className="text-[10px] text-slate-400">
                          {record.student.className === 'Lớp Chiều Chủ Nhật' ? 'Lớp chủ nhật' : record.student.className}
                        </div>
                      </td>

                      {/* Test scores in this month */}
                      {currentMonthMeta.tests.map(t => {
                        const sc = record.testsScores[t.id];
                        return (
                          <td
                            key={t.id}
                            className="py-2.5 px-2 text-center font-mono text-slate-700"
                          >
                            {sc !== null && sc !== undefined ? (
                              <span
                                className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                                  sc >= 8.0
                                    ? 'bg-emerald-50 text-emerald-800'
                                    : sc >= 6.5
                                    ? 'bg-teal-50 text-teal-800'
                                    : sc >= 5.0
                                    ? 'bg-amber-50 text-amber-800'
                                    : 'bg-rose-50 text-rose-800'
                                }`}
                              >
                                {sc === 0 ? '0' : sc.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-slate-400 font-bold">-</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Monthly Average (làm tròn 4 chữ số thập phân, hoặc - nếu chưa có điểm) */}
                      <td className="py-2.5 px-3 text-center font-mono font-black text-[#132A13] bg-[#ECF39E]/30 text-xs">
                        {record.currentAvg !== null ? (
                          record.currentAvg === 0 ? '0' : record.currentAvg.toFixed(4)
                        ) : (
                          <span className="text-slate-400 font-bold">-</span>
                        )}
                      </td>

                      {/* Score Delta */}
                      <td className="py-2.5 px-3 text-center font-mono text-[11px]">
                        {record.scoreDelta === null ? (
                          <span className="text-slate-300">-</span>
                        ) : record.scoreDelta > 0 ? (
                          <span className="font-bold text-emerald-700">
                            +{record.scoreDelta.toFixed(4)}
                          </span>
                        ) : record.scoreDelta < 0 ? (
                          <span className="font-bold text-rose-700">
                            {record.scoreDelta.toFixed(4)}
                          </span>
                        ) : (
                          <span className="text-slate-400">0.0000</span>
                        )}
                      </td>

                      {/* Rank Delta Badge */}
                      <td className="py-2.5 px-3 text-center">
                        {record.rankDelta === null ? (
                          <span className="text-[10px] text-slate-400">Mốc đầu</span>
                        ) : record.rankDelta > 0 ? (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <ArrowUpRight className="w-3 h-3" />+{record.rankDelta}
                          </span>
                        ) : record.rankDelta < 0 ? (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            <ArrowDownRight className="w-3 h-3" />
                            {record.rankDelta}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                            <Minus className="w-2.5 h-2.5" />0
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => onSelectStudent(record.student)}
                          title="Xem hồ sơ & biểu đồ cá nhân"
                          className="p-1 text-[#31572C] hover:bg-[#ECF39E]/50 rounded transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: Most Improved Leaderboard */}
      {viewMode === 'improved' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-[#132A13] via-[#31572C] to-[#4F772D] rounded-2xl p-6 text-white shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[#ECF39E] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Bảng Vinh Danh Học Sinh Bứt Phá
                </div>
                <h2 className="text-xl font-black mt-1">
                  Top Học Sinh Tiến Bộ Vượt Bậc Trong {currentMonthMeta.name}
                </h2>
                <p className="text-xs text-emerald-100 mt-1">
                  Đánh giá dựa trên mức độ thăng hạng và tăng trưởng điểm số trung bình so với tháng trước
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mostImprovedList.slice(0, 9).map((item, idx) => (
              <div
                key={item.student.id}
                onClick={() => onSelectStudent(item.student)}
                className="bg-white rounded-2xl border border-[#90A955]/30 p-4 shadow-xs hover:border-[#132A13] cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-black rounded-full flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" />+{item.rankDelta ?? 0} hạng
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      Hạng #{item.rank}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-[#132A13]">{item.student.name}</h3>
                  <p className="text-[11px] text-[#4F772D] font-medium">
                    {item.student.className} · {item.student.id}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">ĐTB Tháng:</span>
                    <strong className="text-[#132A13] font-mono text-sm">
                      {item.currentAvg !== null ? (item.currentAvg === 0 ? '0' : item.currentAvg.toFixed(4)) : '-'}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Tăng điểm:</span>
                    <strong className="text-emerald-700 font-mono text-sm">
                      +{item.scoreDelta ? item.scoreDelta.toFixed(4) : '0.0000'}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: Top 30 Học Sinh Xếp Cuối Cần Theo Dõi */}
      {viewMode === 'bottom30' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 rounded-2xl p-6 text-white shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-amber-200 text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-300" />
                  Kế Hoạch Hỗ Trợ & Kèm Cặp Trọng Tâm
                </div>
                <h2 className="text-xl font-black mt-1">
                  Danh Sách 30 Học Sinh Xếp Cuối Cần Theo Dõi ({currentMonthMeta.name})
                </h2>
                <p className="text-xs text-rose-100 mt-1">
                  Thống kê các học sinh có điểm trung bình thấp nhất để giáo viên và trợ giảng kịp thời đôn đốc, phụ đạo và gửi phiếu nhận xét rèn luyện
                </p>
              </div>
              <div className="bg-black/30 px-4 py-2.5 rounded-xl border border-rose-300/30 text-center">
                <div className="text-[10px] uppercase font-bold text-amber-200">
                  Số Lượng Cần Kèm
                </div>
                <div className="text-2xl font-black font-mono">
                  {bottom30List.length}{' '}
                  <span className="text-xs font-medium text-rose-200">HS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 30 Table */}
          <div className="bg-white rounded-2xl border border-rose-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-rose-50/70 border-b border-rose-200 text-rose-950 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3 w-14 text-center">Thứ Tự</th>
                    <th className="py-3 px-3 w-20 text-center font-mono">Hạng Lớp</th>
                    <th className="py-3 px-4">Họ và Tên Học Sinh</th>
                    <th className="py-3 px-3 w-32 font-mono">Mã HS / Lớp</th>
                    <th className="py-3 px-3 text-center font-mono bg-rose-100/60 font-black">
                      ĐTB {currentMonthMeta.name}
                    </th>
                    <th className="py-3 px-3 text-center font-mono">Biến Động Hạng</th>
                    <th className="py-3 px-3">Tình Trạng & Khuyến Nghị</th>
                    <th className="py-3 px-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-100/60">
                  {bottom30List.map((item, idx) => {
                    const isVeryLow = item.currentAvg !== null && item.currentAvg < 5.0;

                    return (
                      <tr
                        key={item.student.id}
                        className="hover:bg-rose-50/30 transition-colors"
                      >
                        {/* STT */}
                        <td className="py-2.5 px-3 text-center font-mono text-slate-400 font-bold">
                          {idx + 1}
                        </td>

                        {/* Class Rank */}
                        <td className="py-2.5 px-3 text-center font-mono font-black text-rose-800">
                          #{item.rank}
                        </td>

                        {/* Student Name */}
                        <td className="py-2.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                          <button
                            onClick={() => onSelectStudent(item.student)}
                            className="hover:text-rose-700 hover:underline text-left"
                          >
                            {item.student.name}
                          </button>
                        </td>

                        {/* ID & Class */}
                        <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px] whitespace-nowrap">
                          <div>{item.student.id}</div>
                          <div className="text-[10px] text-slate-400">
                            {item.student.className === 'Lớp Chiều Chủ Nhật' ? 'Lớp chủ nhật' : item.student.className}
                          </div>
                        </td>

                        {/* Monthly Average */}
                        <td className="py-2.5 px-3 text-center font-mono font-black text-rose-900 bg-rose-50/80 text-xs">
                          {item.currentAvg !== null ? (item.currentAvg === 0 ? '0' : item.currentAvg.toFixed(4)) : '-'}
                        </td>

                        {/* Rank Delta */}
                        <td className="py-2.5 px-3 text-center">
                          {item.rankDelta === null ? (
                            <span className="text-[10px] text-slate-400">Mốc đầu</span>
                          ) : item.rankDelta < 0 ? (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              <ArrowDownRight className="w-3 h-3" />
                              {item.rankDelta} hạng
                            </span>
                          ) : item.rankDelta > 0 ? (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <ArrowUpRight className="w-3 h-3" />+{item.rankDelta}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">Giữ nguyên</span>
                          )}
                        </td>

                        {/* Recommendation Flag */}
                        <td className="py-2.5 px-3">
                          {isVeryLow ? (
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-bold text-[10px] inline-flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-rose-600" /> Cần phụ đạo gấp
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-semibold text-[10px]">
                              Nhắc nhở ôn tập
                            </span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => onSelectStudent(item.student)}
                            className="px-2.5 py-1 text-xs font-bold text-[#132A13] bg-[#ECF39E] hover:bg-[#90A955]/40 rounded-lg transition-colors shadow-2xs"
                          >
                            Xem hồ sơ
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
