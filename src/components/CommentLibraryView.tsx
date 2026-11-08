import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Award,
  AlertTriangle,
  Lightbulb,
  Search,
  Copy,
  Check,
  Sparkles,
  Layers,
  Send,
  FileCheck2,
  Plus,
  X
} from 'lucide-react';
import {
  getAllComments,
  saveNewCommentTemplate,
  CommentTemplate,
  parseCommentCodes,
  getCommentByCode
} from '../data/biologyComments';

export const CommentLibraryView: React.FC = () => {
  const [commentsList, setCommentsList] = useState<CommentTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'KT' | 'UD' | 'HC' | 'BP'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New Comment Modal / Form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<'KT' | 'UD' | 'HC' | 'BP'>('KT');
  const [newCode, setNewCode] = useState('');
  const [newContent, setNewContent] = useState('');
  const [addSuccessMessage, setAddSuccessMessage] = useState('');

  // Quick Composer State
  const [composerCodesInput, setComposerCodesInput] = useState(
    'KT02, B7_KT22, B7_UD25, B7_UD20, B8HC44, B8BP31, B8BP30'
  );
  const [composerCopied, setComposerCopied] = useState(false);

  useEffect(() => {
    setCommentsList(getAllComments());
  }, []);

  // Filter comments
  const filteredComments = useMemo(() => {
    return commentsList.filter(c => {
      const matchCat = selectedCategory === 'ALL' || c.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        c.code.toLowerCase().includes(q) ||
        c.content.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [commentsList, selectedCategory, searchQuery]);

  // Handle Add New Comment Template
  const handleAddNewComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newContent.trim()) return;

    const categoryNameMap: Record<'KT' | 'UD' | 'HC' | 'BP', string> = {
      KT: 'Kiến thức',
      UD: 'Ưu điểm',
      HC: 'Hạn chế',
      BP: 'Biện pháp khắc phục',
    };

    const newTemplate: CommentTemplate = {
      code: newCode.trim().toUpperCase(),
      category: newCategory,
      categoryName: categoryNameMap[newCategory],
      content: newContent.trim(),
    };

    saveNewCommentTemplate(newTemplate);
    setCommentsList(getAllComments());
    setAddSuccessMessage(`Đã thêm thành công mã ${newTemplate.code}!`);
    setNewCode('');
    setNewContent('');

    setTimeout(() => {
      setAddSuccessMessage('');
      setIsAddModalOpen(false);
    }, 1500);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const handleCopyText = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedCode(content);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  // Compile comments for quick composer
  const parsedComposer = useMemo(() => {
    return parseCommentCodes(composerCodesInput);
  }, [composerCodesInput]);

  const handleCopyCompiledFeedback = () => {
    const ktText = parsedComposer.kt.map(t => `• [Kiến thức] ${t}`).join('\n');
    const udText = parsedComposer.ud.map(t => `• [Ưu điểm] ${t}`).join('\n');
    const hcText = parsedComposer.hc.map(t => `• [Hạn chế] ${t}`).join('\n');
    const bpText = parsedComposer.bp.map(t => `• [Biện pháp] ${t}`).join('\n');

    const result = `🌿 PHIẾU NHẬN XÉT BÀI LUYỆN ĐỀ SINH HỌC 🌿
CLB YÊU SINH HỌC CÔ HUYỀN ANH

1. KIẾN THỨC (KT):
${ktText}

2. ƯU ĐIỂM (UD):
${udText}

3. HẠN CHẾ (HC):
${hcText}

4. BIỆN PHÁP KHẮC PHỤC (BP):
${bpText}`;

    navigator.clipboard.writeText(result);
    setComposerCopied(true);
    setTimeout(() => setComposerCopied(false), 2000);
  };

  const counts = {
    all: commentsList.length,
    kt: commentsList.filter(c => c.category === 'KT').length,
    ud: commentsList.filter(c => c.category === 'UD').length,
    hc: commentsList.filter(c => c.category === 'HC').length,
    bp: commentsList.filter(c => c.category === 'BP').length,
  };

  return (
    <div className="space-y-6">
      {/* Top Composer Hero Box */}
      <div className="bg-gradient-to-r from-[#132A13] via-[#31572C] to-[#4F772D] rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-[#90A955]/30 pb-5">
          <div>
            <div className="flex items-center gap-2 text-[#ECF39E] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Công Cụ Soạn Thảo Nhận Xét Nhanh Bằng Mã
            </div>
            <h3 className="text-xl font-black text-white mt-1">
              Bộ Ghép Nhận Xét Tự Động Theo Mã (KT, UD, HC, BP)
            </h3>
            <p className="text-xs text-slate-200 mt-0.5">
              Nhập chuỗi mã phân tách bằng dấu phẩy (vd: <code className="text-[#ECF39E] font-bold">KT02, B7_UD25, B8HC44, B8BP31</code>) để tự động biên dịch phiếu nhận xét hoàn chỉnh
            </p>
          </div>
          <button
            onClick={handleCopyCompiledFeedback}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#132A13] bg-[#ECF39E] hover:bg-white rounded-xl transition-colors shadow-md shrink-0"
          >
            {composerCopied ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
            {composerCopied ? 'Đã sao chép vào bộ nhớ!' : 'Sao chép văn bản đã ghép'}
          </button>
        </div>

        {/* Input & Output Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
          {/* Input field */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#ECF39E]">
              Nhập mã nhận xét:
            </label>
            <textarea
              rows={5}
              value={composerCodesInput}
              onChange={e => setComposerCodesInput(e.target.value)}
              placeholder="Vd: KT02, B7_UD25, B8HC44, B8BP31..."
              className="w-full p-3 text-xs font-mono bg-black/30 border border-[#90A955]/40 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ECF39E]"
            />
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <span>Mẹo: Click vào bất kỳ mã nào ở danh sách dưới để sao chép nhanh mã đó.</span>
            </div>
          </div>

          {/* Compiled Live Preview */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#ECF39E]">
              Văn bản được biên dịch tự động:
            </label>
            <div className="p-3 bg-white/10 rounded-xl border border-white/20 text-xs space-y-2 max-h-[140px] overflow-y-auto leading-relaxed text-slate-100">
              {parsedComposer.kt.length > 0 && (
                <div>
                  <strong className="text-blue-300">1. Kiến thức (KT):</strong>{' '}
                  {parsedComposer.kt.join(' ')}
                </div>
              )}
              {parsedComposer.ud.length > 0 && (
                <div>
                  <strong className="text-emerald-300">2. Ưu điểm (UD):</strong>{' '}
                  {parsedComposer.ud.join(' ')}
                </div>
              )}
              {parsedComposer.hc.length > 0 && (
                <div>
                  <strong className="text-amber-300">3. Hạn chế (HC):</strong>{' '}
                  {parsedComposer.hc.join(' ')}
                </div>
              )}
              {parsedComposer.bp.length > 0 && (
                <div>
                  <strong className="text-[#ECF39E]">4. Biện pháp (BP):</strong>{' '}
                  {parsedComposer.bp.join(' ')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Categories, Search & Add New Code Modal */}
      <div className="bg-white rounded-2xl border border-[#90A955]/30 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === 'ALL'
                  ? 'bg-[#132A13] text-[#ECF39E]'
                  : 'bg-slate-100 text-slate-700 hover:bg-[#ECF39E]/40'
              }`}
            >
              Tất cả ({counts.all})
            </button>
            <button
              onClick={() => setSelectedCategory('KT')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === 'KT'
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
              }`}
            >
              Kiến thức - KT ({counts.kt})
            </button>
            <button
              onClick={() => setSelectedCategory('UD')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === 'UD'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Ưu điểm - UD ({counts.ud})
            </button>
            <button
              onClick={() => setSelectedCategory('HC')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === 'HC'
                  ? 'bg-amber-700 text-white'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              Hạn chế - HC ({counts.hc})
            </button>
            <button
              onClick={() => setSelectedCategory('BP')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === 'BP'
                  ? 'bg-[#132A13] text-[#ECF39E]'
                  : 'bg-[#ECF39E]/30 text-[#132A13] hover:bg-[#ECF39E]/60'
              }`}
            >
              Biện pháp - BP ({counts.bp})
            </button>
          </div>

          {/* Search Box & Add New Button */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm mã hoặc từ khóa (tim, hormone, di truyền...)"
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-[#90A955]/40 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#31572C]"
              />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#31572C] hover:bg-[#132A13] rounded-lg transition-colors shrink-0 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#ECF39E]" />
              Thêm Mã Mới
            </button>
          </div>
        </div>

        {/* Comments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {filteredComments.map(c => {
            const isCopied = copiedCode === c.code || copiedCode === c.content;

            const categoryStyle = {
              KT: 'border-l-4 border-l-blue-600 bg-blue-50/20',
              UD: 'border-l-4 border-l-emerald-600 bg-emerald-50/20',
              HC: 'border-l-4 border-l-amber-600 bg-amber-50/20',
              BP: 'border-l-4 border-l-[#4F772D] bg-[#ECF39E]/15',
            }[c.category];

            return (
              <div
                key={c.code}
                className={`p-3.5 rounded-xl border border-slate-200 hover:border-[#132A13] transition-all flex flex-col justify-between ${categoryStyle}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-black text-xs text-[#132A13] bg-white px-2 py-0.5 rounded shadow-2xs border border-slate-200">
                      {c.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        c.category === 'KT'
                          ? 'bg-blue-100 text-blue-800'
                          : c.category === 'UD'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.category === 'HC'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-[#ECF39E] text-[#132A13]'
                      }`}
                    >
                      {c.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed mt-1">
                    {c.content}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => handleCopyCode(c.code)}
                    className="px-2 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"
                    title="Sao chép mã"
                  >
                    {copiedCode === c.code ? 'Đã chép mã!' : 'Chép mã'}
                  </button>
                  <button
                    onClick={() => handleCopyText(c.content)}
                    className="px-2 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"
                    title="Sao chép nội dung"
                  >
                    {copiedCode === c.content ? 'Đã chép lời!' : 'Chép nội dung'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Bổ sung mã nhận xét thủ công */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#90A955]/30 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-[#132A13]">
                Thêm Mã Nhận Xét Mới Vào Kho Mẫu
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {addSuccessMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                {addSuccessMessage}
              </div>
            )}

            <form onSubmit={handleAddNewComment} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nhóm Nhận Xét *
                </label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                >
                  <option value="KT">Kiến thức (KT)</option>
                  <option value="UD">Ưu điểm (UD)</option>
                  <option value="HC">Hạn chế (HC)</option>
                  <option value="BP">Biện pháp khắc phục (BP)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mã Nhận Xét *
                </label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={e => setNewCode(e.target.value)}
                  placeholder="Vd: KT59, UD30, HC60, BP45"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nội Dung Đoạn Văn Nhận Xét *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Nhập nội dung nhận xét chi tiết..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#132A13] hover:bg-[#31572C] rounded-lg transition-colors"
                >
                  Lưu Vào Kho Mẫu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
