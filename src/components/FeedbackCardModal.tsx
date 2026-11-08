import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas-pro';
import { Download, X, Copy, Check, AlertCircle } from 'lucide-react';
import { Student, MonthMeta, MONTHS_CONFIG } from '../data/studentsData';
import { getCommentByCode } from '../data/biologyComments';

interface FeedbackCardModalProps {
  student: Student;
  testId: number;
  allStudents: Student[];
  onClose: () => void;
  monthsConfig?: MonthMeta[];
  customScore?: number;
  customTexts?: {
    ktText?: string;
    udText?: string;
    hcText?: string;
    bpText?: string;
  };
}

// Hàm phân tách nội dung nhận xét: mỗi mã hoặc 1 câu văn là 1 ý để gạch đầu dòng
const resolveBlockPoints = (
  customText?: string,
  savedCustom?: string,
  codes?: string[]
): string[] => {
  const points: string[] = [];
  const text = customText?.trim() || savedCustom?.trim();

  if (text) {
    // Tách theo dòng trước
    const rawLines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    for (const line of rawLines) {
      // Loại bỏ các gạch đầu dòng, ký tự đặc biệt đã có ở đầu dòng
      const clean = line.replace(/^[\s•\-*–—\d.)]+/, '').trim();
      if (!clean) continue;

      // Nếu trong 1 dòng có nhiều câu văn riêng biệt (kết thúc bằng . ; ! và theo sau bởi chữ in hoa / số / chữ tiếng Việt)
      const sentences = clean
        .split(/(?<=[.!;])\s+(?=[A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸ0-9])/u)
        .map(s => s.replace(/^[\s•\-*–—\d.)]+/, '').trim())
        .filter(Boolean);

      if (sentences.length > 1) {
        for (const s of sentences) {
          if (s) points.push(s);
        }
      } else {
        points.push(clean);
      }
    }
  } else if (codes && codes.length > 0) {
    // Nếu dùng mã chuẩn: Mỗi 1 mã là 1 ý riêng biệt
    for (const code of codes) {
      const commentStr = getCommentByCode(code)?.trim();
      if (commentStr) {
        const clean = commentStr.replace(/^[\s•\-*–—\d.)]+/, '').trim();
        if (clean) points.push(clean);
      }
    }
  }

  return points;
};


