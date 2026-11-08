/**
 * Biology Practice Test Comments Repository (Kho mẫu nhận xét Môn Sinh học)
 * Structured from teacher CSV data: KT (Kiến thức), UD (Ưu điểm), HC (Hạn chế), BP (Biện pháp khắc phục)
 */

export interface CommentTemplate {
  code: string;
  category: 'KT' | 'UD' | 'HC' | 'BP';
  categoryName: string;
  content: string;
}

export const BIOLOGY_COMMENTS: CommentTemplate[] = [
  // --- KIẾN THỨC (KT) ---
  {
    code: 'KT01',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con có nền tảng kiến thức tốt, nắm bắt được trọng tâm của bài học và có thể chủ động áp dụng những kiến thức đã học để giải quyết hiệu quả nhiều dạng bài tập.'
  },
  {
    code: 'KT02',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con hiểu tốt những kiến thức trọng tâm và có khả năng xử lý hiệu quả các dạng yêu cầu trong bài. Tuy nhiên, con cần chú ý hơn đến những chi tiết nhỏ để bài làm được đầy đủ và trọn vẹn hơn.'
  },
  {
    code: 'KT03',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con nắm được phần lớn kiến thức chuyên đề nhưng chưa thực sự sâu sắc, dẫn đến việc giải thích đôi khi còn chưa cặn kẽ.'
  },
  {
    code: 'KT04',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con có ý thức học tập và đã nắm được những nội dung cơ bản. Tuy nhiên, khi làm bài, con vẫn cần rèn luyện thêm cách áp dụng kiến thức vào từng tình huống cụ thể, đồng thời tăng cường khả năng kết nối bài học với những vấn đề thực tế.'
  },
  {
    code: 'KT05',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con có kiến thức ở mức khá, tuy nhiên còn nhầm lẫn nhẹ giữa các khái niệm hoặc các cơ chế sinh học có tính chất tương tự.'
  },
  {
    code: 'KT06',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con đã có sự tiếp cận với kiến thức môn học nhưng mức độ ghi nhớ và hiểu các nội dung nền tảng vẫn chưa thật sự chắc chắn. Vì vậy, con nên tập trung ôn lại các khái niệm quan trọng và luyện tập từ những dạng bài cơ bản trước khi nâng dần lên các câu hỏi vận dụng.'
  },
  {
    code: 'KT07',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con còn hổng nhiều mảng lý thuyết quan trọng, cần dành thêm thời gian để hệ thống hóa lại toàn bộ kiến thức cơ bản.'
  },
  {
    code: 'KT08',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con chưa hiểu rõ bản chất của các cơ chế sinh lý, câu trả lời chủ yếu dừng lại ở việc nêu hiện tượng mà chưa làm rõ nguyên nhân.'
  },
  {
    code: 'KT09',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con ghi nhớ tốt các công thức và tính toán chính xác, nhưng phần lý thuyết giải thích còn sơ sài, thiếu căn cứ khoa học.'
  },
  {
    code: 'KT10',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con có sự tiến bộ trong việc nắm bắt kiến thức so với các bài trước, nên kết quả có sự cải thiện.'
  },
  {
    code: 'KT11',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con có tư duy nhạy bén, hiểu vấn đề nhanh, tuy nhiên nền tảng kiến thức chưa vững dẫn tới con còn lúng túng khi xử lý các yêu cầu của đề bài.'
  },
  {
    code: 'KT12',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Nền tảng kiến thức ở mức trung bình, các câu trả lời mới dừng lại ở việc nêu hiện tượng mà chưa làm rõ được nguyên nhân và cơ chế sinh học.'
  },
  {
    code: 'B7_KT13',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con cần ôn tập thêm về: cơ chế điều hòa của các hormone sinh dục (FSH, LH, estrogen, progesterone) và chu kỳ kinh nguyệt; biến động áp suất trong các ngăn tim/động mạch chủ và trạng thái hoạt động của các van tim.'
  },
  {
    code: 'B7_KT14',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con cần chủ động nghiên cứu kỹ hơn về phần kiến thức: hệ nội tiết, chu kỳ tim, sinh thái học (tăng trưởng của quần thể, diễn thế sinh thái...).'
  },
  {
    code: 'B7_KT15',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con cần ôn tập kỹ thêm về phần hệ vận động, hệ tuần hoàn, chu kỳ tim, sinh thái học và nhân tố sinh thái.'
  },
  {
    code: 'B7_KT16',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con cần chủ động nghiên cứu kĩ về phần các như: Điều hoà hệ tuần hoàn, hô hấp.'
  },
  {
    code: 'B7_KT17',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con cũng cần nghiên cứu kĩ về phần Hệ Sinh thái: Mối liên hệ, ảnh hưởng của các sinh vật với nhau thông qua phân tích đồ thị.'
  },
  {
    code: 'B7_KT18',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Đặc biệt các phần kiến thức về Hệ Sinh sản (Sự thay đổi nồng độ từng loại hormone, cơ chế tác động của từng loại).'
  },
  {
    code: 'B7_KT19',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con có kiến thức cơ bản nhưng chưa chắc chắn dẫn đến vận dụng vào bài làm bị sai phương hướng hoặc chưa đúng cách diễn đạt gây mất điểm đáng tiếc.'
  },
  {
    code: 'B7_KT20',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con cần chú ý ôn tập lại, đặc biệt là phần kiến thức về chu kỳ tim, quá trình sinh sản (chu kỳ buồng trứng và giai đoạn mang thai), sinh thái học (các nhân tố vô sinh và mối liên hệ giữa các nhân tố, giới hạn sinh thái).'
  },
  {
    code: 'B7_KT21',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Đặc biệt các kiến thức về Điều hoà hệ tuần hoàn, hệ hô hấp; hệ nội tiết (hormone ADH, EPO...).'
  },
  {
    code: 'B7_KT22',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con cần chủ động nghiên cứu kỹ hơn về phần kiến thức về hệ nội tiết (cơ chế tác dụng ADH), hệ tuần hoàn...'
  },
  {
    code: 'B7_KT23',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con có nền tảng ở mức cơ bản nhưng chưa vững dẫn đến vận dụng chưa tốt vào xử lý bài tập.'
  },
  {
    code: 'B7_KT24',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con thiếu nhiều kiến thức dẫn đến chưa đưa ra đúng phương hướng trả lời, không liên hệ được kiến thức vào bài làm gây mất điểm đáng tiếc. Con cần học lại phần kiến thức như: Hệ tuần hoàn và hô hấp (Phần điều hoà), Hệ nội tiết (vai trò của thụ thể và các hormone...).'
  },
  {
    code: 'B7_KT25',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con hổng rất nhiều kiến thức nên chưa vận dụng được kiến thức vào bài. Con cần học lại và nắm chắc các phần kiến thức Sinh lý hô hấp, các enzyme tiêu hóa, các mối quan hệ trong quần xã, Di truyền phân tử (cấu trúc phân tử của DNA).'
  },
  {
    code: 'B7_KT26',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con cần ôn kỹ các kiến thức về các mối quan hệ trong quần xã, tăng trưởng quần thể, sinh lý tim và hệ nội tiết để bài làm sau được cải thiện tốt hơn.'
  },
  {
    code: 'B9_KT27',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con cần ôn kỹ hơn về những dị tật tim, cấu tạo và chức năng của các tế bào máu, sinh thái học cá thể.'
  },
  {
    code: 'B9_KT28',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con cần chú ý ôn tập lại các kiến thức. Đặc biệt các kiến thức về Cấu trúc và chức năng tế bào, cũng như sự tăng trưởng của quần thể.'
  },
  {
    code: 'B9_KT29',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Tuy nhiên kiến thức của con vẫn còn chưa vững. Con cần chú ý ôn tập lại, đặc biệt là phần kiến thức về các bệnh về tim, hệ nội tiết (hormone tuyến giáp), diễn thế sinh thái.'
  },
  {
    code: 'B9_KT30',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Tuy nhiên kiến thức của con vẫn còn chưa vững. Con cần chú ý ôn tập lại, đặc biệt là phần kiến thức về các bệnh về tim, cấu trúc và chức năng của các loại tế bào cũng như sự tăng trưởng của quần thể sinh vật.'
  },
  {
    code: 'B9_KT31',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Nhìn chung, nền tảng kiến thức cơ bản của con còn chưa vững và hổng khá nhiều. Con chưa nắm vững các khái niệm cốt lõi nên còn lúng túng khi xử lý các câu hỏi trong đề. Con cần nhanh chóng ôn tập lại từ đầu kiến thức cơ bản về các chuyên đề: Sinh học cơ thể người, Sinh thái học, Di truyền học.'
  },
  {
    code: 'B9_KT32',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Nhìn chung, nền tảng kiến thức chung của con còn chưa vững và chưa ổn định. Con chưa nắm được các khái niệm và cơ chế cốt lõi nên còn gặp nhiều khó khăn khi xử lý các câu hỏi trong đề nên còn lúng túng và chưa đạt điểm tối đa.'
  },
  {
    code: 'B9_KT33',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Nhìn chung, nền tảng kiến thức của con đã có sự tiến bộ, điểm số cải thiện rõ rệt so với các bài trước. Con đã ghi nhớ tốt hơn các khái niệm cơ bản và khắc phục được một số lỗ hổng lý thuyết.'
  },
  {
    code: 'KT34',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con đã nắm được các khái niệm cơ bản, nhưng để xử lý tốt các câu hỏi vận dụng cao thì con vẫn cần chú ý ôn tập thêm các phần kiến thức còn sai, nhầm lẫn với nhau.'
  },
  {
    code: 'KT35',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Về các thí nghiệm hoá sinh, con cần chú điều kiện hoạt động của enzyme amylase và các loại thuốc thử nhận biết nhóm chất, hiện tượng đặc trưng...'
  },
  {
    code: 'KT36',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Phần kiến thức về Hệ hô hấp con còn nhầm lẫn, cần chú ý ôn tập lại cơ chế thay đổi pH trong máu do sự ứ đọng của khí CO2.'
  },
  {
    code: 'KT37',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con cần xem lại phần Sinh thái học, đặc biệt chú ý đến việc xác định vai trò và phân tích tác động qua lại (kìm hãm, cạnh tranh, thức ăn...) giữa các sinh vật với nhau trong quần xã.'
  },
  {
    code: 'KT38',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Phần Di truyền học con nắm chưa vững, con cần chú ý ôn tập kĩ lại thí nghiệm chứng minh vật chất di truyền (các bước tiến hành, mục đích sử dụng đồng vị phóng xạ). Con cũng cần ôn tập lại các thành phần cấu trúc của phân tử DNA để phục vụ tốt cho việc tính toán.'
  },
  {
    code: 'KT39',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con cần chú ý ôn tập các phần kiến thức về hệ tuần hoàn (sự thay đổi áp lực trong các buồng tim), hệ nội tiết (điều hoà sản xuất hồng cầu...) để có thể vận dụng vào làm câu hỏi ứng dụng, liên hệ.'
  },
  {
    code: 'KT40',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con cũng cần chú ý ôn tập thêm phần kiến thức về Sinh lý (hệ hô hấp, điều hòa nội môi) và sinh thái học (quần thể, quần xã, hệ sinh thái).'
  },
  {
    code: 'KT41',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Tuy nhiên con còn nhầm lẫn một số khái niệm, thuật ngữ sinh học. Con cần chú ý ôn tập lại để nắm chắc hơn.'
  },
  {
    code: 'KT42',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con cần chú ý thêm phần kiến thức về điều hòa pH.'
  },
  {
    code: 'KT43',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con cần chú ý thêm phần kiến thức về Sinh thái học (sự thay đổi của quần thể sau nhiễu loạn, chuỗi thức ăn,...).'
  },
  {
    code: 'KT44',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Phần Hệ tuần hoàn, con chưa nắm vững chắc kiến thức chu kì hoạt động của tim, sự đóng mở van tim... nên chưa giải thích được sự thay đổi áp suất tâm thất khi hẹp van tim.'
  },
  {
    code: 'KT45',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Phần hệ Sinh sản, con cần chú ý ôn tập thêm về cơ chế điều hoà hormone sinh dục ở nữ giới (Vai trò của các hormone, tuyến sản xuất hormone...).'
  },
  {
    code: 'KT46',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Về phần Sinh thái học con cần xem lại phương pháp sử dụng đồng vị phóng xạ để xác định bậc dinh dưỡng và mối quan hệ thức ăn giữa các loài.'
  },
  {
    code: 'KT47',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Mảng Di truyền học, con cần bổ sung kiến thức về phần tên gọi và chức năng cụ thể của từng loại enzyme tham gia vào quá trình tái bản DNA để không bị mất điểm.'
  },
  {
    code: 'KT48',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con cần chú ý ôn tập về chỉ số sinh lý (chỉ số hematocrit,...), protein (các liên kết của từng bậc cấu trúc), cách tính mức năng lượng.'
  },
  {
    code: 'KT49',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con cũng cần chú ý ôn tập thật kỹ những kiến thức nền tảng về Sinh lý người (các dị tật tim, các hormone sinh dục nữ).'
  },
  {
    code: 'KT50',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con còn hiểu sai và chưa phân biệt được rõ yếu tố biến động môi trường với nguồn sống dẫn tới giải thích sai câu hỏi.'
  },
  {
    code: 'KT51',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con ghi nhớ tốt chu kỳ hoạt động của tim tuy nhiên khi áp dụng vào bài tập bệnh lý con vẫn chưa vận dụng được.'
  },
  {
    code: 'KT52',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con cần ôn tập kĩ hơn về chu kỳ hoạt động của tim, thí nghiệm di truyền của Griffith.'
  },
  {
    code: 'KT53',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con cần ôn tập lại kĩ hơn về hoạt động tiêu hóa trong ống tiêu hóa ở người và đặc điểm của các cơ hô hấp.'
  },
  {
    code: 'KT54',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con cần chú ý ôn tập lại mảng Sinh lý người. Con còn nhầm lẫn về quá trình tiêu hóa (vị trí, điều kiện, enzyme phân giải tinh bột, protein...).'
  },
  {
    code: 'KT55',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con cũng cần xem lại khái niệm nhiễu loạn (biến động) sinh thái và tác động của nó đến độ đa dạng quần xã.'
  },
  {
    code: 'KT56',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Phần Di truyền học, con cần chú ý ôn tập kĩ lại mục đích và ý nghĩa thí nghiệm của Griffith.'
  },
  {
    code: 'KT57',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Phần Di truyền học con cần chú ý ôn tập để hiểu rõ mục đích và kết quả của các thí nghiệm chứng minh vật chất di truyền (hiện tượng biến nạp...).'
  },
  {
    code: 'KT58',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Về phần hệ Tuần hoàn, con cần khai thác yếu tố đồ thị áp suất - thể tích của tâm thất để làm bài. Con cần ôn tập lại thật kĩ bản chất các pha trong chu kì hoạt động của tim và cơ chế đóng/mở van tim, từ đó mới hiểu và giải thích được sự thay đổi của áp suất và thể tích trên đồ thị.'
  },
  {
    code: 'KK59',
    category: 'KT',
    categoryName: 'Kiến thức',
    content: 'Con cần lưu ý hoạt động phân giải các chất trong quá trình tiêu hóa, một số kiến thức Sinh thái, Di truyền để làm bài chặt chẽ, khoa học hơn.'
  },

  // --- ƯU ĐIỂM (UD) ---
  {
    code: 'UD01',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Trình bày bài làm sạch sẽ, logic, rõ ràng, biết cách phân chia các ý lớn và ý nhỏ một cách khoa học.'
  },
  {
    code: 'UD02',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Có tư duy phân tích tốt, biết cách bóc tách dữ kiện từ đề bài để xây dựng hướng giải quyết chính xác.'
  },
  {
    code: 'UD03',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Có ý thức hoàn thiện bài làm và cố gắng trả lời các câu hỏi trong đề.'
  },
  {
    code: 'UD04',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Kỹ năng tính toán định lượng tốt, vận dụng công thức vào các bài tập sinh lý một cách thuần thục và chính xác.'
  },
  {
    code: 'UD05',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Biết cách khai thác thông tin hiệu quả từ kênh hình, sơ đồ và đồ thị để đưa ra các kết luận logic.'
  },
  {
    code: 'UD06',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Lập luận tự luận chặt chẽ, sắc sảo, ngôn từ bám sát bản chất sinh học và đi thẳng vào trọng tâm vấn đề.'
  },
  {
    code: 'UD07',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Có thái độ làm bài nghiêm túc, tập trung cao độ và cố gắng hoàn thành trọn vẹn bài thi cho đến hết giờ.'
  },
  {
    code: 'UD08',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Sử dụng thuật ngữ chuyên ngành chính xác và thống nhất, giúp bài viết có tính khoa học và thuyết phục cao.'
  },
  {
    code: 'UD09',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Bước đầu biết cách sử dụng phương pháp phản đề để bác bỏ nhận định sai và làm nổi bật đáp án đúng.'
  },
  {
    code: 'UD10',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Phân bổ thời gian làm bài hợp lý, đảm bảo hoàn thành đầy đủ cả phần trắc nghiệm và tự luận mà không bị áp lực thời gian.'
  },
  {
    code: 'UD11',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Chữ viết rõ ràng, dễ đọc; bố cục các câu trả lời thoáng, giúp người chấm dễ dàng theo dõi mạch ý.'
  },
  {
    code: 'B7_UD12',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Đọc hiểu đồ thị áp suất tim chính xác, gọi tên đúng các pha trong chu kỳ tim dựa trên diễn biến đường cong.'
  },
  {
    code: 'B7_UD13',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Kỹ năng so sánh đối chiếu đồ thị tốt, rút ra được sự khác biệt về giới hạn sinh thái giữa loài ôn đới và nhiệt đới.'
  },
  {
    code: 'B7_UD14',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Lập luận có trình tự khi phân tích sự thay đổi các nhân tố vô sinh theo thời gian trong ngày.'
  },
  {
    code: 'B7_UD15',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Bước đầu có sự phân tích sự thay đổi các nhân tố vô sinh theo thời gian trong ngày.'
  },
  {
    code: 'B7_UD16',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Bước đầu đã biết vận dụng kiến thức đã có vào xác định phương hướng làm và trình bày bài.'
  },
  {
    code: 'B7_UD17',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Có thể thông qua ghi nhớ kiến thức và phân tích đúng các pha của chu kì tim thể hiện trong đồ thị.'
  },
  {
    code: 'B7_UD18',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Có sự phân tích số liệu trong bảng, đồ thị để đưa ra kết luận logic.'
  },
  {
    code: 'B7_UD19',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Bước đầu đã có ý thức làm bài nghiêm túc.'
  },
  {
    code: 'B7_UD20',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Kĩ năng tính toán tốt.'
  },
  {
    code: 'B7_UD21',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Đã biết vận dụng kiến thức để hoàn thiện bài tập liên quan đến dị tật tim.'
  },
  {
    code: 'B7_UD22',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Phần trắc nghiệm con hoàn thiện tốt.'
  },
  {
    code: 'B7_UD23',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Đã biết vận dụng kiến thức về tế bào, sinh lý tim mạch, sinh thái học vào xác định phương hướng làm.'
  },
  {
    code: 'B7_UD24',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Trình bày và vận dụng khá tốt kiến thức về cấu tạo của tế bào phù hợp với chức năng (hồng cầu, bạch cầu).'
  },
  {
    code: 'B7_UD25',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Biết vận dụng kiến thức vào để giải thích các câu hỏi vận dụng, mang tính ứng dụng, liên hệ.'
  },
  {
    code: 'B7_UD26',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Chữ viết sạch sẽ, rõ ràng.'
  },
  {
    code: 'B7_UD27',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Chữ viết có cải thiện, đã rõ ràng, dễ đọc hơn.'
  },
  {
    code: 'UD28',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Con đã biết cách xây dựng biểu đồ dựa trên số liệu của đề bài.'
  },
  {
    code: 'UD29',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Con đã có ý thức ôn tập kiến thức và có cố gắng vận dụng vào bài tập.'
  },
  {
    code: 'UD30',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Biết cách lập luận logic, tách bạch rõ ràng giữa phần kết luận và giải thích.'
  },
  {
    code: 'UD31',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Hoàn thành tốt bài tập tính toán số lượng Nu trên DNA.'
  },
  {
    code: 'UD32',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Đọc kĩ và phân tích đúng yêu cầu của đề bài, xác định được các từ khóa quan trọng để định hướng làm bài chính xác.'
  },
  {
    code: 'UD33',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Kĩ năng tính toán phần bài tập cấu trúc DNA rất tốt, con biết cách áp dụng đúng công thức và đưa ra kết quả.'
  },
  {
    code: 'UD34',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Con đã có sự cải thiện về cách trình bày, hạn chế viết tắt.'
  },
  {
    code: 'UD35',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Con ghi nhớ và hoàn thành tốt bài tập về thí nghiệm của Griffith.'
  },
  {
    code: 'UD36',
    category: 'UD',
    categoryName: 'Ưu điểm',
    content: 'Trình bày bài tự luận rất mạch lạc. Con biết dùng kí hiệu để phân tách rõ ràng ý chính và các ý giải thích phụ, giúp giám khảo dễ dàng theo dõi trọn vẹn mạch tư duy.'
  },

  // --- HẠN CHẾ (HC) ---
  {
    code: 'HC01',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Diễn đạt còn dài dòng, lan man, chưa thực sự tập trung vào các từ khóa trọng tâm của câu hỏi.'
  },
  {
    code: 'HC02',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Kỹ năng đọc và phân tích đề chưa kỹ, dẫn đến việc bỏ sót dữ kiện hoặc hiểu chưa đúng yêu cầu cốt lõi.'
  },
  {
    code: 'HC03',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Lập luận thiếu tính logic, các bước suy luận rời rạc và thiếu các dẫn chứng/số liệu từ đề bài để minh chứng.'
  },
  {
    code: 'HC04',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Sử dụng quá nhiều từ viết tắt không đúng quy ước khoa học, làm mất đi tính rõ ràng của bài trình bày.'
  },
  {
    code: 'HC05',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Bài làm còn gạch xóa nhiều, trình bày chưa khoa học, ảnh hưởng đến tính thẩm mỹ và khả năng theo dõi của người chấm.'
  },
  {
    code: 'HC06',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Kỹ năng khai thác thông tin từ bảng số liệu và đồ thị còn hạn chế, chưa biết cách so sánh để rút ra bản chất.'
  },
  {
    code: 'HC07',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Chưa biết cách vận dụng kiến thức lý thuyết để giải thích các hiện tượng sinh học gắn liền với thực tiễn đời sống.'
  },
  {
    code: 'HC08',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Phân bổ thời gian chưa hợp lý nên có phần còn bỏ trống, chưa làm xong.'
  },
  {
    code: 'HC09',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Các ý giải thích chưa đi sâu vào cơ chế sinh học, lập luận còn mang tính liệt kê hiện tượng hoặc suy luận cảm tính.'
  },
  {
    code: 'HC10',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Việc sử dụng một số thuật ngữ/ khái niệm còn chưa chính xác, làm giảm tính khoa học và dễ gây hiểu lầm về mặt nội dung.'
  },
  {
    code: 'B7_HC11',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Nhầm lẫn kiến thức về vai trò của thụ thể, nguyên nhân/ cơ chế gây bệnh tiêu chảy...'
  },
  {
    code: 'B7_HC12',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Kỹ năng phân tích đồ thị hormone còn yếu, chưa làm rõ được mối quan hệ giữa nồng độ hormone và các sự kiện sinh sản (rụng trứng, làm tổ).'
  },
  {
    code: 'B7_HC13',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Bài làm còn bỏ sót ý hoặc chưa hoàn thiện ở các câu hỏi mang tính vận dụng, liên hệ.'
  },
  {
    code: 'B7_HC14',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Kỹ năng phân tích trong sinh thái còn yếu, chưa có khả năng quan sát tổng thể để suy ra mối liên hệ, liên quan của các đối tượng.'
  },
  {
    code: 'B7_HC15',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Chưa có kĩ năng đọc đề nên trả lời còn lạc đề, lan man, chưa đúng trọng tâm câu hỏi.'
  },
  {
    code: 'B7_HC16',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Lập luận chưa biết cách vận dụng kiến thức hoặc chưa trả lời hết ý hỏi làm lập luận thiếu chặt chẽ, mất điểm nhỏ lẻ.'
  },
  {
    code: 'B7_HC17',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Chữ viết còn cẩu thả, chưa cẩn thận, trình bày còn thiếu khoa học.'
  },
  {
    code: 'B7_HC18',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Con có xu hướng "gộp" các ý trả lời của các ý trả lời vào với nhau, gây mất điểm nhỏ lẻ, cần trả lời tách bạch các ý khác nhau.'
  },
  {
    code: 'B7_HC19',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Có phần còn chưa biết phân tích đồ thị bảng biểu để rút ra kết luận, lấy làm bằng chứng lý giải câu trả lời một cách thuyết phục.'
  },
  {
    code: 'B7_HC20',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Chưa nhuần nhuyễn với việc diễn đạt bằng từ ngữ sinh học dẫn đến đôi lúc diễn đạt không đúng trọng tâm, lan man.'
  },
  {
    code: 'B7_HC21',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Một số ý chưa biết cách vận dụng các kiến thức đã học do đó còn bỏ trống, chưa làm hoặc còn sơ sài, thiếu ý.'
  },
  {
    code: 'B7_HC22',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Kỹ năng phân tích bảng số liệu trong hệ tuần hoàn, đồ thị biến động trong hệ sinh thái còn yếu, chưa biết cách phân tích để rút ra kết luận.'
  },
  {
    code: 'B7_HC23',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Có phần còn giải thích chưa chặt chẽ, diễn đạt chưa cụ thể và sâu sắc kiến thức, gây mất điểm nhỏ lẻ.'
  },
  {
    code: 'B7_HC24',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Kiến thức không nắm vững dẫn đến chưa thể xác định đúng phương hướng câu hỏi và chưa thể vận dụng vào xử lý bài tập.'
  },
  {
    code: 'B7_HC25',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Có phần kiến thức, khái niệm còn chưa nắm vững nên còn nhầm lẫn, sai sót trong quá trình làm bài.'
  },
  {
    code: 'B8_HC26',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Trình bày chưa mạch lạc, rõ ràng.'
  },
  {
    code: 'B8_HC27',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Trình bày lủng củng, không rõ ý.'
  },
  {
    code: 'B8_HC28',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Thiếu kĩ năng phân tích đồ thị Sinh thái học, chưa biết cách liên hệ kiến thức vào bài làm.'
  },
  {
    code: 'B8_HC29',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Có phần chưa sử dụng số liệu từ trên bảng biểu, đồ thị để tăng tính chặt chẽ của bài làm.'
  },
  {
    code: 'B8_HC30',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Kỹ năng tính toán hoặc kỹ năng làm tròn số (theo yêu cầu đề bài) chưa tốt.'
  },
  {
    code: 'HC31',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Cách lập luận, giải thích hoặc diễn đạt các ý còn chưa thoát ý, cặn kẽ, thiếu logic dẫn đến mất điểm nhỏ.'
  },
  {
    code: 'B8_HC32',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Chưa đọc kỹ yêu cầu đề bài hoặc chưa xác định đúng trọng tâm yêu cầu câu hỏi nên định hướng làm bài chưa tốt.'
  },
  {
    code: 'B8_HC33',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Còn bỏ trống các ý, các câu hỏi.'
  },
  {
    code: 'B8_HC34',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Việc phân tích đồ thị hoặc bảng số liệu còn chưa sâu sắc, chưa biết đưa số liệu vào lập luận hoặc lập luận sơ sài, thiếu chặt chẽ.'
  },
  {
    code: 'B8_HC35',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Chưa biết cách vận dụng kiến thức lý thuyết để giải thích các hiện tượng sinh học gắn liền với thực tiễn đời sống hoặc các câu hỏi mang tính vận dụng, liên kết kiến thức.'
  },
  {
    code: 'B8_HC36',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Bài làm còn gạch xóa, tô đen nhiều chỗ, con cần hạn chế để bài thi giữ được sự sạch sẽ, khoa học.'
  },
  {
    code: 'B8HC37',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Đọc chưa kĩ đề, chưa xác định đúng yêu cầu.'
  },
  {
    code: 'B8HC38',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Chữ viết đôi chỗ còn nhanh và cẩu thả, con cần nắn nót và cẩn thận hơn để giám khảo dễ đọc bài.'
  },
  {
    code: 'B8HC39',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Thiếu kỹ năng quan sát hình, khả năng liên hệ kiến thức sinh lý chưa tốt, dẫn đến đưa ra phương án sai.'
  },
  {
    code: 'B8HC40',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Kiến thức về sinh lý tim mạch chưa vững dẫn đến không liên hệ được vào bài, diễn đạt lủng củng, không rõ ý.'
  },
  {
    code: 'B8HC41',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Cách lập luận hoặc giải thích một số ý còn chưa cặn kẽ, thiếu logic dẫn đến mất điểm nhỏ. Diễn đạt chưa thoát ý, đôi chỗ dùng sai thuật ngữ Sinh học.'
  },
  {
    code: 'B8HC42',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Sử dụng lạm dụng quá nhiều các từ viết tắt không đúng quy ước.'
  },
  {
    code: 'B8HC43',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Con có thói quen viết câu trả lời thành một đoạn văn dài nối tiếp nhau. Việc chưa biết cách gạch đầu dòng, tách bạch các ý lớn, ý nhỏ khiến lập luận bị rối và rất dễ bị giám khảo chấm sót điểm.'
  },
  {
    code: 'B8HC44',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Kĩ năng vẽ đồ thị của con còn chưa thành thạo nên chưa thể đạt điểm tối đa ở dạng câu này.'
  },
  {
    code: 'BHC45',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Khi làm bài, có phần con còn chưa tách các ý giải thích và kết luận riêng biệt.'
  },
  {
    code: 'HC46',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Con đọc đề chưa kĩ, dễ bỏ sót dữ kiện quan trọng hoặc nhầm lẫn yêu cầu câu hỏi, dẫn đến việc mất điểm rất đáng tiếc ở những phần con hoàn toàn có khả năng làm được.'
  },
  {
    code: 'HC47',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Chưa biết cách xây dựng đồ thị, sơ đồ...'
  },
  {
    code: 'HC48',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Còn nhầm lẫn các khái niệm như "Sức chứa môi trường" và "Nguồn sống"...'
  },
  {
    code: 'HC49',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Chưa biết cách phân tích biểu đồ mối tương quan giữa %G-C và nhiệt độ nóng chảy của DNA để trả lời câu hỏi đề bài.'
  },
  {
    code: 'HC50',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Con trình bày phần nhiều theo cảm tính, chưa theo thứ tự ý hỏi dẫn tới sai logic suy luận, mất điểm đáng tiếc.'
  },
  {
    code: 'HC51',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Khi làm bài, có phần con còn chưa tách ý mục đích và ý nghĩa riêng biệt.'
  },
  {
    code: 'HC52',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Khi viết sai cần gạch bỏ gọn gàng, tuyệt đối không sử dụng dùng bút xóa, giúp bài thi giữ được độ thẩm mỹ và đảm bảo đúng quy chế.'
  },
  {
    code: 'HC53',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Phân bổ thời gian làm bài chưa hợp lý. Việc tốn quá nhiều thời gian ở các câu trước khiến con phải làm vội ở những phần sau, dẫn đến nét chữ trở nên ẩu, khó đọc.'
  },
  {
    code: 'HC54',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Kĩ năng tính toán phần DNA của con chưa tốt, con còn nhầm lẫn các công thức cơ bản dẫn đến việc tính sai kết quả hoặc không nhớ công thức tính toán.'
  },
  {
    code: 'HC55',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Khi làm bài, con cần tách ý rõ ràng, không viết thành đoạn dài vì người chấm khó theo dõi, chấm sót điểm.'
  },
  {
    code: 'HC56',
    category: 'HC',
    categoryName: 'Hạn chế',
    content: 'Kĩ năng diễn đạt của con chưa thực sự cô đọng. Con còn mắc lỗi lặp lại một ý nhiều lần và viết khá lan man, dẫn đến việc bài làm tuy dài nhưng lại chưa chạm được đúng trọng tâm (từ khóa) mà đề bài yêu cầu.'
  },

  // --- BIỆN PHÁP KHẮC PHỤC (BP) ---
  {
    code: 'BP01',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Hệ thống hóa lại kiến thức bằng sơ đồ tư duy để nắm chắc mối liên hệ giữa các hệ cơ quan và cơ chế điều hòa.'
  },
  {
    code: 'BP02',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Rèn luyện kỹ năng đọc đề chậm, gạch chân từ khóa và xác định rõ yêu cầu trước khi bắt đầu đặt bút giải.'
  },
  {
    code: 'BP03',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Tập thói quen lập dàn ý nhanh ra nháp cho các câu hỏi tự luận để đảm bảo lập luận đi đúng trọng tâm và đủ ý.'
  },
  {
    code: 'BP04',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Tăng cường luyện tập các dạng bài tập chuyên sâu về phân tích đồ thị, sơ đồ và bảng số liệu định lượng.'
  },
  {
    code: 'BP05',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Sau khi hoàn thành bài, cần dành ít nhất 3-5 phút để soát lại toàn bộ nội dung, sửa lỗi diễn đạt và chính tả.'
  },
  {
    code: 'BP06',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Chủ động chép lại các câu làm sai vào vở riêng, tự giải lại và đối chiếu với đáp án chi tiết để ghi nhớ sâu hơn.'
  },
  {
    code: 'BP07',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Luyện giải đề trong điều kiện giới hạn thời gian (như thi thật) để hình thành phản xạ và kỹ năng kiểm soát thời gian.'
  },
  {
    code: 'BP08',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Chú ý học thuộc và sử dụng chuẩn xác các thuật ngữ sinh học chuyên ngành.'
  },
  {
    code: 'BP09',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Rèn luyện cách trình bày lời giải theo trình tự: Nguyên nhân → Cơ chế → Kết quả để tăng tính logic và thuyết phục.'
  },
  {
    code: 'BP10',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Tham khảo đáp án mẫu để học hỏi cách dùng từ, cách triển khai ý và phương pháp lập luận.'
  },
  {
    code: 'B7_BP11',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Hệ thống hoá, ôn tập bổ sung kiến thức về phần Hệ Sinh thái, Hệ Tuần hoàn, Hệ Sinh sản... để có thể làm bài tập về phần này trong bài kiểm tra và có thể vận dụng trả lời câu hỏi thực tiễn.'
  },
  {
    code: 'B7_BP12',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Cần cải thiện chữ viết, cách trình bày rõ ràng, mạch lạc.'
  },
  {
    code: 'B7_BP13',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Rèn cách trình bày lời giải thích bám sát vào dữ kiện đề bài, sử dụng dữ liệu phân tích được, đồng thời vận dụng lý thuyết đã học một cách logic, thuyết phục.'
  },
  {
    code: 'B7_BP14',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Cần cải thiện cách trình bày, hạn chế gạch xóa, chữ viết sạch đẹp, rõ ràng.'
  },
  {
    code: 'B7_BP15',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Dùng từ cho diễn đạt phải chuẩn xác kiến thức, hạn chế dùng văn nói. Làm bài đi thẳng vào trọng tâm, tránh dài dòng, lan man.'
  },
  {
    code: 'B7_BP16',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Cần trình bày rõ ràng hơn, hạn chế viết chữ quá gần nhau, tách bạch các ý và cẩn thận hơn trong quá trình làm bài.'
  },
  {
    code: 'B7_BP17',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Hệ thống hoá, ôn tập bổ sung kiến thức còn thiếu để có thể làm bài tập trong bài kiểm tra và có thể vận dụng trả lời câu hỏi thực tiễn.'
  },
  {
    code: 'B7_BP18',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Cần luyện tập nhiều để củng cố khả năng phản xạ với câu hỏi và khả năng xác định phương hướng trả lời, phân bổ hợp lý thời gian làm bài.'
  },
  {
    code: 'B7_BP19',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Hệ thống hóa và nắm chắc kiến thức đã học để có thể sử dụng nhuần nhuyễn kiến thức vào xác định phương hướng giải và làm bài tập.'
  },
  {
    code: 'B7_BP20',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Khi luyện tập, con nên đi từ việc nắm chắc kiến thức, trả lời các câu hỏi trực diện nhuần nhuyễn kết hợp với làm các bài tập vận dụng để rèn kỹ năng; sau đó mới luyện các dạng vận dụng cao.'
  },
  {
    code: 'B7_BP21',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Trình bày rõ ràng, mạch lạc và nên tách ý riêng biệt.'
  },
  {
    code: 'B7_BP22',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Trình bày không gạch xóa, luyện tập xác định các ý muốn diễn giải trong bài trước khi đặt bút làm.'
  },
  {
    code: 'B7_BP23',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Rèn kỹ năng trình bày, diễn giải đúng các thuật ngữ khoa học, bám sát nội dung lý thuyết và dữ liệu đề bài, liên kết chúng với nhau để đưa ra phương án trình bày mạch lạc, chặt chẽ nhất.'
  },
  {
    code: 'B7_BP24',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Luyện kỹ năng phân tích các dạng đồ thị, đọc và phản xạ nhanh với các dạng câu hỏi.'
  },
  {
    code: 'B8_BP25',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Học lại và nắm thật chắc phần kiến thức Sinh lý người và Sinh thái học để vận dụng vào làm bài tập.'
  },
  {
    code: 'B8_BP26',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Luyện tập các câu hỏi tính toán để nâng cao kĩ năng tính toán.'
  },
  {
    code: 'B8_BP27',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Rèn chữ viết rõ ràng, sạch đẹp, không được viết tắt trong bài thi.'
  },
  {
    code: 'B8_BP28',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Học lại và nắm thật chắc phần kiến thức còn nhầm lẫn khái niệm, thuật ngữ hoặc các phần kiến thức còn sai sót.'
  },
  {
    code: 'B8_BP29',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Chú ý ôn tập, hệ thống lại các phần kiến thức còn thiếu sót, nhầm lẫn hoặc chưa nắm vững.'
  },
  {
    code: 'B8BP30',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Luyện nhiều bài tập để nâng cao kĩ năng quan sát hình ảnh, bảng biểu, đồ thị, rèn khả năng liên hệ các kiến thức đã học với nhau để đưa ra phương án làm bài chính xác.'
  },
  {
    code: 'B8BP31',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Diễn đạt đúng trọng tâm, phân tích phải sát đề bài, kèm theo dữ liệu hay số liệu đã có để tăng tính chặt chẽ, logic của bài làm.'
  },
  {
    code: 'BP32',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Chú ý rèn chữ viết cẩn thận, trình bày sạch sẽ, khoa học, hạn chế gạch xoá.'
  },
  {
    code: 'BP33',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Con cần rèn cách lập luận logic hơn: luôn tách bạch rõ ràng giữa phần "Kết luận" và phần "Giải thích".'
  },
  {
    code: 'BP34',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Chú ý làm quen với các dạng câu hỏi liên quan đến vẽ, biểu diễn đồ thị để có thể làm các câu hỏi dạng bài tập này đạt điểm tối đa, tránh mất điểm.'
  },
  {
    code: 'BP35',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Tham khảo hướng dẫn chấm để hiểu cách xây dựng biểu đồ, từ đó luyện tập lại để áp dụng vào bài làm.'
  },
  {
    code: 'BP36',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Con cần chủ động hệ thống lại các mảng kiến thức còn nhầm lẫn hoặc chưa vững bằng sơ đồ tư duy để ghi nhớ lâu hơn.'
  },
  {
    code: 'BP37',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Con nên phác thảo nhanh các ý ra nháp trước khi viết vào bài để trình bày mạch lạc, hạn chế tối đa việc tẩy xoá, giữ bài thi sạch sẽ.'
  },
  {
    code: 'BP38',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Con cần rèn thói quen viết cẩn thận và nắn nót hơn. Hãy chủ động viết chậm lại một chút để nét chữ được rõ ràng, dễ đọc, đặc biệt là khi viết các thuật ngữ Sinh học.'
  },
  {
    code: 'BP39',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Con cần rèn cách lập luận logic hơn: luôn tách bạch rõ ràng giữa phần "Mục đích" và phần "Ý nghĩa".'
  },
  {
    code: 'BP40',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Con cần rèn thói quen cầm bút gạch chân các từ khóa quan trọng, các số liệu và đặc biệt là các từ phủ định (không, sai, ngoại trừ) ngay khi đọc đề.'
  },
  {
    code: 'BP41',
    category: 'BP',
    categoryName: 'Biện pháp',
    content: 'Con tuyệt đối không được để giấy trắng. Khi gặp một câu hỏi khó, hãy bắt đầu bằng việc tóm tắt các dữ kiện đề cho, viết ra công thức hoặc các định nghĩa sinh học liên quan.'
  }
];

