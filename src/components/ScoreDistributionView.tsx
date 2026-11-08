import React, { useState, useMemo, useRef } from 'react';
import html2canvas from 'html2canvas-pro';
import {
  BarChart3,
  Download,
  Users,
  Award,
  TrendingUp,
  Calendar,
  Layers,
  MapPin,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import {
  Student,
  ALL_TESTS,
  MONTHS_CONFIG,
  CLASSES_LIST,
  MonthMeta,
  getStudentMonthlyAverage,
  getStudentOverallAverage,
  computeClassRankings
} from '../data/studentsData';

interface ScoreDistributionViewProps {
  students: Student[];
  selectedClass: string;
  onSelectClass: (c: string) => void;
  onSelectStudent: (s: Student) => void;
  currentStudent?: Student;
  monthsConfig?: MonthMeta[];
}

interface ScoreBracket {
  rangeLabel: string;
  min: number;
  max: number;
  count: number;
  percentage: number;
  students: { student: Student; score: number }[];
}

export const ScoreDistributionView: React.FC<ScoreDistributionViewProps> = ({
  students,
  selectedClass,
  onSelectClass,
  onSelectStudent,
  currentStudent,
  monthsConfig = MONTHS_CONFIG,
}) => {
  const exportReportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportedImageUrl, setExportedImageUrl] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  // Filter mode: By Test or By Month
  const [filterType, setFilterType] = useState<'test' | 'month'>('test');
  const allTests = useMemo(() => monthsConfig.flatMap(m => m.tests), [monthsConfig]);
  const [selectedTestId, setSelectedTestId] = useState<number>(() => allTests[allTests.length - 1]?.id || 11);
  const [selectedMonthId, setSelectedMonthId] = useState<string>(() => monthsConfig[monthsConfig.length - 1]?.id || 'm9');
  const [selectedBracketIndex, setSelectedBracketIndex] = useState<number | null>(null);

  // Selected student for pinpointing red dot on histogram
  const [targetStudentId, setTargetStudentId] = useState<string>(
    () => currentStudent?.id || students[0]?.id || ''
  );

  const targetStudent = useMemo(() => {
    return students.find(s => s.id === targetStudentId) || currentStudent || students[0];
  }, [students, targetStudentId, currentStudent]);

  // Filter cohort by class
  const classCohort = useMemo(() => {
    return selectedClass === 'Tất cả lớp'
      ? students
      : students.filter(s => {
          const normClass = s.className === 'Lớp Chiều Chủ Nhật' ? 'Lớp chủ nhật' : s.className;
          return normClass === selectedClass;
        });
  }, [students, selectedClass]);

  // Extract score values for each student in the selected target
  const scoreRecords = useMemo(() => {
    if (filterType === 'test') {
      return classCohort
        .map(s => {
          const res = s.results[selectedTestId];
          const hasScore = res && res.score !== null && res.score !== undefined && typeof res.score === 'number' && !isNaN(res.score);
          return {
            student: s,
            score: hasScore ? res.score : null,
          };
        })
        .filter((item): item is { student: Student; score: number } => item.score !== null);
    } else {
      return classCohort
        .map(s => {
          const avg = getStudentMonthlyAverage(s, selectedMonthId, monthsConfig);
          return {
            student: s,
            score: avg,
          };
        })
        .filter((item): item is { student: Student; score: number } => item.score !== null);
    }
  }, [classCohort, filterType, selectedTestId, selectedMonthId, monthsConfig]);

  const scoresList = scoreRecords.map(r => r.score);

  // Target student score in this assessment
  const targetStudentScore = useMemo(() => {
    if (!targetStudent) return null;
    if (filterType === 'test') {
      const res = targetStudent.results[selectedTestId];
      return (res && res.score !== null && res.score !== undefined && typeof res.score === 'number' && !isNaN(res.score)) ? res.score : null;
    } else {
      return getStudentMonthlyAverage(targetStudent, selectedMonthId, monthsConfig);
    }
  }, [targetStudent, filterType, selectedTestId, selectedMonthId, monthsConfig]);

  // Summary stats (Tổng số HS, Điểm cao nhất, Điểm trung bình - BỎ tỉ lệ giỏi & tỉ lệ đạt)
  const stats = useMemo(() => {
    const total = scoresList.length;
    if (total === 0) {
      return {
        total: 0,
        highest: 0,
        lowest: 0,
        average: 0,
      };
    }

    const sorted = [...scoresList].sort((a, b) => a - b);
    const highest = sorted[sorted.length - 1];
    const lowest = sorted[0];
    const average = Number((sorted.reduce((a, b) => a + b, 0) / total).toFixed(4));

    return { total, highest, lowest, average };
  }, [scoresList]);

  // 10 standard distribution brackets (0 - 1, 1 - 2 ... 9 - 10)
  const brackets: ScoreBracket[] = useMemo(() => {
    const ranges = [
      { label: '0 - 1', min: 0.0, max: 1.0 },
      { label: '1 - 2', min: 1.0, max: 2.0 },
      { label: '2 - 3', min: 2.0, max: 3.0 },
      { label: '3 - 4', min: 3.0, max: 4.0 },
      { label: '4 - 5', min: 4.0, max: 5.0 },
      { label: '5 - 6', min: 5.0, max: 6.0 },
      { label: '6 - 7', min: 6.0, max: 7.0 },
      { label: '7 - 8', min: 7.0, max: 8.0 },
      { label: '8 - 9', min: 8.0, max: 9.0 },
      { label: '9 - 10', min: 9.0, max: 10.05 },
    ];

    const total = scoreRecords.length;

    return ranges.map(r => {
      const matched = scoreRecords.filter(rec => rec.score >= r.min && rec.score < r.max);
      return {
        rangeLabel: r.label,
        min: r.min,
        max: r.max,
        count: matched.length,
        percentage: total > 0 ? Number(((matched.length / total) * 100).toFixed(1)) : 0,
        students: matched,
      };
    });
  }, [scoreRecords]);

  const maxBracketCount = Math.max(...brackets.map(b => b.count), 1);

  // Find which bracket the selected target student falls into
  const studentBracketIndex = useMemo(() => {
    if (targetStudentScore === null || targetStudentScore === undefined) return -1;
    return brackets.findIndex(b => targetStudentScore >= b.min && targetStudentScore < b.max);
  }, [brackets, targetStudentScore]);

  // Current target title
  const currentTargetTitle = useMemo(() => {
    if (filterType === 'test') {
      const t = allTests.find(item => item.id === selectedTestId);
      return `${t?.title} (${t?.date}) - ${t?.topic}`;
    } else {
      const m = monthsConfig.find(item => item.id === selectedMonthId);
      return `Điểm Trung Bình ${m?.name}`;
    }
  }, [filterType, selectedTestId, selectedMonthId, allTests, monthsConfig]);

  // Active month meta for calculating student monthly ranking
  const activeMonthMeta = useMemo(() => {
    if (filterType === 'month') {
      return monthsConfig.find(m => m.id === selectedMonthId) || monthsConfig[monthsConfig.length - 1];
    }
    return (
      monthsConfig.find(m => m.tests.some(t => t.id === selectedTestId)) ||
      monthsConfig[monthsConfig.length - 1]
    );
  }, [filterType, selectedMonthId, selectedTestId, monthsConfig]);

  // Compute student monthly ranking
  const targetMonthlyRanking = useMemo(() => {
    if (!targetStudent || !activeMonthMeta) return { rank: '-', total: 0, monthName: '' };
    const cohortFilter = selectedClass === 'Tất cả lớp' ? 'Tất cả lớp' : selectedClass;
    const rankings = computeClassRankings(students, activeMonthMeta.id, cohortFilter, monthsConfig);
    const rec = rankings.find(r => r.student.id === targetStudent.id);
    return {
      rank: rec ? rec.rank : '-',
      total: rankings.length || students.length,
      monthName: activeMonthMeta.name,
    };
  }, [targetStudent, activeMonthMeta, selectedClass, students, monthsConfig]);

  // Format score with comma and maximum 4 decimal places without trailing zeros (e.g. 5,6406)
  const formatScore = (score: number | null | undefined): string => {
    if (score === null || score === undefined || isNaN(score)) return '-';
    if (score === 0) return '0';
    return score.toFixed(4).replace(/\.?0+$/, '').replace('.', ',');
  };

  // Header Title Line 1: ĐÁNH GIÁ KẾT QUẢ CÁC BÀI LUYỆN ĐỀ [THÁNG X] – MÔN SINH HỌC
  const displayMonthTitle = useMemo(() => {
    return `ĐÁNH GIÁ KẾT QUẢ CÁC BÀI LUYỆN ĐỀ ${activeMonthMeta.name.toUpperCase()} – MÔN SINH HỌC`;
  }, [activeMonthMeta]);

  // Header Title Line 2: [TÊN LỚP] - PHỔ ĐIỂM TRUNG BÌNH LỚP
  const displayClassName = useMemo(() => {
    if (selectedClass !== 'Tất cả lớp') {
      return selectedClass === 'Lớp Chiều Chủ Nhật' ? 'LỚP LUYỆN ĐỀ CHIỀU CHỦ NHẬT' : selectedClass.toUpperCase();
    }
    if (targetStudent?.className) {
      return targetStudent.className === 'Lớp Chiều Chủ Nhật'
        ? 'LỚP LUYỆN ĐỀ CHIỀU CHỦ NHẬT'
        : targetStudent.className.toUpperCase();
    }
    return 'LỚP LUYỆN ĐỀ CHIỀU CHỦ NHẬT';
  }, [selectedClass, targetStudent]);

  // Student monthly average data for Box 2 (Right Chart): THÁNG 6, THÁNG 7, THÁNG 8, THÁNG 9...
  const studentMonthlyStats = useMemo(() => {
    if (!targetStudent) return [];
    const activeIdx = monthsConfig.findIndex(m => m.id === activeMonthMeta.id);
    const monthsToConsider = activeIdx >= 0
      ? monthsConfig.slice(0, activeIdx + 1)
      : monthsConfig;

    return monthsToConsider.map(m => {
      const avg = getStudentMonthlyAverage(targetStudent, m.id, monthsConfig);
      return {
        id: m.id,
        name: m.name.toUpperCase(),
        avg,
        formattedScore: avg !== null ? (avg === 0 ? '0' : avg.toFixed(4).replace(/\.?0+$/, '').replace('.', ',')) : '-',
      };
    }).filter(m => m.avg !== null);
  }, [targetStudent, monthsConfig, activeMonthMeta]);

  // Export report as image (Phổ điểm + Biểu đồ tiến bộ cá nhân hóa theo tháng)
  const handleExportDistributionImage = async () => {
    if (!exportReportRef.current) return;
    setIsExporting(true);
    setExportError(null);
    try {
      const element = exportReportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const safeSuffix = filterType === 'test' ? `Bai_${selectedTestId}` : selectedMonthId;
      const fileName = targetStudent
        ? `${activeMonthMeta.name} - ${targetStudent.name}.png`
        : `Pho_Diem_Va_Tien_Bo_${safeSuffix}.png`;

      // Set image for immediate in-app preview modal fallback
      const dataUrl = canvas.toDataURL('image/png');
      setExportedImageUrl(dataUrl);

      // Trigger browser download via Blob
      canvas.toBlob(blob => {
        if (!blob) {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          setTimeout(() => document.body.removeChild(link), 200);
          return;
        }

        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }, 500);
      }, 'image/png');
    } catch (err) {
      console.error('Lỗi khi xuất ảnh phổ điểm:', err);
      setExportError('Không thể tạo file ảnh tự động. Vui lòng thử lại hoặc chụp màn hình phần báo cáo bên dưới.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#90A955]/30 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Switch mode */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setFilterType('test')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              filterType === 'test'
                ? 'bg-[#132A13] text-[#ECF39E] shadow-xs'
                : 'text-slate-600 hover:text-[#132A13]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Theo Từng Bài Thi
          </button>
          <button
            onClick={() => setFilterType('month')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              filterType === 'month'
                ? 'bg-[#132A13] text-[#ECF39E] shadow-xs'
                : 'text-slate-600 hover:text-[#132A13]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Theo Điểm TB Tháng
          </button>
        </div>

        {/* Dynamic target picker & Student Pinpoint Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          {filterType === 'test' ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500 font-semibold">Bài thi:</span>
              <select
                value={selectedTestId}
                onChange={e => setSelectedTestId(Number(e.target.value))}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-[#90A955]/40 rounded-lg text-[#132A13] font-bold focus:outline-none focus:ring-1 focus:ring-[#31572C] max-w-xs"
              >
                {allTests.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.date}) - {t.topic.slice(0, 32)}...
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500 font-semibold">Tháng:</span>
              <select
                value={selectedMonthId}
                onChange={e => setSelectedMonthId(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-[#90A955]/40 rounded-lg text-[#132A13] font-bold focus:outline-none focus:ring-1 focus:ring-[#31572C]"
              >
                {monthsConfig.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.tests.length} bài)
                  </option>
                ))}
              </select>
            </div>
          )}

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

          {/* Student Pinpoint Selector (Chấm đỏ xác định vị trí) */}
          <div className="flex items-center gap-1 bg-red-50/70 border border-red-200 px-2 py-1 rounded-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shrink-0" />
            <span className="text-[11px] font-bold text-red-800 whitespace-nowrap">Định vị HS:</span>
            <select
              value={targetStudentId}
              onChange={e => setTargetStudentId(e.target.value)}
              className="px-1.5 py-1 text-xs bg-white border border-red-300 rounded text-slate-900 font-bold focus:outline-none max-w-44"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.id})
                </option>
              ))}
            </select>
          </div>

          {/* Export PNG */}
          <button
            onClick={handleExportDistributionImage}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#132A13] hover:bg-[#31572C] rounded-lg transition-colors shadow-xs disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-[#ECF39E]" />
            {isExporting ? 'Đang xuất...' : 'Xuất phổ điểm (Hình ảnh PNG)'}
          </button>
        </div>
      </div>

      {/* Error Alert Banner */}
      {exportError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center justify-between text-xs text-red-700 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{exportError}</span>
          </div>
          <button
            onClick={() => setExportError(null)}
            className="text-red-500 hover:text-red-700 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* WRAPPER TO BE CAPTURED AS PNG (Chuẩn khổ A4 ngang: 1120px x 792px, vừa vặn 1 trang) */}
      <div className="w-full overflow-x-auto pb-4 flex justify-center">
        <div
          ref={exportReportRef}
          style={{
            width: '1120px',
            height: '792px',
            minWidth: '1120px',
            minHeight: '792px',
            maxWidth: '1120px',
            maxHeight: '792px',
            fontFamily: '"Times New Roman", Times, serif',
            backgroundColor: '#ffffff',
          }}
          className="p-7 text-black select-none box-border flex flex-col justify-between overflow-hidden"
        >
          {/* Header section (Centered, Times New Roman) */}
          <div className="text-center space-y-1">
            {/* Tiêu đề dòng 1: Cỡ chữ 23, In hoa, Đậm */}
            <h1 className="text-[23px] font-bold uppercase tracking-normal text-black leading-tight">
              {displayMonthTitle}
            </h1>

            {/* Tiêu đề dòng 2: Cỡ chữ 23, In hoa, Đậm */}
            <h2 className="text-[23px] font-bold uppercase tracking-normal text-black leading-tight">
              {displayClassName} - PHỔ ĐIỂM TRUNG BÌNH LỚP
            </h2>

            {/* Họ và tên: Cỡ chữ 18, In hoa, Đậm, Màu xanh lá */}
            <div className="text-[18px] font-bold uppercase text-[#1e7e34] pt-1 leading-tight">
              HỌ VÀ TÊN: {targetStudent.name.toUpperCase()}
            </div>

            {/* Điểm trung bình: Cỡ chữ 18, In hoa, Đậm, Màu đỏ */}
            <div className="text-[18px] font-bold uppercase text-[#d32f2f] pt-0.5 leading-tight">
              {targetStudentScore !== null ? `ĐIỂM TRUNG BÌNH: ${formatScore(targetStudentScore)}/10` : 'ĐIỂM TRUNG BÌNH: -'}
            </div>

            {/* Xếp hạng: Cỡ chữ 18, In hoa, Đậm, Màu đỏ */}
            <div className="text-[18px] font-bold uppercase text-[#d32f2f] pt-0.5 leading-tight">
              {targetStudentScore !== null ? `XẾP HẠNG: ${targetMonthlyRanking.rank}/${targetMonthlyRanking.total}` : 'XẾP HẠNG: -'}
            </div>
          </div>

          {/* Two Side-By-Side Boxed Charts */}
          <div className="grid grid-cols-2 gap-4 my-auto pt-2">
            {/* Box 1 (Left): PHỔ ĐIỂM TRUNG BÌNH CỦA LỚP */}
            <div
              className="border border-black bg-white p-3 flex flex-col justify-between"
              style={{ height: '480px' }}
            >
              {/* Tiêu đề hộp */}
              <div className="text-center font-bold text-[15px] uppercase text-black mb-2 tracking-wide">
                PHỔ ĐIỂM TRUNG BÌNH CỦA LỚP
              </div>

              {/* Vùng vẽ biểu đồ */}
              <div className="flex-1 flex flex-col justify-end relative">
                <div className="flex flex-1 relative">
                  {/* Nhãn trục tung xoay dọc: Số lượng học sinh */}
                  <div
                    className="flex items-center justify-center text-[12px] text-black pr-1 select-none font-normal"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                  >
                    Số lượng học sinh
                  </div>

                  {/* Lưới tọa độ và các cột */}
                  <div className="flex-1 flex flex-col justify-between relative pl-1">
                    {/* Các đường lưới ngang (30, 25, 20, 15, 10, 5, 0) */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pl-7 pb-6">
                      {[30, 25, 20, 15, 10, 5, 0].map(val => (
                        <div key={val} className="w-full border-b border-[#e0e0e0] flex items-center relative">
                          <span className="absolute -left-6 text-[11px] text-black font-normal -top-2.5 w-5 text-right">
                            {val}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* 10 Cột biểu đồ */}
                    <div className="flex-1 grid grid-cols-10 items-end pl-7 pb-6 relative z-10">
                      {brackets.map((bracket, idx) => {
                        const count = bracket.count;
                        // Chiều cao tương đối so với mốc 30
                        const heightPercent = Math.min(100, Math.round((count / 30) * 100));
                        const hasTargetStudent = studentBracketIndex === idx;

                        return (
                          <div
                            key={bracket.rangeLabel}
                            className="flex flex-col items-center justify-end h-full relative px-1 group cursor-pointer"
                            onClick={() =>
                              setSelectedBracketIndex(selectedBracketIndex === idx ? null : idx)
                            }
                          >
                            {/* Số lượng học sinh trên đỉnh cột */}
                            <div className="text-[11px] text-black mb-0.5 font-normal">
                              {count}
                            </div>

                            {/* Cột màu xanh lá */}
                            <div
                              style={{
                                height: count > 0 ? `${heightPercent}%` : '0px',
                                backgroundColor: '#2e7d32',
                                width: '100%',
                                maxWidth: '28px',
                              }}
                              className="relative"
                            >
                              {/* Điểm của con (Chấm đỏ định vị nằm chính giữa cột màu xanh) */}
                              {hasTargetStudent && targetStudentScore !== null && (
                                <div
                                  className="absolute z-20 pointer-events-none"
                                  style={{
                                    top: '50%',
                                    left: '50%',
                                    width: '0px',
                                    height: '0px',
                                  }}
                                >
                                  {/* Chấm tròn đỏ nằm chính giữa cột màu xanh */}
                                  <span
                                    style={{
                                      width: '10px',
                                      height: '10px',
                                      backgroundColor: '#d32f2f',
                                      borderRadius: '50%',
                                      display: 'inline-block',
                                      flexShrink: 0,
                                      boxShadow: '0 0 0 1.5px #ffffff',
                                      position: 'absolute',
                                      left: '0px',
                                      top: '0px',
                                      transform: 'translate(-50%, -50%)',
                                    }}
                                  />
                                  {/* Điểm số màu đỏ hiển thị bên cạnh chấm tròn */}
                                  <span
                                    style={{
                                      position: 'absolute',
                                      left: idx >= 8 ? 'auto' : '8px',
                                      right: idx >= 8 ? '8px' : 'auto',
                                      top: '0px',
                                      transform: 'translateY(-50%)',
                                      color: '#d32f2f',
                                      fontWeight: 'bold',
                                      fontSize: '12px',
                                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                      padding: '0 3px',
                                      borderRadius: '2px',
                                      border: '0.5px solid rgba(211, 47, 47, 0.3)',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {formatScore(targetStudentScore)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Đường kẻ trục hoành */}
                    <div className="border-b border-black w-full ml-7" style={{ width: 'calc(100% - 28px)' }} />

                    {/* Nhãn dải điểm (0 - 1, 1 - 2 ... 9 - 10) */}
                    <div className="grid grid-cols-10 text-center pl-7 pt-1">
                      {brackets.map(b => (
                        <div key={b.rangeLabel} className="text-[10.5px] text-black">
                          {b.rangeLabel}
                        </div>
                      ))}
                    </div>

                    {/* Chữ KHOẢNG ĐIỂM */}
                    <div className="text-center text-[12px] font-bold uppercase text-black pt-1">
                      KHOẢNG ĐIỂM
                    </div>
                  </div>
                </div>

                {/* Chú thích (Legend) */}
                <div className="flex items-center justify-center gap-6 mt-3 text-[12px] text-black">
                  <div className="flex items-center gap-1.5">
                    <span style={{ width: '13px', height: '13px', backgroundColor: '#2e7d32', display: 'inline-block' }} />
                    <span>Số lượng học sinh</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#d32f2f', display: 'inline-block' }} />
                    <span>Điểm của con</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2 (Right): ĐIỂM TRUNG BÌNH CÁC THÁNG CỦA CON */}
            <div
              className="border border-black bg-white p-3 flex flex-col justify-between"
              style={{ height: '480px' }}
            >
              {/* Tiêu đề hộp */}
              <div className="text-center font-bold text-[15px] uppercase text-black mb-2 tracking-wide">
                ĐIỂM TRUNG BÌNH CÁC THÁNG CỦA CON
              </div>

              {/* Vùng vẽ biểu đồ */}
              <div className="flex-1 flex flex-col justify-end relative">
                <div className="flex flex-1 relative">
                  {/* Nhãn trục tung xoay dọc: ĐIỂM */}
                  <div
                    className="flex items-center justify-center text-[12px] text-black font-bold pr-1 select-none"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                  >
                    ĐIỂM
                  </div>

                  {/* Lưới tọa độ và các cột */}
                  <div className="flex-1 flex flex-col justify-between relative pl-1">
                    {/* Các đường lưới ngang (10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0) */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pl-6 pb-6">
                      {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map(val => (
                        <div key={val} className="w-full border-b border-[#e0e0e0] flex items-center relative">
                          <span className="absolute -left-5 text-[11px] text-black font-normal -top-2 w-4 text-right">
                            {val}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Các cột điểm tháng màu xanh dương nhạt */}
                    <div
                      className="flex-1 flex items-end pl-6 pb-6 relative z-10"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${studentMonthlyStats.length || 4}, 1fr)`,
                      }}
                    >
                      {studentMonthlyStats.map(m => {
                        const score = m.avg ?? 0;
                        const heightPercent = Math.min(100, Math.max(0, (score / 10) * 100));

                        return (
                          <div key={m.id} className="flex flex-col items-center justify-end h-full relative px-3">
                            {/* Điểm số trên đỉnh cột */}
                            <div className="text-[11px] font-medium text-black mb-0.5">
                              {m.formattedScore}
                            </div>

                            {/* Cột màu xanh dương nhạt */}
                            <div
                              style={{
                                height: `${heightPercent}%`,
                                backgroundColor: '#85b6ff',
                                width: '100%',
                                maxWidth: '56px',
                              }}
                              className="relative"
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Đường kẻ trục hoành */}
                    <div className="border-b border-black w-full ml-6" style={{ width: 'calc(100% - 24px)' }} />

                    {/* Nhãn tháng (THÁNG 6, THÁNG 7, THÁNG 8, THÁNG 9...) */}
                    <div
                      className="text-center pl-6 pt-1"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${studentMonthlyStats.length || 4}, 1fr)`,
                      }}
                    >
                      {studentMonthlyStats.map(m => (
                        <div key={m.id} className="text-[11px] text-black font-medium">
                          {m.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Khoảng trống dưới chân để hai hộp cân xứng hoàn hảo */}
                <div className="h-6 mt-3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Bracket Student Roster Drawer (Bên ngoài tờ A4 để giáo viên khám phá học sinh không làm ảnh hưởng kích thước A4) */}
      {selectedBracketIndex !== null && (
        <div className="w-full max-w-[1120px] mx-auto bg-[#ECF39E]/20 border border-[#90A955]/40 rounded-2xl p-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#90A955]/30">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#132A13]" />
              <h4 className="text-xs font-extrabold text-[#132A13] uppercase tracking-wide">
                Danh Sách Học Sinh Dải Điểm [{brackets[selectedBracketIndex].rangeLabel}]:{' '}
                <span className="text-[#31572C]">
                  {brackets[selectedBracketIndex].count} học sinh
                </span>
              </h4>
            </div>
            <button
              onClick={() => setSelectedBracketIndex(null)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {brackets[selectedBracketIndex].count === 0 ? (
            <p className="text-xs text-slate-400 italic">Không có học sinh trong dải điểm này.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {brackets[selectedBracketIndex].students.map(item => (
                <div
                  key={item.student.id}
                  onClick={() => onSelectStudent(item.student)}
                  className="flex items-center justify-between p-2.5 bg-white border border-[#90A955]/30 rounded-xl hover:border-[#132A13] cursor-pointer transition-all shadow-2xs"
                >
                  <div>
                    <div className="text-xs font-bold text-[#132A13]">{item.student.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {item.student.id} · {item.student.className}
                    </div>
                  </div>
                  <span className="font-mono text-xs font-black text-[#132A13] bg-[#ECF39E] px-2 py-0.5 rounded">
                    {item.score.toFixed(2)}đ
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Export Preview Modal (Đảm bảo xuất ảnh 100% thành công trên mọi môi trường và iframe) */}
      {exportedImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#90A955]/40 p-6 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-extrabold text-[#132A13] flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Báo Cáo Phổ Điểm & Tiến Bộ (Hình Ảnh PNG)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tệp ảnh đã được gửi tới trình duyệt. Nếu trình duyệt chặn tự động tải, bạn có thể nhấp <strong>"Tải Về Lại"</strong> hoặc nhấp chuột phải vào ảnh và chọn <strong>"Lưu hình ảnh thành..."</strong>.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={exportedImageUrl}
                  download={`Pho_Diem_Va_Tien_Bo_${filterType === 'test' ? `Bai_${selectedTestId}` : selectedMonthId}.png`}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#132A13] text-[#ECF39E] rounded-xl text-xs font-bold hover:bg-[#31572C] transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4 text-[#ECF39E]" />
                  Tải Về Lại
                </a>
                <button
                  onClick={() => setExportedImageUrl(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-slate-100 rounded-xl my-4 flex items-center justify-center">
              <img
                src={exportedImageUrl}
                alt="Báo cáo phổ điểm & tiến bộ học sinh"
                className="max-w-full h-auto rounded-lg shadow-md border border-slate-300"
              />
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                onClick={() => setExportedImageUrl(null)}
                className="px-5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
