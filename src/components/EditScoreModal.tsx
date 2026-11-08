import React, { useState } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { Student, ALL_TESTS } from '../data/studentsData';
import { BIOLOGY_COMMENTS, getCommentByCode } from '../data/biologyComments';

interface EditScoreModalProps {
  student: Student;
  testId: number;
  onSave: (updatedStudent: Student) => void;
  onClose: () => void;
}

export const EditScoreModal: React.FC<EditScoreModalProps> = ({
  student,
  testId,
  onSave,
  onClose,
}) => {
  const testMeta = ALL_TESTS.find(t => t.id === testId);
  const currentResult = student.results[testId];

  const [scoreInput, setScoreInput] = useState<string>(
    currentResult && currentResult.score !== null && currentResult.score !== undefined
      ? (currentResult.score === 0 ? '0' : currentResult.score.toString())
      : '-'
  );
  const [ktCodes, setKtCodes] = useState<string[]>(currentResult?.comment.ktCodes ?? []);
  const [udCodes, setUdCodes] = useState<string[]>(currentResult?.comment.udCodes ?? []);
  const [hcCodes, setHcCodes] = useState<string[]>(currentResult?.comment.hcCodes ?? []);
  const [bpCodes, setBpCodes] = useState<string[]>(currentResult?.comment.bpCodes ?? []);
  const [finalNote, setFinalNote] = useState<string>(currentResult?.comment.finalNote ?? '');

  const [selectedCodeToAdd, setSelectedCodeToAdd] = useState<string>('');

  const handleAddCode = (code: string) => {
    if (!code) return;
    const item = BIOLOGY_COMMENTS.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (!item) return;

    if (item.category === 'KT' && !ktCodes.includes(item.code)) {
      setKtCodes([...ktCodes, item.code]);
    } else if (item.category === 'UD' && !udCodes.includes(item.code)) {
      setUdCodes([...udCodes, item.code]);
    } else if (item.category === 'HC' && !hcCodes.includes(item.code)) {
      setHcCodes([...hcCodes, item.code]);
    } else if (item.category === 'BP' && !bpCodes.includes(item.code)) {
      setBpCodes([...bpCodes, item.code]);
    }
    setSelectedCodeToAdd('');
  };

  const handleRemoveCode = (category: 'KT' | 'UD' | 'HC' | 'BP', code: string) => {
    if (category === 'KT') setKtCodes(ktCodes.filter(c => c !== code));
    if (category === 'UD') setUdCodes(udCodes.filter(c => c !== code));
    if (category === 'HC') setHcCodes(hcCodes.filter(c => c !== code));
    if (category === 'BP') setBpCodes(bpCodes.filter(c => c !== code));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = scoreInput.trim();
    let finalScore: number | null = null;
    if (trimmed !== '-' && trimmed !== '') {
      const parsed = parseFloat(trimmed.replace(',', '.'));
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 10) {
        finalScore = Number(parsed.toFixed(4));
      }
    }

    const updated: Student = {
      ...student,
      results: {
        ...student.results,
        [testId]: {
          testId,
          score: finalScore,
          comment: {
            ktCodes,
            udCodes,
            hcCodes,
            bpCodes,
            finalNote: finalNote.trim() || undefined,
          },
        },
      },
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Cập Nhật Điểm & Nhận Xét
            </h3>
            <p className="text-xs text-slate-500">
              {student.name} · {testMeta?.title} ({testMeta?.topic})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Score input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Điểm số (Thang điểm 10, nhập 0 nếu bị 0 điểm, nhập - nếu chưa thi/chưa có điểm)
            </label>
            <input
              type="text"
              value={scoreInput}
              onChange={e => setScoreInput(e.target.value)}
              placeholder="0 hoặc -"
              className="w-full px-3 py-2 text-lg font-bold font-mono text-teal-800 bg-slate-50 border border-slate-300 rounded-lg focus:outline-teal-600 focus:bg-white"
            />
          </div>

          {/* Quick Add Code Dropdown */}
          <div className="p-3 bg-teal-50/60 border border-teal-100 rounded-xl space-y-2">
            <label className="block text-xs font-semibold text-teal-900">
              Thêm nhanh mã nhận xét từ kho ngân hàng:
            </label>
            <div className="flex gap-2">
              <select
                value={selectedCodeToAdd}
                onChange={e => setSelectedCodeToAdd(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-teal-600"
              >
                <option value="">-- Chọn mã nhận xét (KT, UD, HC, BP) --</option>
                {BIOLOGY_COMMENTS.map(c => (
                  <option key={c.code} value={c.code}>
                    [{c.code} - {c.categoryName}] {c.content.slice(0, 70)}...
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => handleAddCode(selectedCodeToAdd)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm
              </button>
            </div>
          </div>

          {/* Applied Codes Overview */}
          <div className="space-y-3">
            {/* KT */}
            <div className="text-xs">
              <span className="font-bold text-blue-700 block mb-1">Kiến thức (KT):</span>
              <div className="flex flex-wrap gap-1.5">
                {ktCodes.map(code => (
                  <span
                    key={code}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded-md font-mono text-[11px]"
                  >
                    {code}
                    <button
                      type="button"
                      onClick={() => handleRemoveCode('KT', code)}
                      className="text-blue-500 hover:text-red-600 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {ktCodes.length === 0 && <span className="text-slate-400 italic">Chưa chọn mã KT</span>}
              </div>
            </div>

            {/* UD */}
            <div className="text-xs">
              <span className="font-bold text-emerald-700 block mb-1">Ưu điểm (UD):</span>
              <div className="flex flex-wrap gap-1.5">
                {udCodes.map(code => (
                  <span
                    key={code}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md font-mono text-[11px]"
                  >
                    {code}
                    <button
                      type="button"
                      onClick={() => handleRemoveCode('UD', code)}
                      className="text-emerald-500 hover:text-red-600 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {udCodes.length === 0 && <span className="text-slate-400 italic">Chưa chọn mã UD</span>}
              </div>
            </div>

            {/* HC */}
            <div className="text-xs">
              <span className="font-bold text-amber-700 block mb-1">Hạn chế (HC):</span>
              <div className="flex flex-wrap gap-1.5">
                {hcCodes.map(code => (
                  <span
                    key={code}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-md font-mono text-[11px]"
                  >
                    {code}
                    <button
                      type="button"
                      onClick={() => handleRemoveCode('HC', code)}
                      className="text-amber-500 hover:text-red-600 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {hcCodes.length === 0 && <span className="text-slate-400 italic">Chưa chọn mã HC</span>}
              </div>
            </div>

            {/* BP */}
            <div className="text-xs">
              <span className="font-bold text-teal-700 block mb-1">Biện pháp khắc phục (BP):</span>
              <div className="flex flex-wrap gap-1.5">
                {bpCodes.map(code => (
                  <span
                    key={code}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 border border-teal-200 text-teal-800 rounded-md font-mono text-[11px]"
                  >
                    {code}
                    <button
                      type="button"
                      onClick={() => handleRemoveCode('BP', code)}
                      className="text-teal-500 hover:text-red-600 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {bpCodes.length === 0 && <span className="text-slate-400 italic">Chưa chọn mã BP</span>}
              </div>
            </div>
          </div>

          {/* Final note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Lời nhắn trực tiếp từ Giáo viên (Tùy chọn)
            </label>
            <textarea
              rows={3}
              value={finalNote}
              onChange={e => setFinalNote(e.target.value)}
              placeholder="Nhập lời dặn thêm cho học sinh hoặc phụ huynh..."
              className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:outline-teal-600 focus:bg-white"
            />
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              Lưu Kết Quả
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
