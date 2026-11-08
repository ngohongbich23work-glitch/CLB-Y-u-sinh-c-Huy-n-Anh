import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Student, MonthMeta, MONTHS_CONFIG, StudentTestResult } from '../data/studentsData';
import { getCommentByCode } from '../data/biologyComments';

export interface ExcelImportSummary {
  success: boolean;
  fileName: string;
  fileSize: number;
  sheetNames: string[];
  totalStudents: number;
  totalTests: number;
  totalScoresRecorded: number;
  totalCommentsRecorded: number;
  students: Student[];
  monthsConfig: MonthMeta[];
  warnings: string[];
}

// Chuẩn hóa tên bỏ dấu tiếng Việt để tìm kiếm và so sánh
export function normalizeVietnamese(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .trim()
    .toLowerCase();
}

/**
 * Trích xuất mã nhận xét hoặc văn bản từ chuỗi ô Excel
 */
function parseCommentCell(val: any): { codes: string[]; customText?: string } {
  if (val === null || val === undefined) return { codes: [] };
  const str = String(val).trim();
  if (!str) return { codes: [] };

  // Tìm các mã dạng KT01, UD02, HC12, BP04, etc.
  const codeMatches = str.match(/\b(KT|UD|HC|BP)\d{2}\b/gi);
  if (codeMatches && codeMatches.length > 0) {
    const codes = Array.from(new Set(codeMatches.map(c => c.toUpperCase())));
    // Nếu trong ô ngoài mã còn có nội dung giải thích dài, lưu thêm customText
    const remaining = str.replace(/\b(KT|UD|HC|BP)\d{2}\b/gi, '').replace(/[,\s•\-;:]+/g, ' ').trim();
    return {
      codes,
      customText: remaining.length > 10 ? str : undefined,
    };
  }

  // Nếu không chứa mã mà là câu nhận xét tự do
  return {
    codes: [],
    customText: str,
  };
}

/**
 * Tìm dòng tiêu đề thực tế trong mảng 2D của sheet
 */
function findHeaderRowIndex(rows: any[][]): number {
  for (let r = 0; r < Math.min(rows.length, 12); r++) {
    const row = rows[r];
    if (!Array.isArray(row)) continue;
    const rowStr = row.map(c => String(c || '').toLowerCase()).join(' ');
    // Nếu dòng có chứa ít nhất 2 từ khóa nhận diện cột
    const hasName = rowStr.includes('họ') || rowStr.includes('tên') || rowStr.includes('name');
    const hasId = rowStr.includes('mã') || rowStr.includes('id') || rowStr.includes('stt');
    const hasScoreOrTest = rowStr.includes('bài') || rowStr.includes('điểm') || rowStr.includes('test') || rowStr.includes('đề');

    if ((hasName && (hasId || hasScoreOrTest)) || (hasId && hasScoreOrTest)) {
      return r;
    }
  }
  return 0;
}

/**
 * Đọc file Excel / CSV một chiều (One-Way Data Reader)
 * Không ghi ngược lại file gốc trên máy tính của người dùng
 */
