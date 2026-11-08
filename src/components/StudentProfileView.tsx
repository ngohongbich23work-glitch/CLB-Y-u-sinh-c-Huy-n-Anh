import React, { useState, useMemo } from 'react';
import {
  Search,
  UserCheck,
  TrendingUp,
  Award,
  Calendar,
  Share2,
  FileText,
  Copy,
  Check,
  Edit3,
  BookOpen,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import {
  Student,
  MONTHS_CONFIG,
  ALL_TESTS,
  MonthMeta,
  getStudentOverallAverage,
  getStudentMonthlyAverage,
  computeClassRankings
} from '../data/studentsData';
import { getCommentByCode } from '../data/biologyComments';
import { StudentProgressChart } from './StudentProgressChart';
import { FeedbackCardModal } from './FeedbackCardModal';
import { EditScoreModal } from './EditScoreModal';

interface StudentProfileViewProps {
  students: Student[];
  selectedStudent: Student;
  onSelectStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  monthsConfig?: MonthMeta[];
}

// Accent normalization helper for Vietnamese search
function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  students,
  selectedStudent,
  onSelectStudent,
  onUpdateStudent,
  monthsConfig = MONTHS_CONFIG,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMonthId, setActiveMonthId] = useState(() => monthsConfig[monthsConfig.length - 1]?.id || 'm9');
  const [exportModalTestId, setExportModalTestId] = useState<number | null>(null);
  const [editModalTestId, setEditModalTestId] = useState<number | null>(null);
  const [copiedTestId, setCopiedTestId] = useState<number | null>(null);

  const allTests = useMemo(() => monthsConfig.flatMap(m => m.tests), [monthsConfig]);

  // Search filter (hỗ trợ gõ không dấu và gợi ý tự động)
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const normalizedQuery = removeVietnameseTones(searchTerm.trim());
    return students.filter(s => {
      const nameMatch = removeVietnameseTones(s.name).includes(normalizedQuery);
      const idMatch = s.id.toLowerCase().includes(searchTerm.toLowerCase());
      return nameMatch || idMatch;
    });
  }, [searchTerm, students]);

  // Overall calculations
  const overallAvg = getStudentOverallAverage(selectedStudent) ?? 0;

  // Monthly stats
  const activeMonth = monthsConfig.find(m => m.id === activeMonthId) || monthsConfig[0];
  const monthlyAvg = getStudentMonthlyAverage(selectedStudent, activeMonthId, monthsConfig) ?? 0;

  // Month rankings and progress delta
  const classRankings = computeClassRankings(students, activeMonthId, selectedStudent.className, monthsConfig);
  const studentRankRecord = classRankings.find(r => r.student.id === selectedStudent.id);
  const currentRank = studentRankRecord ? studentRankRecord.rank : 1;
  const rankDelta = studentRankRecord?.rankDelta ?? null;
  const scoreDelta = studentRankRecord?.scoreDelta ?? null;
  const totalInClass = classRankings.length;

  const handleCopyTestComment = (testId: number) => {
    const res = selectedStudent.results[testId];
    if (!res) return;
    const testMeta = allTests.find(t => t.id === testId);
    const ktText = res.comment.ktCodes.map(c => `• [KT] ${getCommentByCode(c)}`).join('\n');
    const udText = res.comment.udCodes.map(c => `• [UD] ${getCommentByCode(c)}`).join('\n');
    const hcText = res.comment.hcCodes.map(c => `• [HC] ${getCommentByCode(c)}`).join('\n');
    const bpText = res.comment.bpCodes.map(c => `• [BP] ${getCommentByCode(c)}`).join('\n');

    const scoreLine = (res.score !== null && res.score !== undefined)
      ? `Điểm số: ${res.score === 0 ? '0' : res.score.toFixed(4).replace(/\.?0+$/, '')}/10`
      : 'Điểm số: -/10 (Chưa có điểm)';

    // BỎ lời dặn từ giáo viên/trợ giảng
    const text = `🌿 BÀI LUYỆN ĐỀ: ${testMeta?.title} - ${testMeta?.topic}
Học sinh: ${selectedStudent.name} (${selectedStudent.className})
${scoreLine}
${ktText}
${udText}
${hcText}
${bpText}`;

    navigator.clipboard.writeText(text);
    setCopiedTestId(testId);
    setTimeout(() => setCopiedTestId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Search Bar & Quick Demo Pickers */}
      <div className="bg-white rounded-2xl border border-[#90A955]/30 p-4 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Autocomplete Search Input */}
          <div className="relative w-full md:w-96">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Tìm học sinh (gõ không dấu vd: bao an, nhu binh)..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-[#90A955]/40 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#31572C] focus:bg-white transition-all text-slate-900 placeholder-slate-400 font-medium"
              />
            </div>

            {/* Dropdown Results */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#90A955]/40 rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto py-1 divide-y divide-slate-100">
                {searchResults.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectStudent(s);
                      setSearchTerm('');
                      setIsSearchOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-[#ECF39E]/30 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#132A13]">{s.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {s.id} · {s.className}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#31572C] bg-[#ECF39E] px-2 py-0.5 rounded">
                      Chọn xem
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            <span className="text-xs font-bold text-[#4F772D]">Xem nhanh:</span>
            {students.slice(0, 4).map(s => (
              <button
                key={s.id}
                onClick={() => onSelectStudent(s)}
                className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                  selectedStudent.id === s.id
                    ? 'bg-[#132A13] text-[#ECF39E] shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-[#ECF39E]/40'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Student Header Card */}
      <div className="bg-white rounded-2xl border border-[#90A955]/30 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Avatar & Basic Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#132A13] text-[#ECF39E] flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
              {selectedStudent.name.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-black text-[#132A13] tracking-tight">
                  {selectedStudent.name}
                </h1>
                <span className="px-2 py-0.5 bg-[#ECF39E] text-[#132A13] font-mono text-xs font-black rounded-md">
                  {selectedStudent.id}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1 text-[#31572C] font-bold">
                  <UserCheck className="w-3.5 h-3.5" />
                  {selectedStudent.className === 'Lớp Chiều Chủ Nhật' ? 'Lớp chủ nhật' : selectedStudent.className}
                </span>
                <span>•</span>
                <span>
                  Đã làm:{' '}
                  <strong className="text-slate-800">
                    {Object.keys(selectedStudent.results).length} bài thi
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Key Performance Badges */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
            {/* Monthly Average */}
            <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[120px]">
              <div className="text-[10px] uppercase font-bold text-[#4F772D] tracking-wider">
                ĐTB {activeMonth.name}
              </div>
              <div className="text-xl font-black text-[#132A13] font-mono mt-0.5">
                {monthlyAvg !== null ? (monthlyAvg === 0 ? '0' : monthlyAvg.toFixed(4)) : '-'}
              </div>
            </div>

            {/* Monthly Rank */}
            <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[110px]">
              <div className="text-[10px] uppercase font-bold text-[#4F772D] tracking-wider">
                Hạng {activeMonth.name}
              </div>
              <div className="text-xl font-black text-[#31572C] font-mono mt-0.5">
                {monthlyAvg !== null ? (
                  <>
                    #{currentRank}{' '}
                    <span className="text-[10px] text-slate-400 font-normal">/{totalInClass}</span>
                  </>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </div>
            </div>

            {/* Rank Delta Badge */}
            <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[120px]">
              <div className="text-[10px] uppercase font-bold text-[#4F772D] tracking-wider">
                Biến Động Hạng
              </div>
              <div className="mt-1 flex items-center justify-center">
                {rankDelta === null ? (
                  <span className="text-xs text-slate-400 font-medium">Mốc đầu</span>
                ) : rankDelta > 0 ? (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    <ArrowUpRight className="w-3.5 h-3.5" />+{rankDelta} hạng
                  </span>
                ) : rankDelta < 0 ? (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    {rankDelta} hạng
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
                    <Minus className="w-3 h-3" />
                    Giữ hạng
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Chart Component (Theo từng tháng tính từ tháng 6) */}
      <StudentProgressChart
        student={selectedStudent}
        allStudents={students}
        monthsConfig={monthsConfig}
      />

      {/* Test Scores Breakdown Across Months */}
      <div className="bg-white rounded-2xl border border-[#90A955]/30 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-sm font-black text-[#132A13] uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#31572C]" />
              Chi Tiết Kết Quả Bài Thi & Nhận Xét Chuyên Đề
            </h2>
            <p className="text-xs text-[#4F772D] font-medium">
              Theo dõi đầy đủ từ Tháng 6 đến nay gồm 4 khối nhận xét: KT, UD, HC, BP
            </p>
          </div>

          {/* Month selector tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {monthsConfig.map(month => (
              <button
                key={month.id}
                onClick={() => setActiveMonthId(month.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                  activeMonthId === month.id
                    ? 'bg-[#132A13] text-[#ECF39E] shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-[#ECF39E]/40 hover:text-[#132A13]'
                }`}
              >
                {month.name} ({month.tests.length} bài)
              </button>
            ))}
          </div>
        </div>

        {/* Test Cards Grid for Selected Month */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeMonth.tests.map(test => {
            const result = selectedStudent.results[test.id];
            const score = result?.score;
            const comment = result?.comment ?? { ktCodes: [], udCodes: [], hcCodes: [], bpCodes: [] };

            return (
              <div
                key={test.id}
                className="bg-white rounded-2xl border border-[#90A955]/30 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#132A13] text-sm">
                          {test.title}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          ({test.date})
                        </span>
                      </div>
                      <p className="text-xs text-[#31572C] font-semibold mt-0.5">
                        {test.topic}
                      </p>
                    </div>

                    {/* Score display (BỎ mức đánh giá) */}
                    <div className="text-right">
                      {score !== null && score !== undefined ? (
                        <div className="text-xl font-black text-[#132A13] font-mono">
                          {score === 0 ? '0' : score.toFixed(4).replace(/\.?0+$/, '')}
                          <span className="text-xs font-normal text-slate-400 ml-0.5">/10</span>
                        </div>
                      ) : (
                        <span className="text-base font-bold text-slate-400 font-mono">-</span>
                      )}
                    </div>
                  </div>

                  {/* 4 Comment Breakdowns: KT, UD, HC, BP - BỎ LỜI DẶN */}
                  <div className="space-y-2.5 my-3 text-xs">
                    {/* KT */}
                    <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-100">
                      <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                        Kiến thức (KT)
                      </div>
                      {comment.ktCodes.length > 0 || comment.customKt ? (
                        <div className="space-y-1 text-slate-700">
                          {comment.customKt && (
                            <p className="leading-relaxed text-slate-800 font-medium">
                              {comment.customKt}
                            </p>
                          )}
                          {comment.ktCodes.map(c => (
                            <p key={c} className="leading-relaxed">
                              <span className="font-mono font-bold text-blue-700 text-[11px] mr-1">[{c}]</span>
                              {getCommentByCode(c)}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 italic">Chưa có nhận xét</p>
                      )}
                    </div>

                    {/* UD */}
                    <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                        Ưu điểm (UD)
                      </div>
                      {comment.udCodes.length > 0 || comment.customUd ? (
                        <div className="space-y-1 text-slate-700">
                          {comment.customUd && (
                            <p className="leading-relaxed text-slate-800 font-medium">
                              {comment.customUd}
                            </p>
                          )}
                          {comment.udCodes.map(c => (
                            <p key={c} className="leading-relaxed">
                              <span className="font-mono font-bold text-emerald-700 text-[11px] mr-1">[{c}]</span>
                              {getCommentByCode(c)}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 italic">Chưa có nhận xét</p>
                      )}
                    </div>

                    {/* HC */}
                    <div className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-100">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        Hạn chế (HC)
                      </div>
                      {comment.hcCodes.length > 0 || comment.customHc ? (
                        <div className="space-y-1 text-slate-700">
                          {comment.customHc && (
                            <p className="leading-relaxed text-slate-800 font-medium">
                              {comment.customHc}
                            </p>
                          )}
                          {comment.hcCodes.map(c => (
                            <p key={c} className="leading-relaxed">
                              <span className="font-mono font-bold text-amber-700 text-[11px] mr-1">[{c}]</span>
                              {getCommentByCode(c)}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 italic">Chưa có nhận xét</p>
                      )}
                    </div>

                    {/* BP */}
                    <div className="p-2.5 rounded-lg bg-[#ECF39E]/25 border border-[#90A955]/30">
                      <div className="flex items-center gap-1.5 font-bold text-[#132A13] mb-1">
                        <Lightbulb className="w-3.5 h-3.5 text-[#31572C]" />
                        Biện pháp rèn luyện (BP)
                      </div>
                      {comment.bpCodes.length > 0 || comment.customBp ? (
                        <div className="space-y-1 text-slate-700">
                          {comment.customBp && (
                            <p className="leading-relaxed text-slate-800 font-medium">
                              {comment.customBp}
                            </p>
                          )}
                          {comment.bpCodes.map(c => (
                            <p key={c} className="leading-relaxed">
                              <span className="font-mono font-bold text-[#31572C] text-[11px] mr-1">[{c}]</span>
                              {getCommentByCode(c)}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 italic">Chưa có nhận xét</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyTestComment(test.id)}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-[#132A13] bg-slate-100 hover:bg-[#ECF39E]/50 rounded-lg transition-colors"
                    >
                      {copiedTestId === test.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Sao chép nhận xét</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setEditModalTestId(test.id)}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Sửa điểm</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setExportModalTestId(test.id)}
                    className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-white bg-[#132A13] hover:bg-[#31572C] rounded-lg transition-colors shadow-2xs"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#ECF39E]" />
                    <span>Xuất phiếu</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export Feedback Card Modal */}
      {exportModalTestId !== null && (
        <FeedbackCardModal
          student={selectedStudent}
          testId={exportModalTestId}
          allStudents={students}
          onClose={() => setExportModalTestId(null)}
          monthsConfig={monthsConfig}
        />
      )}

      {/* Edit Score Modal */}
      {editModalTestId !== null && (
        <EditScoreModal
          student={selectedStudent}
          testId={editModalTestId}
          onSave={onUpdateStudent}
          onClose={() => setEditModalTestId(null)}
        />
      )}
    </div>
  );
};
