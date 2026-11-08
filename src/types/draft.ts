export type PendingChangeType =
  | 'update_score'
  | 'update_comment'
  | 'update_student'
  | 'add_student'
  | 'delete_student'
  | 'import_data'
  | 'update_months';

export interface PendingChange {
  id: string;
  type: PendingChangeType;
  studentId?: string;
  studentName?: string;
  testId?: number;
  testTitle?: string;
  description: string;
  timestamp: number;
}
