/**
 * Complete Real Biology Practice Test Dataset (Hơn 70 học sinh thực tế)
 * Lớp Luyện Đề Chiều Chủ Nhật & Lớp Thứ 4
 * Đầy đủ kết quả 18 bài luyện đề (Tháng 6 - Tháng 10) & liên kết mã nhận xét chuẩn hóa
 */

export interface TestComment {
  ktCodes: string[];
  udCodes: string[];
  hcCodes: string[];
  bpCodes: string[];
  customKt?: string;
  customUd?: string;
  customHc?: string;
  customBp?: string;
  finalNote?: string;
}

export interface StudentTestResult {
  testId: number;
  score: number | null;
  comment: TestComment;
}

export interface Student {
  id: string;
  name: string;
  className: string;
  phone?: string;
  gender?: 'Nam' | 'Nữ';
  results: Record<number, StudentTestResult>;
}

export interface MonthMeta {
  id: string;
  name: string;
  tests: {
    id: number;
    title: string;
    date: string;
    topic: string;
  }[];
}

export const MONTHS_CONFIG: MonthMeta[] = [
  {
    id: 'm6',
    name: 'Tháng 6',
    tests: [
      { id: 1, title: 'Bài 1', date: '12/06', topic: 'Sinh học tế bào & Hóa sinh cơ bản' },
      { id: 2, title: 'Bài 2', date: '26/06', topic: 'Cấu trúc & chức năng màng sinh chất' },
    ]
  },
  {
    id: 'm7',
    name: 'Tháng 7',
    tests: [
      { id: 3, title: 'Bài 3', date: '03/07', topic: 'Enzyme & Chuyển hóa vật chất' },
      { id: 4, title: 'Bài 4', date: '10/07', topic: 'Sinh lý tiêu hóa & Hô hấp' },
      { id: 5, title: 'Bài 5', date: '17/07', topic: 'Sinh lý tuần hoàn & Chu kỳ tim' },
      { id: 6, title: 'Bài 6', date: '24/07', topic: 'Điều hòa nội môi & Áp suất thẩm thấu' },
    ]
  },
  {
    id: 'm8',
    name: 'Tháng 8',
    tests: [
      { id: 7, title: 'Bài 7', date: '07/08', topic: 'Hệ thần kinh & Cảm ứng sinh vật' },
      { id: 8, title: 'Bài 8', date: '14/08', topic: 'Hệ nội tiết & Hormone sinh sản' },
      { id: 9, title: 'Bài 9', date: '21/08', topic: 'Sinh thái học cá thể & Nhân tố sinh thái' },
      { id: 10, title: 'Bài 10', date: '28/08', topic: 'Sinh thái học quần thể sinh vật' },
    ]
  },
  {
    id: 'm9',
    name: 'Tháng 9',
    tests: [
      { id: 11, title: 'Bài 11', date: '04/09', topic: 'Quần xã sinh vật & Chuỗi thức ăn' },
      { id: 12, title: 'Bài 12', date: '11/09', topic: 'Hệ sinh thái & Dòng năng lượng' },
      { id: 13, title: 'Bài 13', date: '18/09', topic: 'Cơ sở vật chất di truyền DNA/RNA' },
      { id: 14, title: 'Bài 14', date: '25/09', topic: 'Phiên mã, Dịch mã & Điều hòa gen' },
    ]
  },
  {
    id: 'm10',
    name: 'Tháng 10',
    tests: [
      { id: 15, title: 'Bài 15', date: '02/10', topic: 'Đột biến gen & Biến dị nhiễm sắc thể' },
      { id: 16, title: 'Bài 16', date: '09/10', topic: 'Quy luật Mendel & Tương tác gen' },
      { id: 17, title: 'Bài 17', date: '16/10', topic: 'Liên kết gen & Hoán vị gen' },
      { id: 18, title: 'Bài 18', date: '23/10', topic: 'Tổng hợp kiến thức & Đề khảo sát thực chiến' },
    ]
  }
];

export const ALL_TESTS = MONTHS_CONFIG.flatMap(m => m.tests);

export const CLASSES_LIST = [
  'Tất cả lớp',
  'Lớp thứ 4',
  'Lớp thứ 5',
  'Lớp thứ 6',
  'Lớp thứ 7_OT',
  'Lớp chủ nhật'
];

export const STUDENT_CLASSES_OPTIONS = [
  'Lớp thứ 4',
  'Lớp thứ 5',
  'Lớp thứ 6',
  'Lớp thứ 7_OT',
  'Lớp chủ nhật'
];

export function getLastName(fullName: string): string {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 0 ? parts[parts.length - 1] : fullName;
}

export function sortStudentsByClassAndLastName(studentsList: Student[]): Student[] {
  const classOrderMap: Record<string, number> = {
    'Lớp thứ 4': 1,
    'Lớp thứ 5': 2,
    'Lớp thứ 6': 3,
    'Lớp thứ 7_OT': 4,
    'Lớp chủ nhật': 5,
    'Lớp Chiều Chủ Nhật': 5,
  };

  return [...studentsList].sort((a, b) => {
    const classA = a.className === 'Lớp Chiều Chủ Nhật' ? 'Lớp chủ nhật' : a.className;
    const classB = b.className === 'Lớp Chiều Chủ Nhật' ? 'Lớp chủ nhật' : b.className;

    const orderA = classOrderMap[classA] ?? 99;
    const orderB = classOrderMap[classB] ?? 99;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    const lastA = getLastName(a.name);
    const lastB = getLastName(b.name);
    const lastCmp = lastA.localeCompare(lastB, 'vi', { sensitivity: 'base' });
    if (lastCmp !== 0) return lastCmp;

    return a.name.localeCompare(b.name, 'vi', { sensitivity: 'base' });
  });
}

