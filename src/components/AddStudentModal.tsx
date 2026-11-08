import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { Student, STUDENT_CLASSES_OPTIONS } from '../data/studentsData';

interface AddStudentModalProps {
  onAdd: (newStudent: Student) => void;
  onClose: () => void;
  existingCount: number;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  onAdd,
  onClose,
  existingCount,
}) => {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('Lớp thứ 4');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nữ');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const nextIdNumber = existingCount + 1;
    const newId = `SH-${nextIdNumber < 10 ? `00${nextIdNumber}` : nextIdNumber < 100 ? `0${nextIdNumber}` : nextIdNumber}`;

    const newStudent: Student = {
      id: newId,
      name: name.trim().toUpperCase(),
      className,
      phone: phone.trim() || undefined,
      gender,
      results: {},
    };

    onAdd(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#90A955]/30 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#31572C]" />
            <h3 className="text-base font-extrabold text-[#132A13]">Thêm Học Sinh Mới</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#132A13] uppercase tracking-wider mb-1">
              Họ và tên học sinh *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Vd: HỒ NGỌC BẢO AN"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#90A955]/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#31572C] focus:bg-white text-slate-900 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#132A13] uppercase tracking-wider mb-1">
                Lớp học *
              </label>
              <select
                value={className}
                onChange={e => setClassName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#90A955]/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#31572C] text-slate-900 font-semibold"
              >
                {STUDENT_CLASSES_OPTIONS.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#132A13] uppercase tracking-wider mb-1">
                Giới tính
              </label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as 'Nam' | 'Nữ')}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#90A955]/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#31572C] text-slate-900"
              >
                <option value="Nữ">Nữ</option>
                <option value="Nam">Nam</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#132A13] uppercase tracking-wider mb-1">
              Số điện thoại liên hệ
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Vd: 0912345678"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#90A955]/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#31572C] focus:bg-white text-slate-900"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#132A13] hover:bg-[#31572C] rounded-lg transition-colors shadow-xs"
            >
              Lưu Học Sinh
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
