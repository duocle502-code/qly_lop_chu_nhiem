export const COLORS = {
    primary: "#1e3a5f",
    primaryLight: "#2e5090",
    accent: "#f59e0b",
    green: "#16a34a",
    greenLight: "#bbf7d0",
    yellow: "#eab308",
    yellowLight: "#fef9c3",
    orange: "#ea580c",
    orangeLight: "#fed7aa",
    red: "#dc2626",
    redLight: "#fecaca",
    bg: "#f8fafc",
    card: "#ffffff",
    border: "#e2e8f0",
    text: "#1e293b",
    textMuted: "#64748b",
};

export const DEFAULT_BEHAVIORS = [
    { code: "HV01", name: "Tham gia Phát biểu", def: "Giơ tay và trả lời câu hỏi của giáo viên", example: 'Em giơ tay cao, nói rõ ràng: "Thưa thầy, em nghĩ đáp án là B vì..."', stars: 1, unit: "lần" },
    { code: "HV02", name: "Giúp đỡ Bạn bè", def: "Chủ động hỗ trợ bạn học bài, giải thích kiến thức", example: "Em A giải thích bài toán cho em B trong giờ tự học", stars: 2, unit: "lần" },
    { code: "HV03", name: "Hoàn thành Đúng hạn", def: "Nộp bài tập, đồ án đúng hoặc trước deadline", example: "Nộp bài tập Toán trước 7h sáng thứ 2", stars: 1, unit: "bài" },
    { code: "HV04", name: "Giữ gìn Vệ sinh", def: "Nhặt rác, lau bảng, sắp xếp bàn ghế", example: "Em C nhặt giấy vụn dưới sàn sau giờ ra chơi", stars: 2, unit: "lần" },
    { code: "HV05", name: "Đến lớp Đúng giờ", def: "Có mặt trước 7h00, đồng phục gọn gàng", example: "Em D đến lớp lúc 6h55, áo sơ mi là phẳng", stars: 1, unit: "ngày" },
    { code: "HV06", name: "Tôn trọng Ý kiến", def: "Lắng nghe bạn nói hết, không ngắt lời", example: '"Em đồng ý với ý kiến của bạn E, và em muốn bổ sung thêm..."', stars: 2, unit: "lần" },
    { code: "HV07", name: "Sáng tạo Giải pháp", def: "Đưa ra ý tưởng mới trong hoạt động nhóm", example: "Em F đề xuất dùng Canva để làm poster thay vì vẽ tay", stars: 3, unit: "lần" },
    { code: "HV08", name: "Tự học Chủ động", def: "Tự tìm tài liệu, hỏi thêm GV ngoài giờ", example: "Em G hỏi thầy về bài toán Olympic sau giờ tan trường", stars: 3, unit: "lần" },
];

export const DEFAULT_REWARDS = [
    { code: "PT01", name: "Chọn chỗ ngồi 1 tuần", cost: 10, desc: "Được chọn vị trí ngồi yêu thích trong 1 tuần", quota: "Không giới hạn", deadline: "Đổi trước thứ 6" },
    { code: "PT02", name: "Miễn 1 bài tập về nhà", cost: 20, desc: "Miễn làm 1 bài tập bất kỳ (trừ kiểm tra)", quota: "5 suất/tháng", deadline: "Thông báo trước 1 ngày" },
    { code: "PT03", name: "Ăn trưa cùng GVCN", cost: 50, desc: "Ăn trưa và trò chuyện với thầy/cô", quota: "2 suất/tháng", deadline: "Đặt trước 3 ngày" },
    { code: "PT04", name: 'Thẻ "Ra khỏi lớp 5 phút"', cost: 30, desc: "Ra khỏi lớp 5 phút khi căng thẳng", quota: "10 suất/tháng", deadline: "Sử dụng ngay" },
    { code: "PT05", name: "Voucher nhà sách 50k", cost: 100, desc: "Phiếu mua sách tại Fahasa", quota: "3 suất/tháng", deadline: "Hết tháng hết hạn" },
    { code: "PT06", name: "Dẫn hoạt động lớp", cost: 80, desc: "Làm MC buổi sinh hoạt lớp", quota: "1 suất/tháng", deadline: "Đăng ký trước 1 tuần" },
];

export const DEFAULT_LEVELS = [
    { minStars: 0, name: "Người mới", emoji: "🌱", color: "#64748b" },
    { minStars: 51, name: "Chiến binh", emoji: "🛡️", color: "#16a34a" },
    { minStars: 101, name: "Anh hùng", emoji: "⚔️", color: "#2563eb" },
    { minStars: 151, name: "Huyền thoại", emoji: "👑", color: "#7c3aed" },
];

export const DEFAULT_TIERS = [
    { minAvg: 0, name: "Tầng 3", color: "#dc2626", bg: "#fef2f2", action: "Can thiệp cá nhân" },
    { minAvg: 2, name: "Tầng 2", color: "#ea580c", bg: "#fff7ed", action: "Can thiệp nhóm" },
    { minAvg: 4, name: "Tầng 1", color: "#16a34a", bg: "#dcfce7", action: "Khen thưởng" },
];

export const DEFAULT_STUDENTS = [
    "Lê Văn C", "Nguyễn Văn A", "Trần Minh D", "Phạm Thị E", "Hoàng Văn F",
    "Đỗ Thị G", "Vũ Văn H", "Bùi Thị I", "Ngô Văn K", "Đặng Thị L",
    "Lý Văn M", "Phan Thị N", "Đinh Văn O", "Hồ Thị P", "Trần Thị B",
    "Mai Văn Q", "Dương Thị R", "Tô Văn S", "Châu Thị T", "Lâm Văn U",
    "Cao Thị V", "Trịnh Văn W", "Từ Thị X", "Huỳnh Văn Y", "Võ Thị Z",
    "Nguyễn Minh AA", "Trần Văn AB", "Lê Thị AC", "Phạm Văn AD", "Hoàng Thị AE",
    "Đỗ Văn AF", "Vũ Thị AG", "Bùi Văn AH", "Ngô Thị AI", "Phạm Văn D",
    "Đặng Văn AK", "Lý Thị AL", "Phan Văn AM", "Đinh Thị AN", "Hồ Văn AO"
];
