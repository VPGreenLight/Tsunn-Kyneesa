import React from 'react';
import { useApp } from '../../context/AppContext';
import type { TabType } from '../../types';
import {
  Heart,
  Clock,
  BookHeart,
  Calendar,
  MapPin,
  MessageCircle,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, triggerCelebration, daysInLove } = useApp();

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Trang Chủ', icon: <Heart size={16} /> },
    { id: 'timeline', label: 'Dòng Thời Gian', icon: <Clock size={16} /> },
    { id: 'memory', label: 'Hòm Kỷ Niệm', icon: <BookHeart size={16} /> },
    { id: 'calendar', label: 'Lịch Hẹn Hò', icon: <Calendar size={16} /> },
    { id: 'map', label: 'Dấu Chân', icon: <MapPin size={16} /> },
    { id: 'chat', label: 'Tsunn AI', icon: <MessageCircle size={16} /> },
  ];

  return (
    <header className="nav-header">
      <div className="glass-panel nav-box">
        {/* Top Row for mobile (Brand + Action Button), dissolved on desktop */}
        <div className="nav-top-row">
          {/* Brand & Days Badge */}
          <div
            className="nav-brand"
            onClick={() => setActiveTab('dashboard')}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary-rose), var(--accent-gold))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(226, 115, 138, 0.4)',
                flexShrink: 0,
              }}
            >
              <Heart size={18} fill="#ffffff" color="#ffffff" className="animate-heart-pulse" />
            </div>
            <div>
              <div className="font-serif" style={{ fontWeight: 600, fontSize: '1.05rem', letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
                Tsunn <span style={{ color: 'var(--primary-rose)' }}>&</span> Kyneesa
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', whiteSpace: 'nowrap' }}>
                {daysInLove} ngày đong đầy yêu thương ✨
              </div>
            </div>
          </div>

          {/* Celebration Button */}
          <button
            onClick={triggerCelebration}
            className="btn-primary nav-action"
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.8rem',
              flexShrink: 0,
            }}
            title="Bắn pháo hoa & trái tim kỷ niệm"
          >
            <Sparkles size={14} />
            <span>Gửi Tim</span>
          </button>
        </div>

        {/* Navigation Dock */}
        <nav className="nav-dock">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '999px',
                  border: isActive ? '1px solid rgba(243, 206, 122, 0.4)' : '1px solid transparent',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(226, 115, 138, 0.35) 0%, rgba(243, 206, 122, 0.2) 100%)'
                    : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ color: isActive ? 'var(--accent-gold)' : 'var(--primary-rose)' }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