// Helper to look up comments by code
export const COMMENT_MAP = new Map<string, CommentTemplate>();

// Initialize default comments into MAP
BIOLOGY_COMMENTS.forEach(item => {
  COMMENT_MAP.set(item.code.toUpperCase(), item);
});

// Memory store for session custom comments
const sessionCustomComments: CommentTemplate[] = [];

export function getAllComments(): CommentTemplate[] {
  if (sessionCustomComments.length === 0) {
    return BIOLOGY_COMMENTS;
  }
  const combined = [...BIOLOGY_COMMENTS];
  sessionCustomComments.forEach(p => {
    if (!combined.some(c => c.code.toUpperCase() === p.code.toUpperCase())) {
      combined.unshift(p);
    }
  });
  return combined;
}

export function saveNewCommentTemplate(template: CommentTemplate): void {
  const cleanCode = template.code.trim().toUpperCase();
  const normalized = { ...template, code: cleanCode };
  COMMENT_MAP.set(cleanCode, normalized);

  const idx = sessionCustomComments.findIndex(c => c.code.toUpperCase() === cleanCode);
  if (idx >= 0) {
    sessionCustomComments[idx] = normalized;
  } else {
    sessionCustomComments.unshift(normalized);
  }
}

export function getCommentByCode(code: string): string {
  const cleanCode = code.trim().toUpperCase();
  const found = COMMENT_MAP.get(cleanCode);
  return found ? found.content : code;
}

