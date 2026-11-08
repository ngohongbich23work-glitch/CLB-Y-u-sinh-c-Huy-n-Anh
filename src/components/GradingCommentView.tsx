import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Save,
  Check,
  Copy,
  Download,
  Search,
  BookOpen,
  Award,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  UserCheck,
  Calendar,
  Layers,
  ArrowRight,
  Plus,
  Edit2,
  X
} from 'lucide-react';
import { Student, MonthMeta, MONTHS_CONFIG } from '../data/studentsData';
import {
  getAllComments,
  getCommentByCode,
  parseCommentCodes,
  extractCommentCodes,
  concatenateBlockComments,
  CommentTemplate
} from '../data/biologyComments';
import { FeedbackCardModal } from './FeedbackCardModal';

interface GradingCommentViewProps {
  students: Student[];
  currentStudent: Student;
  onSelectStudent: (s: Student) => void;
  onUpdateStudent: (s: Student) => void;
  monthsConfig?: MonthMeta[];
  onUpdateMonthsConfig?: (newMonths: MonthMeta[]) => void;
}

export const GradingCommentView: React.FC<GradingCommentViewProps> = ({
  students,
  currentStudent,
  onSelectStudent,
  onUpdateStudent,
  monthsConfig = MONTHS_CONFIG,
  onUpdateMonthsConfig,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState(currentStudent.id);
  const allTests = useMemo(() => monthsConfig.flatMap(m => m.tests), [monthsConfig]);
  const [selectedTestId, setSelectedTestId] = useState<number>(() => allTests[allTests.length - 1]?.id || 11);
  const [allComments, setAllComments] = useState<CommentTemplate[]>([]);

  // Search student
  const [studentSearch, setStudentSearch] = useState('');

  // Active student object
  const activeStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId) || currentStudent;
  }, [students, selectedStudentId, currentStudent]);

  // Active test metadata
  const activeTest = useMemo(() => {
    return allTests.find(t => t.id === selectedTestId) || allTests[0];
  }, [allTests, selectedTestId]);

  // Month metadata
  const monthMeta = useMemo(() => {
    return monthsConfig.find(m => m.tests.some(t => t.id === selectedTestId));
  }, [monthsConfig, selectedTestId]);

  // Current result of active student for active test
  const existingResult = activeStudent.results[selectedTestId];

  // Form states: Score allows manual input with up to 4 decimal places, 0 or -
  const [scoreInput, setScoreInput] = useState<string>(
    () => (existingResult && existingResult.score !== null && existingResult.score !== undefined
      ? (existingResult.score === 0 ? '0' : existingResult.score.toString())
      : '-')
  );

  // Raw code input string for auto-compilation
  const [codeChainInput, setCodeChainInput] = useState<string>(() => {
    if (existingResult?.comment) {
      const c = existingResult.comment;
      return [...c.ktCodes, ...c.udCodes, ...c.hcCodes, ...c.bpCodes].join(', ');
    }
    return 'KT02, B7_KT22, B7_UD25, B7_UD20, B8HC44, B8BP31, B8BP30';
  });

  // Individual editable text blocks (KT, UD, HC, BP - BỎ LỜI DẶN)
  const [ktBlockText, setKtBlockText] = useState('');
  const [udBlockText, setUdBlockText] = useState('');
  const [hcBlockText, setHcBlockText] = useState('');
  const [bpBlockText, setBpBlockText] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Modal State: "Cập nhật / thay đổi / mở rộng bài kiểm tra theo tháng"
  const [isManageTestsModalOpen, setIsManageTestsModalOpen] = useState(false);
  const [targetMonthForNewTest, setTargetMonthForNewTest] = useState(monthsConfig[0]?.id || 'm6');
  const [newTestTitle, setNewTestTitle] = useState('');
  const [newTestDate, setNewTestDate] = useState('');
  const [newTestTopic, setNewTestTopic] = useState('');

  // Editing existing test
  const [editingTestId, setEditingTestId] = useState<number | null>(null);
  const [editTestTitle, setEditTestTitle] = useState('');
  const [editTestDate, setEditTestDate] = useState('');
  const [editTestTopic, setEditTestTopic] = useState('');

  // Load comments repository
  useEffect(() => {
    setAllComments(getAllComments());
  }, []);

  // When student or test changes, reload existing data
  useEffect(() => {
    const res = activeStudent.results[selectedTestId];
    if (res && res.score !== null && res.score !== undefined) {
      setScoreInput(res.score === 0 ? '0' : res.score.toString());
      const chain = [
        ...res.comment.ktCodes,
        ...res.comment.udCodes,
        ...res.comment.hcCodes,
        ...res.comment.bpCodes,
      ].join(', ');
      setCodeChainInput(chain);

      // Concatenate blocks
      const concatenated = concatenateBlockComments(chain);
      setKtBlockText(concatenated.ktText || res.comment.ktCodes.map(c => getCommentByCode(c)).join(' '));
      setUdBlockText(concatenated.udText || res.comment.udCodes.map(c => getCommentByCode(c)).join(' '));
      setHcBlockText(concatenated.hcText || res.comment.hcCodes.map(c => getCommentByCode(c)).join(' '));
      setBpBlockText(concatenated.bpText || res.comment.bpCodes.map(c => getCommentByCode(c)).join(' '));
    } else if (res) {
      setScoreInput('-');
      const chain = [
        ...res.comment.ktCodes,
        ...res.comment.udCodes,
        ...res.comment.hcCodes,
        ...res.comment.bpCodes,
      ].join(', ');
      setCodeChainInput(chain);

      const concatenated = concatenateBlockComments(chain);
      setKtBlockText(concatenated.ktText || res.comment.ktCodes.map(c => getCommentByCode(c)).join(' '));
      setUdBlockText(concatenated.udText || res.comment.udCodes.map(c => getCommentByCode(c)).join(' '));
      setHcBlockText(concatenated.hcText || res.comment.hcCodes.map(c => getCommentByCode(c)).join(' '));
      setBpBlockText(concatenated.bpText || res.comment.bpCodes.map(c => getCommentByCode(c)).join(' '));
    } else {
      setScoreInput('-');
      setCodeChainInput('');
      setKtBlockText('');
      setUdBlockText('');
      setHcBlockText('');
      setBpBlockText('');
    }
  }, [activeStudent, selectedTestId]);

  // When user types in codeChainInput, auto update concatenated text blocks
  const handleCodeChainChange = (val: string) => {
    setCodeChainInput(val);
    const concatenated = concatenateBlockComments(val);
    setKtBlockText(concatenated.ktText);
    setUdBlockText(concatenated.udText);
    setHcBlockText(concatenated.hcText);
    setBpBlockText(concatenated.bpText);
  };

  // Save changes to student record
  const handleSaveResult = () => {
    const parsedCodes = extractCommentCodes(codeChainInput);
    const trimmed = scoreInput.trim();
    let finalScore: number | null = null;

    if (trimmed !== '-' && trimmed !== '') {
      const parsed = parseFloat(trimmed.replace(',', '.'));
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 10) {
        finalScore = Number(parsed.toFixed(4));
      }
    }

    const updatedStudent: Student = {
      ...activeStudent,
      results: {
        ...activeStudent.results,
        [selectedTestId]: {
          testId: selectedTestId,
          score: finalScore,
          comment: {
            ktCodes: parsedCodes.ktCodes,
            udCodes: parsedCodes.udCodes,
            hcCodes: parsedCodes.hcCodes,
            bpCodes: parsedCodes.bpCodes,
            customKt: ktBlockText,
            customUd: udBlockText,
            customHc: hcBlockText,
            customBp: bpBlockText,
          },
        },
      },
    };

    onUpdateStudent(updatedStudent);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Copy structured text to clipboard
  const handleCopyFormattedText = () => {
    const rawScore = scoreInput.trim();
    const formattedScoreText = (rawScore === '-' || rawScore === '')
      ? '-/10 (Chưa có điểm)'
      : `${rawScore === '0' ? '0' : parseFloat(rawScore).toFixed(4).replace(/\.?0+$/, '')}/10`;

    const text = `🌿 KẾT QUẢ BÀI LUYỆN ĐỀ: ${activeTest?.title} (${activeTest?.date})
Học sinh: ${activeStudent.name} (${activeStudent.className})
Điểm số: ${formattedScoreText} - Chuyên đề: ${activeTest?.topic}

1. KIẾN THỨC (KT):
${ktBlockText || '• Nắm được kiến thức nền tảng.'}

2. ƯU ĐIỂM (UD):
${udBlockText || '• Có tinh thần học tập tốt.'}

3. HẠN CHẾ (HC):
${hcBlockText || '• Cần rèn thêm kỹ năng làm bài.'}

4. BIỆN PHÁP KHẮC PHỤC (BP):
${bpBlockText || '• Ôn tập theo hướng dẫn của giáo viên.'}`;

    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  // Add new test handler
  const handleCreateNewTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestTitle.trim() || !onUpdateMonthsConfig) return;

    const maxId = Math.max(...allTests.map(t => t.id), 0);
    const newId = maxId + 1;

    const updatedMonths = monthsConfig.map(m => {
      if (m.id === targetMonthForNewTest) {
        return {
          ...m,
          tests: [
            ...m.tests,
            {
              id: newId,
              title: newTestTitle.trim(),
              date: newTestDate.trim() || '28/10',
              topic: newTestTopic.trim() || 'Luyện đề tổng hợp',
            },
          ],
        };
      }
      return m;
    });

    onUpdateMonthsConfig(updatedMonths);
    setSelectedTestId(newId);
    setNewTestTitle('');
    setNewTestDate('');
    setNewTestTopic('');
    setIsManageTestsModalOpen(false);
  };

  // Start editing existing test
  const startEditTest = (test: { id: number; title: string; date: string; topic: string }) => {
    setEditingTestId(test.id);
    setEditTestTitle(test.title);
    setEditTestDate(test.date);
    setEditTestTopic(test.topic);
  };

  // Save edited test
  const saveEditedTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestId || !onUpdateMonthsConfig) return;

    const updatedMonths = monthsConfig.map(m => ({
      ...m,
      tests: m.tests.map(t =>
        t.id === editingTestId
          ? {
              ...t,
              title: editTestTitle.trim(),
              date: editTestDate.trim(),
              topic: editTestTopic.trim(),
            }
          : t
      ),
    }));

    onUpdateMonthsConfig(updatedMonths);
    setEditingTestId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="bg-white rounded-2xl border border-[#90A955]/30 p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-[#132A13] text-[#ECF39E] rounded-xl shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#132A13]">
                Nhập Điểm & Soạn Nhận Xét Theo Mã Chuẩn Hóa
              </h2>
              <p className="text-xs text-[#4F772D] font-medium">
                Hỗ trợ điểm số 4 chữ số thập phân, tự động ghép mã nhận xét KT, UD, HC, BP thành đoạn văn liền mạch
              </p>
            </div>
          </div>
        </div>

        {/* Action: Manage / Expand Tests */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsManageTestsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-[#132A13] bg-[#ECF39E] hover:bg-[#90A955]/40 border border-[#90A955]/40 rounded-lg transition-colors shadow-2xs"
          >
            <Calendar className="w-3.5 h-3.5 text-[#31572C]" />
            Quản Lý & Thêm Bài Kiểm Tra
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Student & Test Selector */}
        <div className="space-y-4">
          {/* Student Selector Card */}
          <div className="bg-white rounded-2xl border border-[#90A955]/30 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#132A13] uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#31572C]" />
                Chọn Học Sinh
              </label>
              <span className="text-[11px] text-slate-400">
                {students.length} học sinh
              </span>
            </div>

            {/* Filter / Search student */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                placeholder="Tìm học sinh theo tên / mã..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-[#90A955]/40 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#31572C]"
              />
            </div>

            {/* Student List Dropdown / Scroll area */}
            <div className="max-h-56 overflow-y-auto space-y-1 pr-1 divide-y divide-slate-100">
              {students
                .filter(s =>
                  !studentSearch ||
                  s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                  s.id.toLowerCase().includes(studentSearch.toLowerCase())
                )
                .map(s => {
                  const isSelected = s.id === activeStudent.id;
                  const res = s.results[selectedTestId];

                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedStudentId(s.id);
                        onSelectStudent(s);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all ${
                        isSelected
                          ? 'bg-[#132A13] text-white shadow-xs'
                          : 'hover:bg-[#ECF39E]/30 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold leading-tight">{s.name}</div>
                        <div className={`text-[10px] ${isSelected ? 'text-[#ECF39E]' : 'text-slate-400'}`}>
                          {s.id} · {s.className}
                        </div>
                      </div>
                      <div className="text-right">
                        {res && res.score !== null && res.score !== undefined ? (
                          <span className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-[#31572C] text-[#ECF39E]' : 'bg-slate-100 text-[#132A13]'
                          }`}>
                            {res.score === 0 ? '0đ' : `${res.score.toFixed(2)}đ`}
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono font-bold text-slate-400 px-1.5 py-0.5 rounded bg-slate-100">-</span>
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Test Selector Card */}
          <div className="bg-white rounded-2xl border border-[#90A955]/30 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#132A13] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#31572C]" />
                Chọn Bài Luyện Đề ({allTests.length} bài)
              </label>
            </div>

            <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
              {allTests.map(t => {
                const isSelected = t.id === selectedTestId;
                const studentScore = activeStudent.results[t.id]?.score;

                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTestId(t.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-[#31572C] text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-[#ECF39E]/40 text-slate-700 border border-slate-100'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <span>{t.title}</span>
                        <span className={`text-[10px] font-normal ${isSelected ? 'text-[#ECF39E]' : 'text-slate-400'}`}>
                          ({t.date})
                        </span>
                      </div>
                      <div className={`text-[10px] truncate max-w-[190px] mt-0.5 ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                        {t.topic}
                      </div>
                    </div>
                    <div>
                      {studentScore !== null && studentScore !== undefined ? (
                        <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-[#132A13] text-[#ECF39E]' : 'bg-slate-200 text-[#132A13]'
                        }`}>
                          {studentScore === 0 ? '0' : studentScore.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-xs font-mono font-bold text-slate-400 px-1.5 py-0.5 rounded bg-slate-100">-</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (2 cols): Grading & Comments Editor */}
        <div className="lg:col-span-2 space-y-5">
          {/* Assessment Header & Score Input (Làm tròn đến 4 chữ số thập phân - BỎ MỨC ĐÁNH GIÁ) */}
          <div className="bg-white rounded-2xl border border-[#90A955]/30 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-[#31572C] uppercase tracking-wider block">
                  Đang chấm điểm cho:
                </span>
                <h3 className="text-lg font-black text-[#132A13] mt-0.5">
                  {activeStudent.name} <span className="text-xs font-normal text-slate-400 font-mono">({activeStudent.id})</span>
                </h3>
                <p className="text-xs text-[#4F772D] font-medium">
                  {activeTest?.title} ({activeTest?.date}) · Chuyên đề: <strong>{activeTest?.topic}</strong>
                </p>
              </div>

              {/* Score Input Box (Cho phép nhập điểm thủ công, làm tròn đến 4 chữ số thập phân) */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Điểm số (Thủ công)
                  </label>
                  <div className="flex items-center gap-1 mt-0.5">
                    <input
                      type="text"
                      value={scoreInput}
                      onChange={e => setScoreInput(e.target.value)}
                      placeholder="0 hoặc -"
                      className="w-28 px-2 py-1 text-base font-black font-mono text-[#132A13] bg-white border border-[#90A955]/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#31572C]"
                    />
                    <span className="text-xs font-mono text-slate-400">/ 10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Code Chain Input (Nhập chuỗi mã tự động hiển thị đoạn văn) */}
            <div className="mt-4 pt-1">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#132A13] uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Nhập Chuỗi Mã Nhận Xét (KT, UD, HC, BP)
                </label>
                <span className="text-[10px] text-slate-400">
                  Phân tách bởi dấu phẩy, vd: KT02, B7_UD25, B8HC44, B8BP31
                </span>
              </div>
              <input
                type="text"
                value={codeChainInput}
                onChange={e => handleCodeChainChange(e.target.value)}
                placeholder="Nhập các mã nhận xét (ví dụ: KT02, B7_KT22, B7_UD25, B8HC44, B8BP31)..."
                className="w-full px-3 py-2.5 text-xs font-mono bg-slate-50 border border-[#90A955]/40 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#31572C] focus:bg-white"
              />
            </div>
          </div>

          {/* 4 Editable Text Blocks (KT, UD, HC, BP - BỎ LỜI DẶN) */}
          <div className="bg-white rounded-2xl border border-[#90A955]/30 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-[#132A13] uppercase tracking-wider">
                Đoạn Văn Nhận Xét Đã Ghép Nối (Cho phép chỉnh sửa trực tiếp)
              </h3>
              <span className="text-[11px] text-slate-400">
                4 Khối Chuẩn: Kiến Thức, Ưu Điểm, Hạn Chế, Biện Pháp
              </span>
            </div>

            {/* 1. KT */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                1. Kiến Thức Trọng Tâm (KT)
              </label>
              <textarea
                rows={2}
                value={ktBlockText}
                onChange={e => setKtBlockText(e.target.value)}
                placeholder="Nhập hoặc để tự động ghép từ mã KT..."
                className="w-full p-2.5 text-xs bg-blue-50/30 border border-blue-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            {/* 2. UD */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                2. Ưu Điểm (UD)
              </label>
              <textarea
                rows={2}
                value={udBlockText}
                onChange={e => setUdBlockText(e.target.value)}
                placeholder="Nhập hoặc để tự động ghép từ mã UD..."
                className="w-full p-2.5 text-xs bg-emerald-50/30 border border-emerald-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            {/* 3. HC */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                3. Hạn Chế Cần Khắc Phục (HC)
              </label>
              <textarea
                rows={2}
                value={hcBlockText}
                onChange={e => setHcBlockText(e.target.value)}
                placeholder="Nhập hoặc để tự động ghép từ mã HC..."
                className="w-full p-2.5 text-xs bg-amber-50/30 border border-amber-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            {/* 4. BP */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#132A13] flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-[#31572C]" />
                4. Biện Pháp Rèn Luyện (BP)
              </label>
              <textarea
                rows={2}
                value={bpBlockText}
                onChange={e => setBpBlockText(e.target.value)}
                placeholder="Nhập hoặc để tự động ghép từ mã BP..."
                className="w-full p-2.5 text-xs bg-[#ECF39E]/20 border border-[#90A955]/40 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#31572C] focus:bg-white"
              />
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveResult}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#132A13] hover:bg-[#31572C] rounded-xl transition-colors shadow-xs"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-[#ECF39E]" />
                      <span>Đã Lưu Vào Hồ Sơ!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-[#ECF39E]" />
                      <span>Lưu Điểm & Nhận Xét</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCopyFormattedText}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-[#ECF39E]/40 rounded-xl transition-colors"
                >
                  {copiedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã Sao Chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Sao Chép Nhận Xét</span>
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#132A13] bg-[#ECF39E] hover:bg-[#90A955]/40 border border-[#90A955]/40 rounded-xl transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-[#31572C]" />
                Xuất Phiếu Nhận Xét (PNG)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Quản Lý & Thêm Bài Kiểm Tra Theo Tháng */}
      {isManageTestsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#90A955]/30 p-6 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#31572C]" />
                <h3 className="text-base font-extrabold text-[#132A13]">
                  Quản Lý, Thay Đổi & Mở Rộng Bài Kiểm Tra Theo Tháng
                </h3>
              </div>
              <button
                onClick={() => setIsManageTestsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form: Thêm bài mới */}
            <form onSubmit={handleCreateNewTest} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-[#132A13] uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-[#31572C]" />
                Thêm Bài Kiểm Tra Mới
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Tháng áp dụng *
                  </label>
                  <select
                    value={targetMonthForNewTest}
                    onChange={e => setTargetMonthForNewTest(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-semibold"
                  >
                    {monthsConfig.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Tên bài thi *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTestTitle}
                    onChange={e => setNewTestTitle(e.target.value)}
                    placeholder="Vd: Bài 19"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Ngày thi
                  </label>
                  <input
                    type="text"
                    value={newTestDate}
                    onChange={e => setNewTestDate(e.target.value)}
                    placeholder="Vd: 30/10"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Chuyên đề / Nội dung kiểm tra *
                </label>
                <input
                  type="text"
                  required
                  value={newTestTopic}
                  onChange={e => setNewTestTopic(e.target.value)}
                  placeholder="Vd: Tiến hóa & Sinh thái học quần thể..."
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#132A13] hover:bg-[#31572C] rounded-lg transition-colors"
                >
                  Tạo Bài Thi Mới
                </button>
              </div>
            </form>

            {/* List of existing tests with quick editing */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Danh Sách Bài Kiểm Tra Hiện Có ({allTests.length} bài)
              </h4>
              <div className="max-h-56 overflow-y-auto space-y-2 divide-y divide-slate-100 pr-1">
                {allTests.map(t => {
                  const isEditing = editingTestId === t.id;

                  return (
                    <div key={t.id} className="pt-2 flex items-center justify-between gap-3 text-xs">
                      {isEditing ? (
                        <form onSubmit={saveEditedTest} className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={editTestTitle}
                            onChange={e => setEditTestTitle(e.target.value)}
                            className="w-20 px-2 py-1 text-xs border rounded"
                          />
                          <input
                            type="text"
                            value={editTestDate}
                            onChange={e => setEditTestDate(e.target.value)}
                            className="w-20 px-2 py-1 text-xs border rounded"
                          />
                          <input
                            type="text"
                            value={editTestTopic}
                            onChange={e => setEditTestTopic(e.target.value)}
                            className="flex-1 px-2 py-1 text-xs border rounded"
                          />
                          <button
                            type="submit"
                            className="px-2 py-1 bg-emerald-600 text-white rounded font-bold"
                          >
                            Lưu
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingTestId(null)}
                            className="px-2 py-1 bg-slate-200 rounded"
                          >
                            Hủy
                          </button>
                        </form>
                      ) : (
                        <>
                          <div>
                            <span className="font-extrabold text-[#132A13] mr-2">
                              {t.title} ({t.date})
                            </span>
                            <span className="text-slate-600">{t.topic}</span>
                          </div>
                          <button
                            onClick={() => startEditTest(t)}
                            className="p-1 text-slate-500 hover:text-[#132A13] hover:bg-slate-100 rounded"
                            title="Sửa tên / nội dung bài"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Card Modal */}
      {isExportModalOpen && (
        <FeedbackCardModal
          student={activeStudent}
          testId={selectedTestId}
          allStudents={students}
          onClose={() => setIsExportModalOpen(false)}
          monthsConfig={monthsConfig}
          customScore={!isNaN(parseFloat(scoreInput)) ? parseFloat(scoreInput) : undefined}
          customTexts={{
            ktText: ktBlockText,
            udText: udBlockText,
            hcText: hcBlockText,
            bpText: bpBlockText,
          }}
        />
      )}
    </div>
  );
};
