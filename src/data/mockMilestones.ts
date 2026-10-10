import type { Milestone } from '../types';

export const mockMilestones: Milestone[] = [
  {
    id: '1',
    title: 'Chuyến Xe Định Mệnh: Bình Lục – Chợ Nề',
    date: '2025-04-29',
    location: 'Chuyến xe về Bình Lục – Chợ Nề',
    description: 'Lần đầu tiên mình và Xuân gặp nhau trên chuyến xe về Bình Lục – Chợ Nề. Khoảnh khắc tình cờ mở ra cả một trang đời ngọt ngào.',
    category: 'first-time',
    quote: 'Cuộc gặp gỡ tình cờ trên chuyến xe năm ấy đã thay đổi cả cuộc đời anh.',
    tags: ['Gặp gỡ', 'Chuyến xe định mệnh', 'Bình Lục – Chợ Nề']
  },
  {
    id: '2',
    title: 'Ngày Em Đồng Ý Yêu Nhau ❤️',
    date: '2025-05-24',
    location: 'Ngày bắt đầu của chúng mình',
    description: 'Ngày em ấy chính thức gật đầu đồng ý mối quan hệ yêu đương. Cột mốc thiêng liêng nhất đánh dấu hai trái tim hòa chung nhịp đập.',
    category: 'anniversary',
    quote: 'Từ ngày hôm nay, thế giới của anh có thêm một lý do để mỉm cười và cố gắng.',
    tags: ['Chính thức yêu', 'Cột mốc vàng']
  },
  {
    id: '3',
    title: 'Sinh Nhật & Nụ Hôn Đầu Tiên 💋',
    date: '2025-07-05',
    location: 'Ngày sinh nhật đáng nhớ',
    description: 'Ngày sinh nhật cùng nụ hôn đầu ngọt ngào. Em ấy luôn yêu thương mình, chiều chuộng và dành trọn những dịu dàng nhất cho mình.',
    category: 'special',
    quote: 'Em luôn yêu thương và chiều chuộng anh như thế, cảm ơn em vì tất cả.',
    tags: ['Sinh nhật', 'Nụ hôn đầu', 'Yêu thương']
  },
  {
    id: '4',
    title: 'Cùng Nhau Lập Page "Để Nghịch" 📱',
    date: '2025-07-28',
    location: 'Góc nhỏ kỷ niệm',
    description: 'Ngày hai đứa rủ nhau lập fanpage để nghịch, lưu lại những trò ngố ngộ và những mẩu chuyện vui vẻ của riêng hai đứa.',
    category: 'special',
    quote: 'Những điều ngốc nghếch làm cùng nhau luôn là những điều vui nhất.',
    tags: ['Lập page', 'Kỷ niệm dễ thương']
  },
  {
    id: '5',
    title: 'Trao Nhẫn Kỷ Niệm & Lời Hứa Mãi Mãi 💍',
    date: '2025-08-11',
    location: 'Khoảnh khắc trao nhẫn thiêng liêng',
    description: 'Trao nhẫn kỉ niệm cũng như gửi trao lời chúc bên nhau lâu dài... Mãi mãi không đổi thay.',
    category: 'anniversary',
    quote: 'Chiếc nhẫn trên tay và lời hứa bên nhau đi qua mọi thăng trầm cuộc đời... Mãi mãi.',
    tags: ['Trao nhẫn', 'Lời hứa mãi mãi', 'Gắn kết']
  },
  {
    id: '6',
    title: 'Mở Khóa Huy Hiệu Streak 3 Ngày Đầu Tiên 🔥',
    date: '2025-08-13',
    location: 'Story Người đặc biệt • @NguyenThahXua...',
    description: 'Chúng tôi đã mở khóa một Streak! Mốc 3 ngày trò chuyện liên tục đầu tiên, đánh dấu thói quen không thể thiếu việc nhắn tin cho nhau mỗi sớm mai thức dậy.',
    category: 'streak',
    streakDays: 3,
    streakBadgeColor: '#f59e0b',
    quote: 'Ngọn lửa nhỏ bé đầu tiên nhóm lên một hành trình kết nối vô tận.',
    tags: ['Mở khóa Streak', '3 ngày liên tục', 'Người đặc biệt']
  },
  {
    id: '7',
    title: 'Nâng Cấp Huy Hiệu Streak 30 Ngày Rực Rỡ 🔥',
    date: '2025-09-11',
    location: 'Story Người đặc biệt • @NguyenThahXua...',
    description: 'Chúng tôi đã nâng cấp huy hiệu Streak của mình! Cán mốc tròn 30 ngày trò chuyện liên tục, gửi tổng cộng 679 tin nhắn và tròn 31 ngày kết bạn ngọt ngào.',
    category: 'streak',
    streakDays: 30,
    streakSubtext: '679 tin nhắn đã gửi • 31 ngày kết bạn',
    streakBadgeColor: '#ef4444',
    quote: '679 tin nhắn yêu thương, từng câu chữ đều gói trọn sự quan tâm dành cho em.',
    tags: ['Streak 30 ngày', '679 tin nhắn', '31 ngày kết bạn']
  },
  {
    id: '8',
    title: 'Huy Hiệu Streak 100 Ngày — Ngọn Lửa Bền Bỉ 💖',
    date: '2025-11-26',
    location: 'Story Người đặc biệt • @NguyenThahXua...',
    description: 'Chúng tôi đã nâng cấp huy hiệu Streak của mình! Chạm mốc son 100 ngày trò chuyện liên tục không một ngày gián đoạn. Ngọn lửa chuyển sang sắc hồng nồng nàn.',
    category: 'streak',
    streakDays: 100,
    streakBadgeColor: '#ec4899',
    quote: '100 ngày bên nhau qua từng tin nhắn, càng trò chuyện lại càng yêu em nhiều hơn.',
    tags: ['Streak 100 ngày', 'Ngọn lửa hồng', '100 ngày bên nhau']
  },
  {
    id: '9',
    title: 'Huy Hiệu Streak 200 Ngày Siêu Cấp — Ngọn Lửa Tím Huyền Diệu 💜',
    date: '2026-03-10',
    location: 'Story Người đặc biệt • @spring',
    description: "We've upgraded our Streak badge @spring — Ongoing chat days: 200! Cán mốc 200 ngày trò chuyện liên tục, ngọn lửa tím tượng trưng cho sự gắn bó sắt son và bền chặt tuyệt đối.",
    category: 'streak',
    streakDays: 200,
    streakSubtext: 'Ongoing chat days: 200 • @spring',
    streakBadgeColor: '#a855f7',
    quote: '200 ngày trò chuyện liên tục, ngọn lửa tím vẫn luôn bùng cháy rực rỡ.',
    tags: ['Streak 200 ngày', 'Lửa tím', '@spring', 'Kỳ tích tình yêu']
  },
  {
    id: '10',
    title: 'Huy Hiệu Streak 300 Ngày Huyền Thoại — Đỉnh Cao Gắn Kết 🔮',
    date: '2026-06-07',
    location: 'Story iu spriing • @spriing',
    description: "We've upgraded our Streak badge @spriing — Ongoing chat days: 300! Cán mốc kỷ lục 300 ngày trò chuyện liên tục không một ngày gián đoạn! Ngọn lửa tím chuyển sắc rực rỡ minh chứng cho sự gắn bó sắt son và thấu hiểu vô bờ.",
    category: 'streak',
    streakDays: 300,
    streakSubtext: 'Ongoing chat days: 300 • @spriing',
    streakBadgeColor: '#c026d3',
    quote: '300 ngày kề vai sát cánh, ngọn lửa tình yêu của hai đứa mình ngày càng rực sáng hơn.',
    tags: ['Streak 300 ngày', 'Kỷ lục 300 ngày', '@spriing', 'iu spriing']
  }
];