export function parseCommentCodes(codes: string[] | string): {
  kt: string[];
  ud: string[];
  hc: string[];
  bp: string[];
} {
  const codeList = Array.isArray(codes) ? codes : codes.split(/[,;\s]+/).filter(Boolean);
  const kt: string[] = [];
  const ud: string[] = [];
  const hc: string[] = [];
  const bp: string[] = [];

  for (const c of codeList) {
    const clean = c.trim().toUpperCase();
    const item = COMMENT_MAP.get(clean);
    if (!item) continue;
    if (item.category === 'KT') kt.push(item.content);
    else if (item.category === 'UD') ud.push(item.content);
    else if (item.category === 'HC') hc.push(item.content);
    else if (item.category === 'BP') bp.push(item.content);
  }

  return { kt, ud, hc, bp };
}

export function extractCommentCodes(codes: string[] | string): {
  ktCodes: string[];
  udCodes: string[];
  hcCodes: string[];
  bpCodes: string[];
} {
  const codeList = Array.isArray(codes) ? codes : codes.split(/[,;\s]+/).filter(Boolean);
  const ktCodes: string[] = [];
  const udCodes: string[] = [];
  const hcCodes: string[] = [];
  const bpCodes: string[] = [];

  for (const c of codeList) {
    const clean = c.trim().toUpperCase();
    const item = COMMENT_MAP.get(clean);
    if (!item) continue;
    if (item.category === 'KT') ktCodes.push(item.code);
    else if (item.category === 'UD') udCodes.push(item.code);
    else if (item.category === 'HC') hcCodes.push(item.code);
    else if (item.category === 'BP') bpCodes.push(item.code);
  }

  return { ktCodes, udCodes, hcCodes, bpCodes };
}

/**
 * Concatenates codes of the same category into a single fluid paragraph per block.
 * Requirements: Cho phép ghép nối các mã cùng khối thành cùng 1 đoạn văn.
 */
export function concatenateBlockComments(codes: string[] | string): {
  ktText: string;
  udText: string;
  hcText: string;
  bpText: string;
} {
  const parsed = parseCommentCodes(codes);
  return {
    ktText: parsed.kt.join(' ').trim(),
    udText: parsed.ud.join(' ').trim(),
    hcText: parsed.hc.join(' ').trim(),
    bpText: parsed.bp.join(' ').trim(),
  };
}
