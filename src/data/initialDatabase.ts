/**
 * BioGrade Canonical Initial Database (Dữ Liệu Gốc Đồng Bộ Chuẩn Hóa)
 * 
 * Toàn bộ danh sách 79 học sinh chính thức, điểm số 18 bài luyện đề thực tế,
 * và kho 192 mẫu nhận xét chuyên sâu chuẩn hóa môn Sinh học (KT, UD, HC, BP).
 * 
 * Nguồn dữ liệu duy nhất đồng bộ cho tất cả các thiết bị (máy tính, iPad, điện thoại)
 * khi truy cập web BioGrade, loại bỏ hoàn toàn hiện tượng lệch dữ liệu do localStorage.
 */

import { Student, MonthMeta, INITIAL_STUDENTS, MONTHS_CONFIG } from './studentsData';
import { CommentTemplate, BIOLOGY_COMMENTS } from './biologyComments';

export interface BioGradeDatabase {
  version: string;
  updatedAt: string;
  description: string;
  studentCount: number;
  testCount: number;
  commentsCount: number;
  students: Student[];
  comments: CommentTemplate[];
  months: MonthMeta[];
}

export const initialDatabase: BioGradeDatabase = {
  version: '2026.10.15_unified_v1',
  updatedAt: '2026-10-15',
  description: 'Bộ dữ liệu gốc chính thức của CLB Yêu Sinh Học Cô Huyền Anh (79 học sinh · 18 bài · 192 nhận xét)',
  studentCount: INITIAL_STUDENTS.length,
  testCount: 18,
  commentsCount: BIOLOGY_COMMENTS.length,
  students: INITIAL_STUDENTS,
  comments: BIOLOGY_COMMENTS,
  months: MONTHS_CONFIG,
};

// Alias defaultData theo yêu cầu
export const defaultData = initialDatabase;

/**
 * Trả về bản sao sạch (deep clone) của bộ dữ liệu gốc để đảm bảo tính bất biến
 */
export function getFreshInitialStudents(): Student[] {
  return JSON.parse(JSON.stringify(INITIAL_STUDENTS));
}

export function getFreshInitialMonths(): MonthMeta[] {
  return JSON.parse(JSON.stringify(MONTHS_CONFIG));
}

export function getFreshInitialComments(): CommentTemplate[] {
  return JSON.parse(JSON.stringify(BIOLOGY_COMMENTS));
}