export const FeedbackCardModal: React.FC<FeedbackCardModalProps> = ({
  student,
  testId,
  onClose,
  monthsConfig = MONTHS_CONFIG,
  customScore,
  customTexts,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const allTests = monthsConfig.flatMap(m => m.tests);
  const testMeta = allTests.find(t => t.id === testId) || allTests[0];
  const testResult = student.results[testId];
  const monthMeta = monthsConfig.find(m => m.tests.some(t => t.id === testId));

  const finalScore = customScore !== undefined ? customScore : (testResult?.score ?? null);
  const comment = testResult?.comment ?? { ktCodes: [], udCodes: [], hcCodes: [], bpCodes: [] };

  const testDisplayName = testMeta?.title || `Bài ${testId}`;

  // Phân tích các ý cho từng khối nhận xét
  const ktPoints = resolveBlockPoints(customTexts?.ktText, comment.customKt, comment.ktCodes);
  const udPoints = resolveBlockPoints(customTexts?.udText, comment.customUd, comment.udCodes);
  const hcPoints = resolveBlockPoints(customTexts?.hcText, comment.customHc, comment.hcCodes);
  const bpPoints = resolveBlockPoints(customTexts?.bpText, comment.customBp, comment.bpCodes);

  // Định dạng tên lớp theo mẫu: "LỚP LUYỆN ĐỀ CHIỀU CHỦ NHẬT"
  const formatClassTitle = (className?: string) => {
    if (!className) return 'LỚP LUYỆN ĐỀ CHIỀU CHỦ NHẬT';
    const clean = className.trim();
    const upper = clean.toUpperCase();
    if (upper.startsWith('LỚP LUYỆN ĐỀ')) return upper;
    if (upper.startsWith('LỚP')) return `LỚP LUYỆN ĐỀ ${upper.replace(/^LỚP\s+/, '')}`;
    return `LỚP LUYỆN ĐỀ ${upper}`;
  };

  // Định dạng điểm số: dùng dấu phẩy (,) như mẫu (VD: 5,5/10), 0 hiển thị là 0, chưa có điểm hiển thị là -
  const formattedScore = (finalScore !== null && finalScore !== undefined)
    ? (finalScore === 0 ? '0' : String(Number(finalScore.toFixed(2))).replace('.', ','))
    : '-';

  // Khối kiến thức: trình bày dưới dạng đoạn văn
  const ktParagraph = ktPoints.length > 0 ? ktPoints.join(' ').trim() : 'Nắm vững kiến thức trọng tâm của bài luyện đề.';

  // Tự động tính toán cỡ chữ cho bảng để đảm bảo luôn vừa vặn không bị tràn trang A4 (792px)
  const totalContentChars =
    ktParagraph.length +
    udPoints.reduce((s, p) => s + p.length, 0) +
    hcPoints.reduce((s, p) => s + p.length, 0) +
    bpPoints.reduce((s, p) => s + p.length, 0);

  const getDynamicContentStyle = () => {
    if (totalContentChars > 1100) {
      return { fontSize: '13px', lineHeight: '1.38', spaceY: 'space-y-1.5' };
    }
    if (totalContentChars > 800) {
      return { fontSize: '14px', lineHeight: '1.45', spaceY: 'space-y-2' };
    }
    return { fontSize: '14.5px', lineHeight: '1.5', spaceY: 'space-y-2.5' };
  };

  const dynamicStyle = getDynamicContentStyle();

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    setExportError(null);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // Tên file tải về: BÀI X - TÊN HỌC SINH.png
      const fileName = `BÀI ${testId} - ${student.name.toUpperCase()}.png`;

      canvas.toBlob(blob => {
        if (!blob) {
          const image = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = image;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          setTimeout(() => document.body.removeChild(link), 200);
          return;
        }

        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }, 500);
      }, 'image/png');
    } catch (err) {
      console.error('Failed to export image:', err);
      setExportError('Không thể tạo file ảnh phiếu nhận xét tự động. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyText = () => {
    // Trình bày chuẩn xác theo mẫu
    let skillsText = 'b) Kĩ năng:\n';
    if (udPoints.length === 1) {
      skillsText += `- Ưu điểm: ${udPoints[0]}\n`;
    } else if (udPoints.length > 1) {
      skillsText += `- Ưu điểm:\n${udPoints.map(p => ` + ${p}`).join('\n')}\n`;
    }

    if (hcPoints.length === 1) {
      skillsText += `- Hạn chế: ${hcPoints[0]}\n`;
    } else if (hcPoints.length > 1) {
      skillsText += `- Hạn chế:\n${hcPoints.map(p => ` + ${p}`).join('\n')}\n`;
    }

    const bpText = bpPoints.length > 0 ? bpPoints.map(p => `- ${p}`).join('\n') : '';

    const formatted = `ĐÁNH GIÁ KẾT QUẢ CÁC BÀI LUYỆN ĐỀ ${monthMeta?.name ? monthMeta.name.toUpperCase() : 'THÁNG 9'} – MÔN SINH HỌC
${formatClassTitle(student.className)} - BÀI LUYỆN ĐỀ SỐ ${testId}
HỌ VÀ TÊN: ${student.name.toUpperCase()}
ĐIỂM: ${formattedScore}/10

[NHẬN XÉT TỔNG QUAN]
a) Kiến thức: ${ktParagraph}
${skillsText.trim()}

[BIỆN PHÁP KHẮC PHỤC]
${bpText}`;

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-6xl my-4 bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Modal Action Header */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Phiếu Nhận Xét Bài Làm (Khổ A4 Ngang - Chuẩn Mẫu PDF)
            </h3>
            <p className="text-xs text-slate-500">
              Font Times New Roman · Tiêu đề 18px · Họ tên & Điểm 16px · Bảng 2 hàng chuẩn xác
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              {copied ? 'Đã sao chép!' : 'Sao chép văn bản'}
            </button>
            <button
              onClick={handleDownloadImage}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-[#1e7e34] hover:bg-[#166534] rounded-lg transition-colors shadow-xs disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              {isExporting ? 'Đang xuất ảnh...' : 'Xuất phiếu nhận xét (PNG)'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {exportError && (
          <div className="mx-6 mt-3 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center justify-between text-xs text-red-700">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{exportError}</span>
            </div>
            <button
              onClick={() => setExportError(null)}
              className="text-red-500 hover:text-red-700 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Scrollable Container containing the exact A4 Landscape card */}
        <div className="p-4 sm:p-6 overflow-auto max-h-[calc(94vh-65px)] bg-slate-200/80 flex justify-center items-start">
          <div className="shadow-2xl overflow-hidden shrink-0 border border-slate-400 bg-white">
            {/*
              THE A4 LANDSCAPE SHEET:
              - Standard A4 Landscape: 1120px × 792px
              - Font: Times New Roman
              - Tiêu đề: cỡ chữ 18 (in hoa, in đậm)
              - Họ và tên: cỡ chữ 16 (in hoa, in đậm, màu xanh lá cây #1e7e34)
              - Điểm: cỡ chữ 16 (in đậm, màu đỏ #d32f2f, định dạng dấu phẩy: VD: 5,5/10)
              - Bảng 2 hàng x 2 cột có khung viền đen (1.5px solid black):
                + Hàng 1 trái: NHẬN XÉT \n TỔNG QUAN
                + Hàng 1 phải:
                  a) Kiến thức: [Đoạn văn]
                  b) Kĩ năng:
                    - Ưu điểm: (1 ý thì nối tiếp sau dấu ":", từ 2 ý trở lên gạch đầu dòng "+")
                    - Hạn chế: (1 ý thì nối tiếp sau dấu ":", từ 2 ý trở lên gạch đầu dòng "+")
                + Hàng 2 trái: BIỆN PHÁP \n KHẮC PHỤC
                + Hàng 2 phải: Các ý biện pháp bắt đầu bằng gạch đầu dòng "-"
            */}
            <div
              ref={cardRef}
              style={{
                width: '1120px',
                height: '792px',
                minWidth: '1120px',
                minHeight: '792px',
                maxWidth: '1120px',
                maxHeight: '792px',
                fontFamily: '"Times New Roman", Times, serif',
                backgroundColor: '#ffffff',
                color: '#000000',
              }}
              className="p-10 flex flex-col justify-between box-border select-none"
            >
              {/* Header: Centered 4 lines */}
              <div className="text-center mb-5 shrink-0">
                {/* Dòng 1: Tiêu đề cỡ chữ 18 */}
                <h1
                  style={{ fontSize: '18px' }}
                  className="font-bold uppercase tracking-normal leading-snug text-black"
                >
                  ĐÁNH GIÁ KẾT QUẢ CÁC BÀI LUYỆN ĐỀ {monthMeta?.name ? monthMeta.name.toUpperCase() : 'THÁNG 9'} – MÔN SINH HỌC
                </h1>

                {/* Dòng 2: Tên lớp và bài luyện đề cỡ chữ 18 */}
                <h2
                  style={{ fontSize: '18px' }}
                  className="font-bold uppercase tracking-normal leading-snug text-black mt-0.5"
                >
                  {formatClassTitle(student.className)} - BÀI LUYỆN ĐỀ SỐ {testId}
                </h2>

                {/* Dòng 3: Họ và tên cỡ chữ 16, màu xanh lá cây (#1e7e34) */}
                <div
                  style={{ fontSize: '16px', color: '#1e7e34' }}
                  className="font-bold uppercase tracking-normal leading-snug mt-1"
                >
                  HỌ VÀ TÊN: {student.name.toUpperCase()}
                </div>

                {/* Dòng 4: Điểm cỡ chữ 16, màu đỏ (#d32f2f) */}
                <div
                  style={{ fontSize: '16px', color: '#d32f2f' }}
                  className="font-bold tracking-normal leading-snug mt-0.5"
                >
                  ĐIỂM: {formattedScore}/10
                </div>
              </div>

              {/* Table: 2 rows x 2 columns with black borders */}
              <div className="flex-1 flex flex-col min-h-0 border-[1.5px] border-black">
                {/* ROW 1: NHẬN XÉT TỔNG QUAN */}
                <div className="flex flex-1 min-h-0 border-b-[1.5px] border-black">
                  {/* Cột trái: NHẬN XÉT TỔNG QUAN */}
                  <div
                    style={{ width: '180px', minWidth: '180px' }}
                    className="border-r-[1.5px] border-black flex flex-col items-center justify-center text-center p-3 font-bold text-[15px] uppercase leading-tight select-none bg-white text-black"
                  >
                    <div>NHẬN XÉT</div>
                    <div>TỔNG QUAN</div>
                  </div>

                  {/* Cột phải: a) Kiến thức & b) Kĩ năng */}
                  <div
                    style={{
                      fontSize: dynamicStyle.fontSize,
                      lineHeight: dynamicStyle.lineHeight,
                    }}
                    className="flex-1 p-4 overflow-hidden flex flex-col justify-start text-black"
                  >
                    {/* a) Kiến thức: trình bày dạng đoạn văn */}
                    <div className="text-justify mb-2.5">
                      <span>a) Kiến thức: </span>
                      <span>{ktParagraph}</span>
                    </div>

                    {/* b) Kĩ năng */}
                    <div>
                      <div className="mb-1">b) Kĩ năng:</div>

                      {/* - Ưu điểm */}
                      {udPoints.length === 1 ? (
                        <div className="mb-1 text-justify">
                          <span>- Ưu điểm: </span>
                          <span>{udPoints[0]}</span>
                        </div>
                      ) : udPoints.length > 1 ? (
                        <div className="mb-1.5">
                          <div>- Ưu điểm:</div>
                          <div className="pl-4 space-y-0.5">
                            {udPoints.map((point, idx) => (
                              <div key={idx} className="flex items-start text-justify">
                                <span className="mr-1.5 shrink-0">+</span>
                                <span>{point}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {/* - Hạn chế */}
                      {hcPoints.length === 1 ? (
                        <div className="text-justify">
                          <span>- Hạn chế: </span>
                          <span>{hcPoints[0]}</span>
                        </div>
                      ) : hcPoints.length > 1 ? (
                        <div>
                          <div>- Hạn chế:</div>
                          <div className="pl-4 space-y-0.5">
                            {hcPoints.map((point, idx) => (
                              <div key={idx} className="flex items-start text-justify">
                                <span className="mr-1.5 shrink-0">+</span>
                                <span>{point}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* ROW 2: BIỆN PHÁP KHẮC PHỤC */}
                <div className="flex flex-1 min-h-0">
                  {/* Cột trái: BIỆN PHÁP KHẮC PHỤC */}
                  <div
                    style={{ width: '180px', minWidth: '180px' }}
                    className="border-r-[1.5px] border-black flex flex-col items-center justify-center text-center p-3 font-bold text-[15px] uppercase leading-tight select-none bg-white text-black"
                  >
                    <div>BIỆN PHÁP</div>
                    <div>KHẮC PHỤC</div>
                  </div>

                  {/* Cột phải: Các ý gạch đầu dòng */}
                  <div
                    style={{
                      fontSize: dynamicStyle.fontSize,
                      lineHeight: dynamicStyle.lineHeight,
                    }}
                    className={`flex-1 p-4 overflow-hidden flex flex-col justify-start ${dynamicStyle.spaceY} text-black`}
                  >
                    {bpPoints.length === 0 ? (
                      <div className="flex items-start text-justify">
                        <span className="mr-2 shrink-0">-</span>
                        <span>Duy trì tiến độ học tập và tiếp tục làm bài tập rèn luyện định kỳ.</span>
                      </div>
                    ) : (
                      bpPoints.map((point, idx) => (
                        <div key={idx} className="flex items-start text-justify">
                          <span className="mr-2 shrink-0 font-bold">-</span>
                          <span>{point}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

