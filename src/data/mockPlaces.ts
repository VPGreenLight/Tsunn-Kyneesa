import type { MemoryLocation } from '../types';

export const mockPlaces: MemoryLocation[] = [
  {
    id: 'p1',
    name: 'Chuyến Xe Bình Lục – Chợ Nề',
    address: 'Tuyến xe về Bình Lục – Chợ Nề, Hà Nam',
    coordinates: { lat: 20.4851, lng: 105.9926 },
    visitDate: '2025-04-29',
    category: 'first_date',
    memoryDescription: 'Lần đầu tiên mình và Xuân gặp nhau trên chuyến xe về Bình Lục – Chợ Nề. Khoảnh khắc tình cờ đã se duyên cho hai đứa bước vào cuộc đời nhau.',
    photo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'p2',
    name: 'Nơi Trao Nhẫn Kỷ Niệm 💍',
    address: 'Góc kỷ niệm thiêng liêng của hai đứa',
    coordinates: { lat: 21.0285, lng: 105.8542 },
    visitDate: '2025-08-11',
    category: 'special',
    memoryDescription: 'Trao nhẫn kỉ niệm cũng như lời chúc bên nhau lâu dài ... Mãi mãi. Một dấu mốc khắc cốt ghi tâm.',
    photo: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'p3',
    name: 'Bữa Tiệc Sinh Nhật & Nụ Hôn Đầu Tiên 🎂💋',
    address: 'Không gian sinh nhật ngọt ngào',
    coordinates: { lat: 21.0583, lng: 105.8234 },
    visitDate: '2025-07-05',
    category: 'special',
    memoryDescription: 'Ngày sinh nhật cùng nụ hôn đầu tiên đáng nhớ. Em ấy luôn yêu thương mình, chiều chuộng mình hết mực.',
    photo: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'p4',
    name: 'Góc Nhỏ Lập Page "Để Nghịch" 📱',
    address: 'Góc trò chuyện thân thuộc của hai đứa',
    coordinates: { lat: 21.0125, lng: 105.8412 },
    visitDate: '2025-07-28',
    category: 'food',
    memoryDescription: 'Ngày hai đứa cùng nhau lập page để nghịch ngợm, cùng cười và lưu lại từng khoảnh khắc đáng yêu.',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
  }
];