export async function parseExcelOrCsvFile(
  file: File,
  existingMonths: MonthMeta[] = MONTHS_CONFIG
): Promise<ExcelImportSummary> {
  const fileName = file.name;
  const fileSize = file.size;
  const warnings: string[] = [];

  let workbook: XLSX.WorkBook;

  if (fileName.endsWith('.csv')) {
    const text = await file.text();
    workbook = XLSX.read(text, { type: 'string' });
  } else {
    const buffer = await file.arrayBuffer();
    workbook = XLSX.read(buffer, { type: 'array' });
  }

  const sheetNames = workbook.SheetNames;
  if (!sheetNames || sheetNames.length === 0) {
    throw new Error('File Excel không có bất kỳ sheet nào hợp lệ.');
  }

  // Bản đồ tổng hợp học sinh theo Mã HS (hoặc Tên chuẩn hóa nếu thiếu mã)
  const studentsMap = new Map<string, Student>();
  let totalScoresCount = 0;
  let totalCommentsCount = 0;
  const detectedTestIds = new Set<number>();

  // Duyệt qua từng sheet trong workbook
  for (const sheetName of sheetNames) {
    const ws = workbook.Sheets[sheetName];
    if (!ws) continue;

    // Chuyển sheet sang mảng 2 chiều để quét linh hoạt
    const rawData = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, defval: '' });
    if (!rawData || rawData.length === 0) continue;

    const headerIdx = findHeaderRowIndex(rawData);
    const headerRow = rawData[headerIdx] || [];
    const dataRows = rawData.slice(headerIdx + 1);

    // Xác định chỉ số các cột thông tin học sinh
    let fullNameCol = -1;
    let hoCol = -1;
    let tenCol = -1;
    let idCol = -1;
    let classCol = -1;
    let phoneCol = -1;
    let genderCol = -1;

    // Bản đồ cột tương ứng với bài thi: colIdx -> { testId: number, type: 'score' | 'kt' | 'ud' | 'hc' | 'bp' | 'note' }
    interface ColMapping {
      testId: number;
      type: 'score' | 'kt' | 'ud' | 'hc' | 'bp' | 'note';
    }
    const colMappings: Record<number, ColMapping> = {};

    headerRow.forEach((cellVal: any, colIdx: number) => {
      const header = String(cellVal || '').trim();
      const lower = header.toLowerCase();

      // Cột Họ và tên (đầy đủ)
      if (fullNameCol === -1 && (lower === 'họ và tên' || lower === 'họ tên' || lower === 'họ & tên' || lower === 'full name' || lower === 'tên học sinh')) {
        fullNameCol = colIdx;
        return;
      }

      // Cột Họ và đệm / Họ đệm / Họ lót / Họ
      if (hoCol === -1 && (lower.includes('họ đệm') || lower.includes('họ và đệm') || lower.includes('họ và tên đệm') || lower.includes('họ lót') || lower === 'họ')) {
        hoCol = colIdx;
        return;
      }

      // Cột Tên riêng
      if (tenCol === -1 && (lower === 'tên' || lower === 'tên riêng' || lower === 'first name')) {
        tenCol = colIdx;
        return;
      }

      // Cột Mã HS
      if (idCol === -1 && (lower.includes('mã hs') || lower.includes('mã học sinh') || lower.includes('mã số') || lower === 'id' || lower === 'mã')) {
        idCol = colIdx;
        return;
      }

      // Cột Lớp
      if (classCol === -1 && (lower.includes('lớp') || lower === 'class' || lower.includes('khối'))) {
        classCol = colIdx;
        return;
      }

      // Cột SĐT
      if (phoneCol === -1 && (lower.includes('sđt') || lower.includes('điện thoại') || lower.includes('phone'))) {
        phoneCol = colIdx;
        return;
      }

      // Cột Giới tính
      if (genderCol === -1 && (lower.includes('giới tính') || lower === 'gender')) {
        genderCol = colIdx;
        return;
      }

      // Quét cột Bài thi và Điểm số
      // Ví dụ: "Bài 1", "BÀI 1", "Đề 1", "Test 1", "T1", "B1", "Score 1", "Điểm Bài 1"
      const testMatch = header.match(/(?:Bài|Đề|Test|Score|Điểm|T|B)\s*(\d+)/i);
      const testNum = testMatch ? parseInt(testMatch[1], 10) : null;

      if (testNum !== null && testNum > 0 && testNum <= 50) {
        detectedTestIds.add(testNum);

        // Kiểm tra loại cột nhận xét chuyên sâu
        if (lower.includes('kt') || lower.includes('kiến thức')) {
          colMappings[colIdx] = { testId: testNum, type: 'kt' };
        } else if (lower.includes('ud') || lower.includes('ưu điểm')) {
          colMappings[colIdx] = { testId: testNum, type: 'ud' };
        } else if (lower.includes('hc') || lower.includes('hạn chế')) {
          colMappings[colIdx] = { testId: testNum, type: 'hc' };
        } else if (lower.includes('bp') || lower.includes('biện pháp') || lower.includes('khắc phục')) {
          colMappings[colIdx] = { testId: testNum, type: 'bp' };
        } else if (lower.includes('nhận xét') || lower.includes('ghi chú') || lower.includes('lời dặn')) {
          colMappings[colIdx] = { testId: testNum, type: 'note' };
        } else {
          // Mặc định là cột Điểm số của bài đó
          colMappings[colIdx] = { testId: testNum, type: 'score' };
        }
      }
    });

    // Đọc từng dòng học sinh
    dataRows.forEach((row, rowIdx) => {
      if (!Array.isArray(row) || row.length === 0) return;

      // Trích xuất đầy đủ Họ và Tên của học sinh
      let rawName = '';
      if (hoCol !== -1 && tenCol !== -1) {
        // Định dạng 2 cột: "Họ và đệm" + "Tên" -> ghép lại thành Họ và Tên đầy đủ
        const hoStr = String(row[hoCol] || '').trim();
        const tenStr = String(row[tenCol] || '').trim();
        rawName = `${hoStr} ${tenStr}`.trim();
      } else if (fullNameCol !== -1) {
        rawName = String(row[fullNameCol] || '').trim();
      } else if (tenCol !== -1) {
        rawName = String(row[tenCol] || '').trim();
      } else {
        // Thử tìm cột thứ 2 (hoặc 1)
        rawName = String(row[1] || row[0] || '').trim();
      }

      if (!rawName || rawName.length < 2) return;
      if (rawName.toLowerCase().includes('họ và tên') || rawName.toLowerCase().includes('trung bình') || rawName.toLowerCase().includes('thống kê')) {
        return; // Bỏ qua dòng tổng kết
      }

      const rawId = idCol !== -1 ? String(row[idCol] || '').trim() : '';
      const studentId = rawId || `SH-${(studentsMap.size + 1).toString().padStart(3, '0')}`;
      const lookupKey = rawId ? rawId.toUpperCase() : normalizeVietnamese(rawName);

      const rawClass = classCol !== -1 ? String(row[classCol] || '').trim() : '';
      const className = rawClass || 'Lớp Chiều Chủ Nhật';

      const phone = phoneCol !== -1 ? String(row[phoneCol] || '').trim() : undefined;
      const rawGender = genderCol !== -1 ? String(row[genderCol] || '').trim().toLowerCase() : '';
      const gender: 'Nam' | 'Nữ' | undefined = rawGender.includes('nam') ? 'Nam' : rawGender.includes('nữ') ? 'Nữ' : undefined;

      // Lấy hoặc tạo mới hồ sơ học sinh
      let student = studentsMap.get(lookupKey);
      if (!student) {
        student = {
          id: studentId,
          name: rawName.toUpperCase(),
          className,
          phone: phone || undefined,
          gender,
          results: {},
        };
        studentsMap.set(lookupKey, student);
      } else {
        // Cập nhật bổ sung thông tin nếu thiếu
        if (!student.phone && phone) student.phone = phone;
        if (!student.gender && gender) student.gender = gender;
        if (className && student.className === 'Lớp Chiều Chủ Nhật') student.className = className;
      }

      // Đọc các cột điểm và nhận xét cho học sinh này
      Object.entries(colMappings).forEach(([colStr, mapping]) => {
        const col = parseInt(colStr, 10);
        const cellValue = row[col];
        if (cellValue === undefined || cellValue === null || cellValue === '') return;

        const { testId, type } = mapping;

        // Khởi tạo kết quả bài kiểm tra nếu chưa có
        if (!student!.results[testId]) {
          student!.results[testId] = {
            testId,
            score: null,
            comment: {
              ktCodes: [],
              udCodes: [],
              hcCodes: [],
              bpCodes: [],
            },
          };
        }

        const res = student!.results[testId];

        if (type === 'score') {
          const strVal = String(cellValue).trim();
          if (strVal === '-' || strVal === '') {
            res.score = null;
          } else {
            // Xử lý điểm số (chấp nhận cả dấu chấm và dấu phẩy, e.g. "8.5" hoặc "8,5", kể cả "0")
            const scoreNum = typeof cellValue === 'number'
              ? cellValue
              : parseFloat(strVal.replace(',', '.'));

            if (!isNaN(scoreNum) && scoreNum >= 0 && scoreNum <= 10) {
              res.score = Number(scoreNum.toFixed(4));
              totalScoresCount++;
            } else {
              res.score = null;
            }
          }
        } else if (type === 'kt') {
          const parsed = parseCommentCell(cellValue);
          if (parsed.codes.length > 0) res.comment.ktCodes = Array.from(new Set([...res.comment.ktCodes, ...parsed.codes]));
          if (parsed.customText) res.comment.customKt = parsed.customText;
          totalCommentsCount++;
        } else if (type === 'ud') {
          const parsed = parseCommentCell(cellValue);
          if (parsed.codes.length > 0) res.comment.udCodes = Array.from(new Set([...res.comment.udCodes, ...parsed.codes]));
          if (parsed.customText) res.comment.customUd = parsed.customText;
          totalCommentsCount++;
        } else if (type === 'hc') {
          const parsed = parseCommentCell(cellValue);
          if (parsed.codes.length > 0) res.comment.hcCodes = Array.from(new Set([...res.comment.hcCodes, ...parsed.codes]));
          if (parsed.customText) res.comment.customHc = parsed.customText;
          totalCommentsCount++;
        } else if (type === 'bp') {
          const parsed = parseCommentCell(cellValue);
          if (parsed.codes.length > 0) res.comment.bpCodes = Array.from(new Set([...res.comment.bpCodes, ...parsed.codes]));
          if (parsed.customText) res.comment.customBp = parsed.customText;
          totalCommentsCount++;
        } else if (type === 'note') {
          res.comment.finalNote = String(cellValue).trim();
          totalCommentsCount++;
        }
      });
    });
  }

  const finalStudents = Array.from(studentsMap.values());
  if (finalStudents.length === 0) {
    throw new Error('Không trích xuất được học sinh nào từ file. Vui lòng kiểm tra lại cấu trúc cột Họ và tên.');
  }

  // Đảm bảo mỗi học sinh đều có cấu trúc điểm tối thiểu cho các bài được phát hiện
  const sortedTestIds = Array.from(detectedTestIds).sort((a, b) => a - b);
  finalStudents.forEach(s => {
    sortedTestIds.forEach(tId => {
      if (!s.results[tId]) {
        s.results[tId] = {
          testId: tId,
          score: 7.0,
          comment: {
            ktCodes: ['KT02'],
            udCodes: ['UD01'],
            hcCodes: ['HC02'],
            bpCodes: ['BP02'],
          },
        };
      } else {
        // Nếu thiếu mã nhận xét thì bổ sung mã mặc định
        if (s.results[tId].comment.ktCodes.length === 0 && !s.results[tId].comment.customKt) {
          s.results[tId].comment.ktCodes = ['KT02'];
        }
        if (s.results[tId].comment.udCodes.length === 0 && !s.results[tId].comment.customUd) {
          s.results[tId].comment.udCodes = ['UD01'];
        }
        if (s.results[tId].comment.hcCodes.length === 0 && !s.results[tId].comment.customHc) {
          s.results[tId].comment.hcCodes = ['HC02'];
        }
        if (s.results[tId].comment.bpCodes.length === 0 && !s.results[tId].comment.customBp) {
          s.results[tId].comment.bpCodes = ['BP02'];
        }
      }
    });
  });

  // Tự động xây dựng hoặc cập nhật cấu trúc tháng (MonthMeta) nếu có bài thi mới
  let monthsConfig: MonthMeta[] = JSON.parse(JSON.stringify(existingMonths));

  // Kiểm tra nếu có test ID vượt quá cấu trúc tháng hiện có
  const maxExistingTestId = Math.max(...monthsConfig.flatMap(m => m.tests.map(t => t.id)), 0);
  const extraTests = sortedTestIds.filter(id => id > maxExistingTestId);

  if (extraTests.length > 0) {
    // Tạo thêm tháng bổ sung cho các bài mới
    const newMonthIndex = monthsConfig.length + 1;
    monthsConfig.push({
      id: `m_extra_${newMonthIndex}`,
      name: `Tháng ${newMonthIndex + 5}`,
      tests: extraTests.map(id => ({
        id,
        title: `Bài ${id}`,
        date: `Tự động`,
        topic: `Chuyên đề luyện đề thực chiến số ${id}`,
      })),
    });
    warnings.push(`Đã tự động khởi tạo cấu trúc bổ sung cho các bài luyện đề mới: ${extraTests.join(', ')}.`);
  }

  return {
    success: true,
    fileName,
    fileSize,
    sheetNames,
    totalStudents: finalStudents.length,
    totalTests: sortedTestIds.length || 18,
    totalScoresRecorded: totalScoresCount,
    totalCommentsRecorded: totalCommentsCount,
    students: finalStudents,
    monthsConfig,
    warnings,
  };
}

