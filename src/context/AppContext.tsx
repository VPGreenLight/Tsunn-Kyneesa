import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import type { TabType } from '../types';
import confetti from 'canvas-confetti';

interface DetailedLoveTime {
  totalDays: number;
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
}

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  daysInLove: number;
  detailedTime: DetailedLoveTime;
  anniversaryDate: string;
  triggerCelebration: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  activeMoveset: string;
  setActiveMoveset: (moveset: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [activeMoveset, setActiveMoveset] = useState<string>('idle');
  const [clockOffset, setClockOffset] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Mốc chính thức đồng ý yêu nhau: 24/05/2025 tại Việt Nam (UTC+07:00)
  const anniversaryDate = '2025-05-24';
  // Số ngày đã trừ đi (tháng 6/2025: 30 ngày)
  const DEDUCTED_DAYS = 30;

  // Đồng bộ thời gian với máy chủ chuẩn quốc tế (NTP / HTTP Date Header)
  // để tránh việc điện thoại/máy tính người dùng bị sai lệch giờ
  useEffect(() => {
    fetch(window.location.href, { method: 'HEAD', cache: 'no-store' })
      .then((res) => {
        const serverDateStr = res.headers.get('date');
        if (serverDateStr) {
          const serverTime = new Date(serverDateStr).getTime();
          const clientTime = Date.now();
          const offset = serverTime - clientTime;
          // Nếu lệch trên 1 giây thì bù trừ tự động
          if (Math.abs(offset) > 1000) {
            setClockOffset(offset);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Cập nhật thời gian thực mỗi giây (đã bù trừ lệch giờ)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date(Date.now() + clockOffset));
    }, 1000);
    return () => clearInterval(timer);
  }, [clockOffset]);

  // Tính toán thời gian bên nhau chi tiết (đã trừ 30 ngày, cố định theo múi giờ Việt Nam)
  const detailedTime: DetailedLoveTime = useMemo(() => {
    // Mốc bắt đầu cố định tại 00:00:00 ngày 24/05/2025 (Giờ Việt Nam UTC+7)
    const startDate = new Date('2025-05-24T00:00:00+07:00');
    const now = currentTime;
    
    // Tính tổng mili-giây trôi qua trên toàn cầu (UTC epoch timestamp) trừ đi 30 ngày
    const diffMs = Math.max(0, now.getTime() - startDate.getTime() - (DEDUCTED_DAYS * 24 * 60 * 60 * 1000));
    
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    // Trích xuất các thành phần ngày/tháng/năm theo đúng múi giờ Việt Nam (Asia/Ho_Chi_Minh)
    // Đảm bảo dù người xem ở bất kỳ quốc gia nào cũng nhìn thấy đúng ngày và giờ Việt Nam
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });
    const parts = formatter.formatToParts(now);
    const getPart = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0', 10);

    const curYear = getPart('year');
    const curMonth = getPart('month') - 1; // 0-indexed (0 = Tháng 1, 4 = Tháng 5)
    const curDay = getPart('day');

    // Mốc bắt đầu tại Việt Nam: 24/05/2025
    let years = curYear - 2025;
    let months = curMonth - 4; // Tháng 5 là index 4
    let days = curDay - 24;

    if (days < 0) {
      months -= 1;
      const prevMonthDays = new Date(curYear, curMonth, 0).getDate();
      days += prevMonthDays;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Trừ đi 1 tháng (30 ngày tháng 6/2025)
    months -= 1;
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const remHours = totalHours % 24;
    const remMinutes = totalMinutes % 60;
    const remSeconds = totalSeconds % 60;

    return {
      totalDays,
      years: Math.max(0, years),
      months: Math.max(0, months),
      days: Math.max(0, days),
      hours: remHours,
      minutes: remMinutes,
      seconds: remSeconds,
      totalHours,
      totalMinutes,
      totalSeconds
    };
  }, [currentTime]);

  const daysInLove = detailedTime.totalDays;

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff5e8e', '#ff8ca3', '#ffd166', '#c084fc', '#ffffff']
    });

    const heartShape = confetti.shapeFromPath({
      path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
    });

    confetti({
      shapes: [heartShape],
      scalar: 2,
      particleCount: 25,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#ff5e8e', '#ff2a6d', '#ff7597']
    });
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        daysInLove,
        detailedTime,
        anniversaryDate,
        triggerCelebration,
        soundEnabled,
        toggleSound,
        activeMoveset,
        setActiveMoveset
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