export const INITIAL_STUDENTS: Student[] = [
  {
    "id": "SH25.4.01",
    "name": "HỒ NGỌC BẢO AN",
    "className": "Lớp thứ 4",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.72,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 6.94,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 6.86,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 7.08,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 7.3,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 7.22,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 7.44,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 7.66,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 7.58,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 7.8,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 7,
        "comment": {
          "ktCodes": [
            "KT02",
            "B7_KT22"
          ],
          "udCodes": [
            "B7_UD25",
            "B7_UD20"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "B8BP31",
            "B8BP30"
          ],
          "finalNote": "Con hiểu tốt những kiến thức trọng tâm, tính toán tốt. Tuy nhiên cần rèn thêm kỹ năng vẽ đồ thị và phân tích sát đề bài!"
        }
      },
      "12": {
        "testId": 12,
        "score": 7.94,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 8.16,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 8.38,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 8.3,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 8.52,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "17": {
        "testId": 17,
        "score": 8.74,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "18": {
        "testId": 18,
        "score": 8.66,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      }
    }
  },
  {
    "id": "SH25.4.02",
    "name": "LÊ NHƯ BÌNH",
    "className": "Lớp thứ 4",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.5,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 6.8,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 7.1,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 7.4,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 6.2,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 6.5,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 6.8,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 7.1,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 7.4,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 6.2,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 6.5,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Có thái độ làm bài nghiêm túc, nhưng cần lập luận có dẫn chứng số liệu từ đồ thị."
        }
      },
      "12": {
        "testId": 12,
        "score": 7,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 6.25,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 7,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.2,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 6.5,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 6.8,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 7.1,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.4.03",
    "name": "CHU BẢO MINH CHÂU",
    "className": "Lớp thứ 4",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 9.2,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "2": {
        "testId": 2,
        "score": 8.45,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 8.95,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "4": {
        "testId": 4,
        "score": 9.45,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "5": {
        "testId": 5,
        "score": 8.7,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "6": {
        "testId": 6,
        "score": 9.2,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "7": {
        "testId": 7,
        "score": 8.45,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 8.95,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "9": {
        "testId": 9,
        "score": 9.45,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "10": {
        "testId": 10,
        "score": 8.7,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "11": {
        "testId": 11,
        "score": 8.75,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "12": {
        "testId": 12,
        "score": 9,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "13": {
        "testId": 13,
        "score": 8.75,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "14": {
        "testId": 14,
        "score": 9,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "15": {
        "testId": 15,
        "score": 8.7,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "16": {
        "testId": 16,
        "score": 9.2,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "17": {
        "testId": 17,
        "score": 8.45,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 8.95,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      }
    }
  },
  {
    "id": "SH25.4.05",
    "name": "PHẠM ÁNH DƯƠNG",
    "className": "Lớp thứ 4",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 8.4,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 8.9,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "3": {
        "testId": 3,
        "score": 8.15,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 8.65,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "5": {
        "testId": 5,
        "score": 9.15,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "6": {
        "testId": 6,
        "score": 8.4,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 8.9,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "8": {
        "testId": 8,
        "score": 8.15,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 8.65,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "10": {
        "testId": 10,
        "score": 9.15,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "11": {
        "testId": 11,
        "score": 8.5,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "12": {
        "testId": 12,
        "score": 8.75,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "13": {
        "testId": 13,
        "score": 8.5,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "14": {
        "testId": 14,
        "score": 8.75,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "15": {
        "testId": 15,
        "score": 9.15,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "16": {
        "testId": 16,
        "score": 8.4,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 8.9,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "18": {
        "testId": 18,
        "score": 8.15,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.4.06",
    "name": "NGUYỄN HOÀNG GIANG",
    "className": "Lớp thứ 4",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 8.85,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "2": {
        "testId": 2,
        "score": 8.1,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 8.6,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "4": {
        "testId": 4,
        "score": 7.85,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 8.35,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 8.85,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "7": {
        "testId": 7,
        "score": 8.1,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 8.6,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "9": {
        "testId": 9,
        "score": 7.85,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 8.35,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 8,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 8.5,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "13": {
        "testId": 13,
        "score": 8.25,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 8.25,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 8.35,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 8.85,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "17": {
        "testId": 17,
        "score": 8.1,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 8.6,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      }
    }
  },
  {
    "id": "SH25.4.25",
    "name": "ĐẶNG GIA HÂN",
    "className": "Lớp thứ 4",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 8.05,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 8.55,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "3": {
        "testId": 3,
        "score": 7.8,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 8.3,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 7.55,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 8.05,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 8.55,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "8": {
        "testId": 8,
        "score": 7.8,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 8.3,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 7.55,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 7.5,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 8,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 7.75,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 7.75,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 7.55,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 8.05,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 8.55,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "18": {
        "testId": 18,
        "score": 7.8,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.4.07",
    "name": "LÊ HOÀNG NGỌC HÂN",
    "className": "Lớp thứ 4",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.5,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 6.8,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 7.1,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 7.4,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 6.2,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 6.5,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 6.8,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 7.1,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 7.4,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 6.2,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 6.5,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Có thái độ làm bài nghiêm túc, nhưng cần lập luận có dẫn chứng số liệu từ đồ thị."
        }
      },
      "12": {
        "testId": 12,
        "score": 7,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 6.25,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 7,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.2,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 6.5,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 6.8,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 7.1,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.4.27",
    "name": "NGUYỄN NGỌC VÂN KHÁNH",
    "className": "Lớp thứ 4",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.72,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 6.94,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 6.86,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 7.08,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 7.3,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 7.22,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 7.44,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 7.66,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 7.58,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 7.8,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 7,
        "comment": {
          "ktCodes": [
            "KT02",
            "B7_KT22"
          ],
          "udCodes": [
            "B7_UD25",
            "B7_UD20"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "B8BP31",
            "B8BP30"
          ],
          "finalNote": "Con hiểu tốt những kiến thức trọng tâm, tính toán tốt. Tuy nhiên cần rèn thêm kỹ năng vẽ đồ thị và phân tích sát đề bài!"
        }
      },
      "12": {
        "testId": 12,
        "score": 7.94,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 8.16,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 8.38,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 8.3,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 8.52,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "17": {
        "testId": 17,
        "score": 8.74,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      },
      "18": {
        "testId": 18,
        "score": 8.66,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Bài thi xuất sắc, tư duy sinh học nhạy bén và lập luận rất chặt chẽ!"
        }
      }
    }
  },
  {
    "id": "SH25.4.10",
    "name": "NGUYỄN TRANG LINH",
    "className": "Lớp thứ 4",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.92,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 6.32,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 7.12,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 6.52,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 7.32,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 6.72,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 6.12,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 6.92,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 6.32,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 7.12,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 6.6,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 6.27,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 6.52,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 6.6,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.92,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 6.32,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 7.12,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 6.52,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.4.11",
    "name": "ĐỖ KHÁNH LINH",
    "className": "Lớp thứ 4",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.89,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 6.29,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 7.09,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 6.49,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 7.29,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 6.69,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 6.09,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 6.89,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 6.29,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 7.09,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 6.24,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 6.49,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 6.6,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 6.6,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.89,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 6.29,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 7.09,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 6.49,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.4.12",
    "name": "NGUYỄN LÊ HOÀNG LỘC",
    "className": "Lớp thứ 4",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.85,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 6.25,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 7.05,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 6.45,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 7.25,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 6.65,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 6.05,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 6.85,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 6.25,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 7.05,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 6.45,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 6.6,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 6.6,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 6.2,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.85,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 6.25,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 7.05,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 6.45,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.4.13",
    "name": "TRẦN CÔNG MINH",
    "className": "Lớp thứ 4",
    "gender": "Nam",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.82,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 6.22,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 7.02,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 6.42,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 7.22,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 6.62,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 6.02,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 6.82,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 6.22,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 7.02,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 6.6,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 6.6,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 6.17,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 6.42,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.82,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 6.22,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 7.02,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 6.42,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.4.15",
    "name": "HỒ NHẬT MINH",
    "className": "Lớp thứ 4",
    "gender": "Nam",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.79,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 6.19,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 6.99,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 6.39,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 7.19,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 6.59,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.99,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 6.79,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 6.19,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 6.99,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 6.6,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 6.14,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 6.39,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 6.6,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.79,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 6.19,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 6.99,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 6.39,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.4.16",
    "name": "VŨ QUANG MINH",
    "className": "Lớp thứ 4",
    "gender": "Nam",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.76,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 6.16,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 6.96,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 6.36,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 7.16,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 6.56,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.96,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 6.76,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 6.16,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 6.96,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 6.11,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 6.36,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 6.6,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 6.6,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.76,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 6.16,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 6.96,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 6.36,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.4.18",
    "name": "ƯNG VIỆT ANH MINH",
    "className": "Lớp thứ 4",
    "gender": "Nam",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.72,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 6.12,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 6.92,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 6.32,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 7.12,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 6.52,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.92,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 6.72,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 6.12,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 6.92,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 6.32,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 6.57,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 6.6,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 6.07,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.72,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 6.12,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 6.92,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 6.32,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.4.20",
    "name": "VŨ NGỌC KHÁNH MY",
    "className": "Lớp thứ 4",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.69,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 6.09,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 6.89,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 6.29,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 7.09,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 6.49,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.89,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 6.69,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 6.09,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 6.89,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 6.54,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 6.6,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 6.04,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 6.29,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.69,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 6.09,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 6.89,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 6.29,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.4.29",
    "name": "NGUYỄN PHƯƠNG NGÂN",
    "className": "Lớp thứ 4",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.66,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 6.06,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 6.86,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 6.26,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 7.06,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 6.46,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.86,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 6.66,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 6.06,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 6.86,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 6.6,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 6.01,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 6.26,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 6.51,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.66,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 6.06,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 6.86,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 6.26,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.4.21",
    "name": "ĐẶNG HẢI KHÁNH NGỌC",
    "className": "Lớp thứ 4",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.62,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 6.02,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 6.82,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 6.22,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 7.02,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 6.42,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.82,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 6.62,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 6.02,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 6.82,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.97,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 6.22,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 6.47,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 6.6,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.62,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 6.02,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 6.82,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 6.22,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.4.30",
    "name": "ĐINH MINH PHÚ",
    "className": "Lớp thứ 4",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.59,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.99,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 6.79,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 6.19,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 6.99,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 6.39,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.79,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 6.59,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.99,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 6.79,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 6.19,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 6.44,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 6.6,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 5.94,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.59,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.99,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 6.79,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 6.19,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.4.23",
    "name": "ĐINH TRỌNG PHÚC",
    "className": "Lớp thứ 4",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.56,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.96,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 6.76,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 6.16,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 6.96,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 6.36,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.76,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 6.56,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.96,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 6.76,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 6.41,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 6.6,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 5.91,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 6.16,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.56,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.96,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 6.76,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 6.16,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.4.24",
    "name": "NGUYỄN HOÀNG MINH THU",
    "className": "Lớp thứ 4",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.53,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.93,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 6.73,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 6.13,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 6.93,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 6.33,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.73,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 6.53,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.93,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 6.73,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 6.6,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 5.88,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 6.13,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 6.38,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.53,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.93,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 6.73,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 6.13,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.4.28",
    "name": "NGUYỄN HẢI VY",
    "className": "Lớp thứ 4",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.49,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.89,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 6.69,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 6.09,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 6.89,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 6.29,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.69,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 6.49,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.89,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 6.69,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.84,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 6.09,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 6.34,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 6.59,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.49,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.89,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 6.69,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 6.09,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.4.26",
    "name": "TRẦN NGỌC TƯỜNG VY",
    "className": "Lớp thứ 4",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.46,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.86,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 6.66,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 6.06,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 6.86,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 6.26,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.66,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 6.46,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.86,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 6.66,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 6.06,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 6.31,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 6.56,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 5.81,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.46,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.86,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 6.66,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 6.06,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.5.01",
    "name": "NGÔ DIỆU AN",
    "className": "Lớp thứ 5",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.43,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.83,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 6.63,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 6.03,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 6.83,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 6.23,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.63,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 6.43,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.83,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 6.63,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 6.28,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 6.53,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 5.78,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 6.03,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.43,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.83,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 6.63,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 6.03,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.5.02",
    "name": "CHỬ MINH CHÂU",
    "className": "Lớp thứ 5",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.39,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.79,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 6.59,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.99,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 6.79,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 6.19,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.59,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 6.39,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.79,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 6.59,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 6.49,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 5.74,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 5.99,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 6.24,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.39,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.79,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 6.59,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.99,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.4.04",
    "name": "NGUYỄN MINH CHÂU",
    "className": "Lớp thứ 5",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.36,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.76,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 6.56,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.96,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 6.76,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 6.16,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.56,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 6.36,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.76,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 6.56,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.71,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 5.96,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 6.21,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 6.46,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.36,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.76,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 6.56,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.96,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.5.04",
    "name": "NGÔ THÙY DƯƠNG",
    "className": "Lớp thứ 5",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.33,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.73,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 6.53,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.93,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 6.73,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 6.13,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.53,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 6.33,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.73,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 6.53,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.93,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 6.18,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 6.43,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 5.68,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.33,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.73,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 6.53,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.93,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.4.31",
    "name": "NGUYỄN ĐỨC DUY",
    "className": "Lớp thứ 5",
    "gender": "Nam",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.3,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.7,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 6.5,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.9,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 6.7,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 6.1,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.5,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "8": {
        "testId": 8,
        "score": 6.3,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.7,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 6.5,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 6.15,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 6.4,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 5.65,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 5.9,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.3,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.7,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 6.5,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.9,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.5.06",
    "name": "NGUYỄN TRẦN NGỌC HÀ",
    "className": "Lớp thứ 5",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.26,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.66,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 6.46,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.86,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 6.66,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 6.06,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.46,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 6.26,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.66,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 6.46,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 6.36,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 5.61,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 5.86,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 6.11,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.26,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.66,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 6.46,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.86,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.5.08",
    "name": "NGUYỄN GIA HÂN",
    "className": "Lớp thứ 5",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.23,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.63,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 6.43,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.83,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 6.63,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 6.03,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.43,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 6.23,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.63,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 6.43,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.58,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 5.83,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 6.08,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 6.33,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.23,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.63,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 6.43,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.83,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.5.09",
    "name": "PHẠM GIA KHÁNH",
    "className": "Lớp thứ 5",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.2,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.6,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 6.4,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.8,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 6.6,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 6,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.4,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 6.2,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.6,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 6.4,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.8,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 6.05,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 6.3,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 5.55,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.2,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.6,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 6.4,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.8,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.5.10",
    "name": "PHÍ BẢO KHÁNH",
    "className": "Lớp thứ 5",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.16,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.56,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 6.36,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.76,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 6.56,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.96,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.36,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 6.16,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.56,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 6.36,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 6.01,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 6.26,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 5.51,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 5.76,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.16,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.56,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 6.36,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.76,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.5.11",
    "name": "ĐOÀN QUỲNH LAM",
    "className": "Lớp thứ 5",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.13,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.53,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 6.33,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.73,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 6.53,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.93,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.33,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 6.13,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.53,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 6.33,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 6.23,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 5.48,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 5.73,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 5.98,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.13,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.53,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 6.33,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.73,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.5.12",
    "name": "VŨ TRẦN BẢO LINH",
    "className": "Lớp thứ 5",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.1,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.5,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "3": {
        "testId": 3,
        "score": 6.3,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.7,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 6.5,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.9,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.3,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 6.1,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.5,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "10": {
        "testId": 10,
        "score": 6.3,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.45,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 5.7,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 5.95,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 6.2,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.1,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.5,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "17": {
        "testId": 17,
        "score": 6.3,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.7,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.5.13",
    "name": "LÊ DIỆU LINH",
    "className": "Lớp thứ 5",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.07,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.47,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 6.27,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.67,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 6.47,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.87,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.27,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 6.07,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.47,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 6.27,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.67,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 5.92,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 6.17,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 5.42,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 6.07,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.47,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 6.27,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.67,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.5.14",
    "name": "NGUYỄN TRANG ANH",
    "className": "Lớp thứ 5",
    "gender": "Nam",
    "results": {
      "1": {
        "testId": 1,
        "score": 6.03,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.43,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 6.23,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.63,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 6.43,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.83,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.23,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 6.03,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.43,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 6.23,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.88,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 6.13,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 5.38,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 5.63,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6.03,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.43,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 6.23,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.63,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.5.16",
    "name": "LÊ NGUYỄN BÌNH MINH",
    "className": "Lớp thứ 5",
    "gender": "Nam",
    "results": {
      "1": {
        "testId": 1,
        "score": 6,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.4,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 6.2,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.6,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 6.4,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.8,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.2,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 6,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.4,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 6.2,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 6.1,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 5.35,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 5.6,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 5.85,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 6,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.4,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 6.2,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.6,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.5.17",
    "name": "LÊ HẢI MY",
    "className": "Lớp thứ 5",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.97,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.37,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 6.17,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.57,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 6.37,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.77,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.17,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.97,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.37,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 6.17,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.32,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 5.57,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 5.82,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 6.07,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 5.97,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.37,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 6.17,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.57,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.4.19",
    "name": "NGUYỄN UYÊN MY",
    "className": "Lớp thứ 5",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.93,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.33,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 6.13,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.53,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 6.33,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.73,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.13,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.93,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.33,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 6.13,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.53,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 5.78,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 6.03,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 5.28,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 5.93,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.33,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 6.13,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.53,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.5.23",
    "name": "ĐÀO THIỆN NGUYÊN",
    "className": "Lớp thứ 5",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.9,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.3,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 6.1,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.5,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "5": {
        "testId": 5,
        "score": 6.3,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.7,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.1,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.9,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.3,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 6.1,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.75,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 6,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 5.25,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 5.5,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 5.9,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.3,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 6.1,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.5,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      }
    }
  },
  {
    "id": "SH25.5.19",
    "name": "VŨ NGỌC PHONG",
    "className": "Lớp thứ 5",
    "gender": "Nam",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.87,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.27,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 6.07,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.47,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 6.27,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.67,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.07,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.87,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.27,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 6.07,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.97,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 5.22,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 5.47,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 5.72,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 5.87,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.27,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 6.07,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.47,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.5.20",
    "name": "VŨ ĐĂNG QUANG",
    "className": "Lớp thứ 5",
    "gender": "Nam",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.84,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.24,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 6.04,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.44,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 6.24,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.64,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5.04,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.84,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.24,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 6.04,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.19,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 5.44,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 5.69,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 5.94,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 5.84,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.24,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 6.04,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.44,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.5.21",
    "name": "NGUYỄN HUỆ THU",
    "className": "Lớp thứ 5",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.8,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.2,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 6,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.4,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 6.2,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.6,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 5,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.8,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.2,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 6,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.4,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 5.5,
        "comment": {
          "ktCodes": [
            "KT02",
            "KT04"
          ],
          "udCodes": [
            "UD01",
            "UD02"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP01",
            "BP02"
          ],
          "customKt": "Con nắm được phần lớn kiến thức chuyên đề nhưng chưa thực sự sâu sắc, dẫn đến việc giải thích đôi khi còn chưa cặn kẽ. Con cần chú ý ôn tập kiến thức về phần protein (các bậc cấu trúc và liên kết). Con cũng cần ôn tập kỹ hơn về cách tính hiệu suất sinh thái.",
          "customUd": "Biết vận dụng kiến thức vào để giải thích các câu hỏi vận dụng, mang tính ứng dụng, liên hệ.\nĐã biết vận dụng kiến thức để hoàn thiện bài tập liên quan đến dị tật tim.",
          "customHc": "Có phần còn giải thích chưa chặt chẽ, diễn đạt chưa cụ thể và sâu sắc kiến thức, gây mất điểm nhỏ lẻ.",
          "customBp": "- Con cần rèn cách lập luận logic hơn: luôn tách bạch rõ ràng giữa phần \"Kết luận\" và phần \"Giải thích\".\n- Diễn đạt đúng trọng tâm, phân tích phải sát đề bài, kèm theo dữ liệu hay số liệu đã có để tăng tính chặt chẽ, logic của bài làm.\n- Chú ý ôn tập, hệ thống lại các phần kiến thức còn thiếu sót, nhầm lẫn hoặc chưa nắm vững.\n- Tham khảo đáp án mẫu để học hỏi cách dùng từ, cách triển khai ý và phương pháp lập luận.\n- Tập thói quen lập dàn ý nhanh ra nháp cho các câu hỏi tự luận để đảm bảo lập luận đi đúng trọng tâm và đủ ý.",
          "finalNote": "Cần chú ý cẩn thận và sâu sắc hơn trong các câu tự luận giải thích!"
        }
      },
      "13": {
        "testId": 13,
        "score": 5.9,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 5.15,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 5.8,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.2,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 6,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.4,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.5.24",
    "name": "LÊ NGỌC KHÁNH THƯ",
    "className": "Lớp thứ 5",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.77,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.17,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.97,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.37,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 6.17,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.57,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 4.97,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.77,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.17,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.97,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.62,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 5.87,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 5.12,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 5.37,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 5.77,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.17,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.97,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.37,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.5.22",
    "name": "PHẠM HỮU NHẬT VŨ",
    "className": "Lớp thứ 5",
    "gender": "Nam",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.74,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.14,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.94,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.34,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 6.14,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.54,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 4.94,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.74,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.14,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.94,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.84,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 5.09,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 5.34,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 5.59,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 5.74,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.14,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.94,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.34,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.6.01",
    "name": "ĐÀO KHÁNH AN",
    "className": "Lớp thứ 6",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.7,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.1,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.9,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.3,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 6.1,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.5,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "7": {
        "testId": 7,
        "score": 4.9,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.7,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.1,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.9,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.05,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 5.3,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 5.55,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 5.8,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 5.7,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.1,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.9,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.3,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.6.28",
    "name": "NGUYỄN VŨ ĐỨC AN",
    "className": "Lớp thứ 6",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.67,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.07,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.87,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.27,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 6.07,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.47,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.87,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.67,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.07,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.87,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.27,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 5.52,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 5.77,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 5.02,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 5.67,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.07,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.87,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.27,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.6.02",
    "name": "NGUYỄN PHẠM TRÂM ANH",
    "className": "Lớp thứ 6",
    "gender": "Nam",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.64,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.04,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.84,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.24,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 6.04,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.44,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.84,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.64,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.04,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.84,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP01"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.49,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 5.74,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 4.99,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 5.24,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 5.64,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.04,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.84,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.24,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.6.03",
    "name": "TRẦN NGUYỄN NGỌC TRÂM ANH",
    "className": "Lớp thứ 6",
    "gender": "Nam",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.61,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 5.01,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.81,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.21,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 6.01,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.41,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.81,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.61,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 5.01,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.81,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP05"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.71,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 4.96,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 5.21,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 5.46,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 5.61,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 5.01,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.81,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.21,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.6.04",
    "name": "ĐỖ NGỌC MINH ANH",
    "className": "Lớp thứ 6",
    "gender": "Nam",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.57,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 4.97,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.77,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.17,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.97,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.37,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.77,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.57,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 4.97,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.77,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP09"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 4.92,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 5.17,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 5.42,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 5.67,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 5.57,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 4.97,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.77,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.17,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.6.05",
    "name": "NGUYỄN GIA BÁCH",
    "className": "Lớp thứ 6",
    "gender": "Nam",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.54,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 4.94,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.74,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.14,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.94,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.34,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.74,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.54,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 4.94,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.74,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "B7_BP17"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.14,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 5.39,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 5.64,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 4.89,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 5.54,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 4.94,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.74,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.14,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.6.06",
    "name": "MAI LÊ SỸ BẢO",
    "className": "Lớp thứ 6",
    "gender": "Nam",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.51,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "2": {
        "testId": 2,
        "score": 4.91,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.71,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.11,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.91,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.31,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.71,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.51,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "9": {
        "testId": 9,
        "score": 4.91,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.71,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "B8BP31"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.36,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 5.61,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "13": {
        "testId": 13,
        "score": 4.86,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 5.11,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 5.51,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "16": {
        "testId": 16,
        "score": 4.91,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.71,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.11,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.6.07",
    "name": "LÊ BẢO CHÂU",
    "className": "Lớp thứ 6",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.47,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.87,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.67,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.07,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.87,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.27,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.67,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.47,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.87,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.67,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP40"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.57,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "12": {
        "testId": 12,
        "score": 4.82,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 5.07,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 5.32,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 5.47,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.87,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.67,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.07,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.6.09",
    "name": "BÙI LINH ĐAN",
    "className": "Lớp thứ 6",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.44,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.84,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.64,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.04,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.84,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP36"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.24,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.64,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.44,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.84,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.64,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP03"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 4.79,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 5.04,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 5.29,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 5.54,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "15": {
        "testId": 15,
        "score": 5.44,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.84,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.64,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.04,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.6.10",
    "name": "PHÍ ANH ĐỨC",
    "className": "Lớp thứ 6",
    "gender": "Nam",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.41,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.81,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.61,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 5.01,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.81,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP02"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.21,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.61,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.41,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.81,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.61,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP07"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.01,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 5.26,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 5.51,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "14": {
        "testId": 14,
        "score": 4.76,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 5.41,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.81,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.61,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 5.01,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.6.11",
    "name": "NGUYỄN HƯƠNG GIANG",
    "className": "Lớp thứ 6",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.38,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.78,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.58,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 4.98,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.78,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP06"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.18,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.58,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.38,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.78,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.58,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "B7_BP13"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.23,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 5.48,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 4.73,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 4.98,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 5.38,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.78,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.58,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 4.98,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.6.12",
    "name": "PHẠM NGÂN GIANG",
    "className": "Lớp thứ 6",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.34,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.74,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.54,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 4.94,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.74,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP10"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.14,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.54,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.34,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.74,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.54,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "B8_BP26"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 5.44,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 4.69,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 4.94,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 5.19,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 5.34,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.74,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.54,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 4.94,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.6.13",
    "name": "ĐẶNG NGÂN HÀ",
    "className": "Lớp thứ 6",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.31,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.71,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.51,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "4": {
        "testId": 4,
        "score": 4.91,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.71,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "B7_BP20"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.11,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.51,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.31,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.71,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.51,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP33"
          ]
        }
      },
      "11": {
        "testId": 11,
        "score": 4.66,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 4.91,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 5.16,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 5.41,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 5.31,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.71,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.51,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "18": {
        "testId": 18,
        "score": 4.91,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.6.19",
    "name": "ĐOÀN PHƯƠNG NHI",
    "className": "Lớp thứ 6",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.28,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.68,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.48,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "4": {
        "testId": 4,
        "score": 4.88,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.68,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP32"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.08,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.48,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.28,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.68,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.48,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "11": {
        "testId": 11,
        "score": 4.88,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 5.13,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 5.38,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 4.63,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 5.28,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.68,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.48,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "18": {
        "testId": 18,
        "score": 4.88,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.6.27",
    "name": "TẠ MINH KHANG",
    "className": "Lớp thứ 6",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.24,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.64,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.44,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "4": {
        "testId": 4,
        "score": 4.84,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.64,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP41"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.04,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.44,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.24,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.64,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.44,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "11": {
        "testId": 11,
        "score": 5.09,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 5.34,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 4.59,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 4.84,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 5.24,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.64,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.44,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "18": {
        "testId": 18,
        "score": 4.84,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.6.15",
    "name": "NGUYỄN MỸ KHÁNH",
    "className": "Lớp thứ 6",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.21,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.61,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.41,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "4": {
        "testId": 4,
        "score": 4.81,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.61,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP04"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 5.01,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.41,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.21,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.61,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.41,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "11": {
        "testId": 11,
        "score": 5.31,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 4.56,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 4.81,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 5.06,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 5.21,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.61,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.41,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "18": {
        "testId": 18,
        "score": 4.81,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.6.18",
    "name": "NGUYỄN LINH NGỌC",
    "className": "Lớp thứ 6",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.18,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.58,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.38,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "4": {
        "testId": 4,
        "score": 4.78,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.58,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP08"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 4.98,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.38,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.18,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.58,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.38,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "11": {
        "testId": 11,
        "score": 4.53,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 4.78,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 5.03,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 5.28,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 5.18,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.58,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.38,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "18": {
        "testId": 18,
        "score": 4.78,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.6.20",
    "name": "PHẠM TÚ QUYÊN",
    "className": "Lớp thứ 6",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.15,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.55,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.35,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "4": {
        "testId": 4,
        "score": 4.75,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.55,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "B7_BP15"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 4.95,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.35,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.15,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.55,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.35,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "11": {
        "testId": 11,
        "score": 4.75,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 5,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 5.25,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 4.5,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 5.15,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.55,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.35,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "18": {
        "testId": 18,
        "score": 4.75,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.6.21",
    "name": "CHU MỸ VÂN",
    "className": "Lớp thứ 6",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.11,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.51,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.31,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "4": {
        "testId": 4,
        "score": 4.71,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.51,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "B8BP30"
          ]
        }
      },
      "6": {
        "testId": 6,
        "score": 4.91,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.31,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.11,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.51,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.31,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "11": {
        "testId": 11,
        "score": 4.96,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 5.21,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 4.46,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 4.71,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 5.11,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.51,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.31,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "18": {
        "testId": 18,
        "score": 4.71,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.6.22",
    "name": "NGUYỄN TRẦN BẢO VÂN",
    "className": "Lớp thứ 6",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.08,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.48,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.28,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "4": {
        "testId": 4,
        "score": 4.68,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.48,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "6": {
        "testId": 6,
        "score": 4.88,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.28,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.08,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.48,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.28,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "11": {
        "testId": 11,
        "score": 5.18,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 4.43,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 4.68,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 4.93,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 5.08,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.48,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.28,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "18": {
        "testId": 18,
        "score": 4.68,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.6.25",
    "name": "NGÔ MINH VŨ",
    "className": "Lớp thứ 7_OT",
    "gender": "Nam",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.05,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.45,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.25,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "4": {
        "testId": 4,
        "score": 4.65,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.45,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "6": {
        "testId": 6,
        "score": 4.85,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.25,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.05,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.45,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.25,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "11": {
        "testId": 11,
        "score": 4.4,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 4.65,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 4.9,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 5.15,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 5.05,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.45,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.25,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "18": {
        "testId": 18,
        "score": 4.65,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.7.01",
    "name": "NINH ĐỨC TÙNG ANH",
    "className": "Lớp thứ 7_OT",
    "gender": "Nam",
    "results": {
      "1": {
        "testId": 1,
        "score": 5.01,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.41,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.21,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "4": {
        "testId": 4,
        "score": 4.61,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.41,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "6": {
        "testId": 6,
        "score": 4.81,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.21,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 5.01,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.41,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.21,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "11": {
        "testId": 11,
        "score": 4.61,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 4.86,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 5.11,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 4.36,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 5.01,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.41,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.21,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "18": {
        "testId": 18,
        "score": 4.61,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.7.03",
    "name": "ĐINH MINH CHÂU",
    "className": "Lớp thứ 7_OT",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 4.98,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.38,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.18,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "4": {
        "testId": 4,
        "score": 4.58,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.38,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "6": {
        "testId": 6,
        "score": 4.78,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.18,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 4.98,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.38,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.18,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "11": {
        "testId": 11,
        "score": 4.83,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 5.08,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 4.33,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 4.58,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 4.98,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.38,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.18,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "18": {
        "testId": 18,
        "score": 4.58,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.2.07",
    "name": "HUYỀN DIỆU",
    "className": "Lớp thứ 7_OT",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 4.95,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.35,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.15,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "4": {
        "testId": 4,
        "score": 4.55,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.35,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "6": {
        "testId": 6,
        "score": 4.75,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.15,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 4.95,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.35,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.15,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "11": {
        "testId": 11,
        "score": 5.05,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 4.3,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 4.55,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 4.8,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 4.95,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.35,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.15,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "18": {
        "testId": 18,
        "score": 4.55,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.7.09",
    "name": "NGUYỄN MINH HIẾU",
    "className": "Lớp thứ 7_OT",
    "gender": "Nam",
    "results": {
      "1": {
        "testId": 1,
        "score": 4.92,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.32,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.12,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "4": {
        "testId": 4,
        "score": 4.52,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.32,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "6": {
        "testId": 6,
        "score": 4.72,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.12,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 4.92,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.32,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.12,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "11": {
        "testId": 11,
        "score": 4.27,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 4.52,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 4.77,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 5.02,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 4.92,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.32,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.12,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "18": {
        "testId": 18,
        "score": 4.52,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.7.13",
    "name": "TRỊNH KHÁNH LINH",
    "className": "Lớp thứ 7_OT",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 4.88,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.28,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.08,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "4": {
        "testId": 4,
        "score": 4.48,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.28,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "6": {
        "testId": 6,
        "score": 4.68,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.08,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 4.88,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.28,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.08,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "11": {
        "testId": 11,
        "score": 4.48,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 4.73,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 4.98,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 4.23,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 4.88,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.28,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.08,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "18": {
        "testId": 18,
        "score": 4.48,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.2.14",
    "name": "NGUYỄN PHƯƠNG NAM",
    "className": "Lớp thứ 7_OT",
    "gender": "Nam",
    "results": {
      "1": {
        "testId": 1,
        "score": 4.85,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.25,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.05,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "4": {
        "testId": 4,
        "score": 4.45,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.25,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "6": {
        "testId": 6,
        "score": 4.65,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.05,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 4.85,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.25,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.05,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "11": {
        "testId": 11,
        "score": 4.7,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 4.95,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 4.2,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 4.45,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 4.85,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.25,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.05,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "18": {
        "testId": 18,
        "score": 4.45,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.7.15",
    "name": "VŨ KHÁNH NHI",
    "className": "Lớp thứ 7_OT",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 4.82,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.22,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 5.02,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "4": {
        "testId": 4,
        "score": 4.42,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.22,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "6": {
        "testId": 6,
        "score": 4.62,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 4.02,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 4.82,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.22,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 5.02,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "11": {
        "testId": 11,
        "score": 4.92,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 4.17,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 4.42,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 4.67,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 4.82,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.22,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 5.02,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "18": {
        "testId": 18,
        "score": 4.42,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH25.7.19",
    "name": "NGÔ PHƯƠNG UYÊN",
    "className": "Lớp thứ 7_OT",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 4.78,
        "comment": {
          "ktCodes": [
            "KT06"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.18,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 4.98,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "4": {
        "testId": 4,
        "score": 4.38,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.18,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "6": {
        "testId": 6,
        "score": 4.58,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 3.98,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 4.78,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.18,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 4.98,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "11": {
        "testId": 11,
        "score": 4.13,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 4.38,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 4.63,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 4.88,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 4.78,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.18,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 4.98,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "18": {
        "testId": 18,
        "score": 4.38,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH26.8.01",
    "name": "KHÁNH HÀ",
    "className": "Lớp chủ nhật",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 4.75,
        "comment": {
          "ktCodes": [
            "KT10"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.15,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 4.95,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "4": {
        "testId": 4,
        "score": 4.35,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.15,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "6": {
        "testId": 6,
        "score": 4.55,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 3.95,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 4.75,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.15,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 4.95,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "11": {
        "testId": 11,
        "score": 4.35,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 4.6,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 4.85,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 4.1,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 4.75,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.15,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 4.95,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "18": {
        "testId": 18,
        "score": 4.35,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH26.8.76",
    "name": "NGUYỄN TUẤN ANH",
    "className": "Lớp chủ nhật",
    "gender": "Nam",
    "results": {
      "1": {
        "testId": 1,
        "score": 4.72,
        "comment": {
          "ktCodes": [
            "B7_KT13"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.12,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 4.92,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "4": {
        "testId": 4,
        "score": 4.32,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.12,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "6": {
        "testId": 6,
        "score": 4.52,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 3.92,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 4.72,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.12,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 4.92,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "11": {
        "testId": 11,
        "score": 4.57,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 4.82,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 4.07,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 4.32,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 4.72,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.12,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 4.92,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "18": {
        "testId": 18,
        "score": 4.32,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH26.8.77",
    "name": "PHẠM ĐÌNH ĐĂNG",
    "className": "Lớp chủ nhật",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 4.69,
        "comment": {
          "ktCodes": [
            "B7_KT14"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.09,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 4.89,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "4": {
        "testId": 4,
        "score": 4.29,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.09,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "6": {
        "testId": 6,
        "score": 4.49,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 3.89,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 4.69,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.09,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 4.89,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "11": {
        "testId": 11,
        "score": 4.79,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 4.04,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 4.29,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 4.54,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 4.69,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.09,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 4.89,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "18": {
        "testId": 18,
        "score": 4.29,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH26.8.78",
    "name": "BÙI THÁI DƯƠNG",
    "className": "Lớp chủ nhật",
    "gender": "Nữ",
    "results": {
      "1": {
        "testId": 1,
        "score": 4.65,
        "comment": {
          "ktCodes": [
            "B7_KT15"
          ],
          "udCodes": [
            "UD30"
          ],
          "hcCodes": [
            "HC02"
          ],
          "bpCodes": [
            "BP02"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.05,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD31"
          ],
          "hcCodes": [
            "HC03"
          ],
          "bpCodes": [
            "BP03"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 4.85,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC05"
          ],
          "bpCodes": [
            "BP04"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "4": {
        "testId": 4,
        "score": 4.25,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP05"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.05,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "6": {
        "testId": 6,
        "score": 4.45,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 3.85,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 4.65,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.05,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 4.85,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "11": {
        "testId": 11,
        "score": 4,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 4.25,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 4.5,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 4.75,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 4.65,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.05,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 4.85,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "18": {
        "testId": 18,
        "score": 4.25,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  },
  {
    "id": "SH26.8.79",
    "name": "LƯU ĐỨC ANH",
    "className": "Lớp chủ nhật",
    "gender": "Nam",
    "results": {
      "1": {
        "testId": 1,
        "score": 4.62,
        "comment": {
          "ktCodes": [
            "B7_KT18"
          ],
          "udCodes": [
            "UD32"
          ],
          "hcCodes": [
            "HC06"
          ],
          "bpCodes": [
            "BP06"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "2": {
        "testId": 2,
        "score": 4.02,
        "comment": {
          "ktCodes": [
            "B7_KT20"
          ],
          "udCodes": [
            "UD33"
          ],
          "hcCodes": [
            "HC07"
          ],
          "bpCodes": [
            "BP07"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "3": {
        "testId": 3,
        "score": 4.82,
        "comment": {
          "ktCodes": [
            "B9_KT27"
          ],
          "udCodes": [
            "UD36"
          ],
          "hcCodes": [
            "HC08"
          ],
          "bpCodes": [
            "BP08"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "4": {
        "testId": 4,
        "score": 4.22,
        "comment": {
          "ktCodes": [
            "B9_KT28"
          ],
          "udCodes": [
            "UD01"
          ],
          "hcCodes": [
            "HC09"
          ],
          "bpCodes": [
            "BP09"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "5": {
        "testId": 5,
        "score": 5.02,
        "comment": {
          "ktCodes": [
            "B9_KT33"
          ],
          "udCodes": [
            "UD02"
          ],
          "hcCodes": [
            "HC10"
          ],
          "bpCodes": [
            "BP10"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "6": {
        "testId": 6,
        "score": 4.42,
        "comment": {
          "ktCodes": [
            "KT34"
          ],
          "udCodes": [
            "UD03"
          ],
          "hcCodes": [
            "B7_HC12"
          ],
          "bpCodes": [
            "B7_BP13"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "7": {
        "testId": 7,
        "score": 3.82,
        "comment": {
          "ktCodes": [
            "KT36"
          ],
          "udCodes": [
            "UD04"
          ],
          "hcCodes": [
            "B7_HC18"
          ],
          "bpCodes": [
            "B7_BP15"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "8": {
        "testId": 8,
        "score": 4.62,
        "comment": {
          "ktCodes": [
            "KT38"
          ],
          "udCodes": [
            "UD05"
          ],
          "hcCodes": [
            "B7_HC20"
          ],
          "bpCodes": [
            "B7_BP17"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "9": {
        "testId": 9,
        "score": 4.02,
        "comment": {
          "ktCodes": [
            "KT40"
          ],
          "udCodes": [
            "UD06"
          ],
          "hcCodes": [
            "B8_HC26"
          ],
          "bpCodes": [
            "B7_BP20"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "10": {
        "testId": 10,
        "score": 4.82,
        "comment": {
          "ktCodes": [
            "KT44"
          ],
          "udCodes": [
            "UD07"
          ],
          "hcCodes": [
            "B8_HC28"
          ],
          "bpCodes": [
            "B8_BP26"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "11": {
        "testId": 11,
        "score": 4.22,
        "comment": {
          "ktCodes": [
            "KT47"
          ],
          "udCodes": [
            "UD08"
          ],
          "hcCodes": [
            "B8_HC29"
          ],
          "bpCodes": [
            "B8BP30"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "12": {
        "testId": 12,
        "score": 4.47,
        "comment": {
          "ktCodes": [
            "KT52"
          ],
          "udCodes": [
            "UD10"
          ],
          "hcCodes": [
            "B8HC37"
          ],
          "bpCodes": [
            "B8BP31"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "13": {
        "testId": 13,
        "score": 4.72,
        "comment": {
          "ktCodes": [
            "KT58"
          ],
          "udCodes": [
            "UD11"
          ],
          "hcCodes": [
            "B8HC40"
          ],
          "bpCodes": [
            "BP32"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "14": {
        "testId": 14,
        "score": 3.97,
        "comment": {
          "ktCodes": [
            "KT01"
          ],
          "udCodes": [
            "B7_UD12"
          ],
          "hcCodes": [
            "B8HC44"
          ],
          "bpCodes": [
            "BP33"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "15": {
        "testId": 15,
        "score": 4.62,
        "comment": {
          "ktCodes": [
            "KT02"
          ],
          "udCodes": [
            "B7_UD13"
          ],
          "hcCodes": [
            "HC50"
          ],
          "bpCodes": [
            "BP36"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "16": {
        "testId": 16,
        "score": 4.02,
        "comment": {
          "ktCodes": [
            "KT03"
          ],
          "udCodes": [
            "B7_UD18"
          ],
          "hcCodes": [
            "HC54"
          ],
          "bpCodes": [
            "BP40"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "17": {
        "testId": 17,
        "score": 4.82,
        "comment": {
          "ktCodes": [
            "KT04"
          ],
          "udCodes": [
            "B7_UD20"
          ],
          "hcCodes": [
            "HC56"
          ],
          "bpCodes": [
            "BP41"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      },
      "18": {
        "testId": 18,
        "score": 4.22,
        "comment": {
          "ktCodes": [
            "KT05"
          ],
          "udCodes": [
            "B7_UD25"
          ],
          "hcCodes": [
            "HC01"
          ],
          "bpCodes": [
            "BP01"
          ],
          "finalNote": "Con cần chủ động trao đổi với trợ giảng để được hướng dẫn ôn tập lại các phần kiến thức còn hổng."
        }
      }
    }
  }
];

export function getStudentMonthlyAverage(
  student: Student,
  monthId: string,
  monthsConfig: MonthMeta[] = MONTHS_CONFIG
): number | null {
  const month = monthsConfig.find(m => m.id === monthId);
  if (!month) return null;

  // CHỈ TÍNH ĐIỂM TRUNG BÌNH THÁNG VỚI SỐ BÀI HIỆN CÓ:
  // Ví dụ tháng 10 có 4 bài mà chỉ đang nhập 3 bài thì chỉ tính điểm trung bình 3 bài!
  // Điểm 0 là một điểm hợp lệ (nhập là 0 và hiển thị là 0), tính vào validScores và mẫu số.
  // Bài chưa có điểm (hiển thị là '-' và nhập là '-') không được tính vào validScores.
  const validScores: number[] = [];
  for (const t of month.tests) {
    const res = student.results[t.id];
    if (res && res.score !== null && res.score !== undefined && typeof res.score === 'number' && !isNaN(res.score)) {
      validScores.push(res.score);
    }
  }

  if (validScores.length === 0) return null;
  const sum = validScores.reduce((a, b) => a + b, 0);
  return Number((sum / validScores.length).toFixed(4));
}

export function getStudentOverallAverage(student: Student): number | null {
  const validScores: number[] = [];
  for (let id = 1; id <= 18; id++) {
    const res = student.results[id];
    if (res && res.score !== null && res.score !== undefined && typeof res.score === 'number' && !isNaN(res.score)) {
      validScores.push(res.score);
    }
  }
  if (validScores.length === 0) return null;
  const sum = validScores.reduce((a, b) => a + b, 0);
  return Number((sum / validScores.length).toFixed(2));
}

export interface StudentRankRecord {
  rank: number;
  student: Student;
  currentAvg: number | null;
  prevAvg: number | null;
  scoreDelta: number | null;
  prevRank: number | null;
  rankDelta: number | null;
  testsScores: Record<number, number | null>;
}

export function computeClassRankings(
  students: Student[],
  monthId: string,
  classFilter = 'Tất cả lớp',
  customMonthsConfig: MonthMeta[] = MONTHS_CONFIG
): StudentRankRecord[] {
  const filtered = classFilter === 'Tất cả lớp'
    ? students
    : students.filter(s => {
        const normalized = s.className === 'Lớp Chiều Chủ Nhật' ? 'Lớp chủ nhật' : s.className;
        const targetClass = classFilter === 'Lớp Chiều Chủ Nhật' ? 'Lớp chủ nhật' : classFilter;
        return normalized === targetClass;
      });

  const monthIdx = customMonthsConfig.findIndex(m => m.id === monthId);
  const prevMonth = monthIdx > 0 ? customMonthsConfig[monthIdx - 1] : null;

  const records: StudentRankRecord[] = filtered.map(student => {
    const currentAvg = getStudentMonthlyAverage(student, monthId, customMonthsConfig);
    const prevAvg = prevMonth ? getStudentMonthlyAverage(student, prevMonth.id, customMonthsConfig) : null;
    const scoreDelta = (currentAvg !== null && prevAvg !== null) ? Number((currentAvg - prevAvg).toFixed(4)) : null;

    const testsScores: Record<number, number | null> = {};
    const currMonthMeta = customMonthsConfig[monthIdx];
    if (currMonthMeta) {
      for (const t of currMonthMeta.tests) {
        const res = student.results[t.id];
        testsScores[t.id] = (res && res.score !== null && res.score !== undefined && typeof res.score === 'number' && !isNaN(res.score))
          ? res.score
          : null;
      }
    }

    return {
      student,
      currentAvg,
      prevAvg,
      scoreDelta,
      testsScores,
      rank: 0,
      prevRank: null as number | null,
      rankDelta: null as number | null
    };
  });

  // Học sinh có điểm trung bình được xếp hạng từ cao xuống thấp.
  // Học sinh chưa có điểm (currentAvg === null) xếp ở cuối bảng
  records.sort((a, b) => {
    if (a.currentAvg === null && b.currentAvg === null) return 0;
    if (a.currentAvg === null) return 1;
    if (b.currentAvg === null) return -1;
    return b.currentAvg - a.currentAvg;
  });

  records.forEach((r, idx) => {
    r.rank = idx + 1;
  });

  if (prevMonth) {
    const prevRecords = filtered.map(student => ({
      studentId: student.id,
      avg: getStudentMonthlyAverage(student, prevMonth.id, customMonthsConfig)
    }));
    prevRecords.sort((a, b) => {
      if (a.avg === null && b.avg === null) return 0;
      if (a.avg === null) return 1;
      if (b.avg === null) return -1;
      return b.avg - a.avg;
    });

    const prevRankMap = new Map<string, number>();
    prevRecords.forEach((pr, idx) => {
      if (pr.avg !== null) {
        prevRankMap.set(pr.studentId, idx + 1);
      }
    });

    records.forEach(r => {
      if (r.currentAvg !== null) {
        const pRank = prevRankMap.get(r.student.id);
        if (pRank !== undefined) {
          r.prevRank = pRank;
          r.rankDelta = pRank - r.rank;
        }
      }
    });
  }

  return records;
}