/**
 * Tạo file mẫu Excel (.xlsx) chuẩn cấu trúc để giáo viên tải về và điền
 */
export function downloadSampleExcelTemplate(): void {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Tổng hợp điểm & Nhận xét
  const sheet1Data = [
    [
      'Mã HS',
      'Họ và tên',
      'Lớp',
      'Giới tính',
      'SĐT',
      'Bài 1', 'KT 1', 'UD 1', 'HC 1', 'BP 1',
      'Bài 2', 'KT 2', 'UD 2', 'HC 2', 'BP 2',
      'Bài 3', 'KT 3', 'UD 3', 'HC 3', 'BP 3',
      'Bài 4', 'KT 4', 'UD 4', 'HC 4', 'BP 4',
      'Bài 5', 'KT 5', 'UD 5', 'HC 5', 'BP 5',
    ],
    [
      'SH-001',
      'HỒ NGỌC BẢO AN',
      'Lớp Chiều Chủ Nhật',
      'Nữ',
      '0981234567',
      '8.5', 'KT01, KT04', 'UD01, UD03', 'HC02', 'BP01, BP03',
      '9.0', 'KT02', 'UD02', 'HC01', 'BP02',
      '8.75', 'KT03', 'UD01', 'HC03', 'BP01',
      '9.25', 'KT01', 'UD04', 'HC02', 'BP04',
      '9.0', 'KT05', 'UD02', 'HC01', 'BP02',
    ],
    [
      'SH-002',
      'NGUYỄN HUỆ THU',
      'Lớp Chiều Chủ Nhật',
      'Nữ',
      '0912345678',
      '5.5', 'Con nắm được phần lớn kiến thức nhưng cần ôn tập thêm protein.', 'UD01, UD02', 'HC01', 'BP01, BP02, BP03',
      '6.0', 'KT02', 'UD02', 'HC03', 'BP02',
      '7.0', 'KT01', 'UD01', 'HC02', 'BP01',
      '6.75', 'KT04', 'UD03', 'HC01', 'BP03',
      '7.5', 'KT02', 'UD02', 'HC02', 'BP02',
    ],
    [
      'SH-003',
      'TRẦN MINH ĐỨC',
      'Lớp thứ 4',
      'Nam',
      '0978999888',
      '7.75', 'KT02, KT03', 'UD01', 'HC02, HC04', 'BP01, BP02',
      '8.0', 'KT01', 'UD03', 'HC01', 'BP03',
      '8.25', 'KT04', 'UD02', 'HC02', 'BP01',
      '8.5', 'KT02', 'UD01', 'HC03', 'BP04',
      '8.75', 'KT05', 'UD04', 'HC01', 'BP02',
    ],
  ];

  const ws1 = XLSX.utils.aoa_to_sheet(sheet1Data);
  XLSX.utils.book_append_sheet(wb, ws1, 'Tổng hợp nhận xét và điểm');

  // Sheet 2: Danh mục mã nhận xét tham chiếu
  const commentsData = [
    ['Mã Nhận Xét', 'Phân Loại', 'Nội Dung Chi Tiết'],
    ['KT01', 'Kiến thức', 'Nắm vững lý thuyết cơ bản về Sinh học tế bào và di truyền phân tử.'],
    ['KT02', 'Kiến thức', 'Hiểu rõ cơ chế phiên mã, dịch mã và điều hòa hoạt động của gen.'],
    ['UD01', 'Ưu điểm', 'Biết vận dụng kiến thức vào để giải thích các câu hỏi vận dụng, liên hệ thực tiễn.'],
    ['UD02', 'Ưu điểm', 'Lập luận logic, tư duy phân tích đồ thị và số liệu sinh học chính xác.'],
    ['HC01', 'Hạn chế', 'Có phần còn giải thích chưa chặt chẽ, diễn đạt chưa cụ thể và sâu sắc.'],
    ['HC02', 'Hạn chế', 'Đôi khi còn nhầm lẫn giữa các cấu trúc màng và các bậc protein.'],
    ['BP01', 'Biện pháp', 'Rèn cách lập luận logic hơn: luôn tách bạch rõ ràng giữa phần Kết luận và Giải thích.'],
    ['BP02', 'Biện pháp', 'Tập thói quen lập dàn ý nhanh ra nháp cho các câu hỏi tự luận để đảm bảo đủ ý.'],
  ];

  const ws2 = XLSX.utils.aoa_to_sheet(commentsData);
  XLSX.utils.book_append_sheet(wb, ws2, 'Mã nhận xét chuẩn hóa');

  // Tạo và tải file
  XLSX.writeFile(wb, 'BioGrade_Mau_Nhap_Du_Lieu_Excel.xlsx');
}
