import { Student, MonthMeta, INITIAL_STUDENTS, MONTHS_CONFIG } from './studentsData';

export interface Cohort {
  id: string;
  name: string;
  schoolYear: string;
  description?: string;
  isCurrent?: boolean;
  students: Student[];
  monthsConfig: MonthMeta[];
  createdAt: string;
}

// Khởi tạo các niên khóa / khóa học mặc định
export const DEFAULT_COHORTS: Cohort[] = [
  {
    id: 'cohort_2025_2026',
    name: 'Khóa Luyện Đề 2025 - 2026 (Chính Thức)',
    schoolYear: '2025 - 2026',
    description: 'Khóa luyện đề thực chiến 79 học sinh chính thức · 18 bài luyện đề chuyên sâu (Tháng 6 - Tháng 10)',
    isCurrent: true,
    students: JSON.parse(JSON.stringify(INITIAL_STUDENTS)),
    monthsConfig: JSON.parse(JSON.stringify(MONTHS_CONFIG)),
    createdAt: '2025-06-01',
  },
  {
    id: 'cohort_2024_2025',
    name: 'Khóa Luyện Đề 2024 - 2025 (Lưu Trữ)',
    schoolYear: '2024 - 2025',
    description: 'Dữ liệu khóa trước phục vụ so sánh & đối sánh phổ điểm',
    isCurrent: false,
    students: JSON.parse(JSON.stringify(INITIAL_STUDENTS.slice(0, 25).map((s, idx) => ({
      ...s,
      id: `SH24-${(idx + 1).toString().padStart(3, '0')}`,
      results: Object.fromEntries(
        Object.entries(s.results).map(([k, v]) => [
          k,
          { ...v, score: v.score !== null ? Math.min(10, Math.max(4.0, Number((v.score + (Math.random() * 1.5 - 0.75)).toFixed(2)))) : null }
        ])
      )
    })))),
    monthsConfig: JSON.parse(JSON.stringify(MONTHS_CONFIG)),
    createdAt: '2024-06-01',
  },
];

export function getFreshInitialCohorts(): Cohort[] {
  return JSON.parse(JSON.stringify(DEFAULT_COHORTS));
}
