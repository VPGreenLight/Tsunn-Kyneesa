import React, { useState } from 'react';
import { mockMemories } from '../../data/mockMemories';
import type { MemoryItem } from '../../types';
import { Lock, Mail, Image as ImageIcon, Sparkles, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MemoryBoxView: React.FC = () => {
  const { triggerCelebration } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'letter' | 'photo' | 'capsule'>('all');
  const [selectedLetter, setSelectedLetter] = useState<MemoryItem | null>(null);

  const filteredMemories = mockMemories.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div
        className="glass-panel"
        style={{
          padding: '1.75rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-purple)', marginBottom: '0.25rem' }}>
            <Sparkles size={16} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>HÒM KỶ NIỆM & VIÊN NANG THỜI GIAN</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Nơi Lưu Giữ Những Bức Thư & Khoảnh Khắc</h2>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255,255,255,0.06)', padding: '0.3rem', borderRadius: '999px' }}>
          {[
            { id: 'all', label: 'Tất Cả' },
            { id: 'letter', label: 'Thư Tay' },
            { id: 'photo', label: 'Ảnh Chụp' },
            { id: 'capsule', label: 'Hòm Khóa 🔒' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              style={{
                border: 'none',
                padding: '0.4rem 0.9rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
                background: activeFilter === tab.id ? 'var(--accent-purple)' : 'transparent',
                color: activeFilter === tab.id ? '#ffffff' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Memory Grid */}
      <div className="responsive-card-grid">
        {filteredMemories.map((item) => (
          <div
            key={item.id}
            className="glass-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              cursor: item.isLocked ? 'not-allowed' : 'pointer',
            }}
            onClick={() => {
              if (item.type === 'letter' && !item.isLocked) {
                setSelectedLetter(item);
                triggerCelebration();
              }
            }}
          >
            {/* Top Indicator */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {item.type === 'letter' && <Mail size={18} color="var(--primary-pink)" />}
                {item.type === 'photo' && <ImageIcon size={18} color="var(--accent-cyan)" />}
                {item.type === 'capsule' && <Lock size={18} color="var(--accent-gold)" />}
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.date}</span>
              </div>

              {item.isLocked ? (
                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '999px', background: 'rgba(255, 209, 102, 0.2)', color: 'var(--accent-gold)' }}>
                  Mở vào {item.unlockDate}
                </span>
              ) : (
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-blush)' }}>
                  {item.author ? `Bởi ${item.author}` : ''}
                </span>
              )}
            </div>

            {/* Media Image Preview if photo */}
            {item.mediaUrl && (
              <div style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem' }}>
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                />
              </div>
            )}

            {/* Content Preview */}
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#ffffff' }}>{item.title}</h3>
              <p
                style={{
                  fontSize: '0.9rem',
                  color: item.isLocked ? 'var(--text-dim)' : 'var(--text-muted)',
                  lineHeight: 1.6,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  filter: item.isLocked ? 'blur(3px)' : 'none',
                  userSelect: item.isLocked ? 'none' : 'auto',
                }}
              >
                {item.content}
              </p>
            </div>

            {/* Bottom Action */}
            <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {item.isLocked ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--accent-gold)' }}>
                  <Lock size={15} />
                  <span>Viên nang đang được niêm phong an toàn</span>
                </div>
              ) : (
                <span style={{ fontSize: '0.85rem', color: 'var(--primary-pink)', fontWeight: 600 }}>
                  Nhấp để đọc thư đầy đủ ✨
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Letter Reading Modal */}
      {selectedLetter && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1.5rem',
          }}
          onClick={() => setSelectedLetter(null)}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '600px',
              width: '100%',
              padding: '2.5rem',
              position: 'relative',
              background: 'radial-gradient(ellipse at top, rgba(255, 94, 142, 0.15) 0%, rgba(18, 20, 36, 0.95) 70%)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedLetter(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                borderRadius: '50%',
                width: 32,
                height: 32,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ color: 'var(--accent-blush)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                {selectedLetter.date} • Gửi từ trái tim
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 700 }}>{selectedLetter.title}</h3>
            </div>

            <p
              className="font-romantic"
              style={{
                fontSize: '1.6rem',
                lineHeight: 1.6,
                color: 'var(--text-highlight)',
                whiteSpace: 'pre-wrap',
                margin: '1.5rem 0',
              }}
            >
              {selectedLetter.content}
            </p>

            <div style={{ textAlign: 'right', marginTop: '2rem' }}>
              <span className="font-romantic" style={{ fontSize: '1.5rem', color: 'var(--primary-pink)' }}>
                Thương em, {selectedLetter.author} ❤️
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
