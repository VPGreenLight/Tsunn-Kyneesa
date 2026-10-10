import React, { useState } from 'react';
import { mockMilestones } from '../../data/mockMilestones';
import type { Milestone } from '../../types';
import { Heart, MapPin, Calendar, Plus, Sparkles, Quote, Flame } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TimelineView: React.FC = () => {
  const { triggerCelebration } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [milestones, setMilestones] = useState<Milestone[]>(mockMilestones);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form state for adding new milestone
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const filteredMilestones = milestones.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate) return;

    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title: newTitle,
      date: newDate,
      location: newLocation || 'Góc Kỷ Niệm',
      description: newDesc || 'Một khoảnh khắc tuyệt vời nữa được ghi lại.',
      category: 'special',
      quote: 'Những điều giản dị tạo nên hạnh phúc dài lâu.'
    };

    setMilestones([newMilestone, ...milestones]);
    setShowAddModal(false);
    setNewTitle('');
    setNewDate('');
    setNewLocation('');
    setNewDesc('');
    triggerCelebration();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
      {/* Header & Actions */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-pink)', marginBottom: '0.25rem' }}>
            <Sparkles size={16} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>DÒNG THỜI GIAN TÌNH YÊU</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Từng Bước Chúng Mình Cùng Đi</h2>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', width: '100%', justifyContent: 'space-between' }}>
          {/* Category Filter Pills */}
          <div
            style={{
              display: 'flex',
              gap: '0.35rem',
              background: 'rgba(255,255,255,0.06)',
              padding: '0.3rem',
              borderRadius: '999px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              scrollbarWidth: 'none',
            }}
          >
            {[
              { id: 'all', label: 'Tất Cả' },
              { id: 'streak', label: 'Huy Hiệu Streak 🔥' },
              { id: 'anniversary', label: 'Kỷ Niệm' },
              { id: 'first-time', label: 'Lần Đầu' },
              { id: 'special', label: 'Đặc Biệt' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                style={{
                  border: 'none',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  background: filter === tab.id ? 'var(--primary-pink)' : 'transparent',
                  color: filter === tab.id ? '#ffffff' : 'var(--text-muted)',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button onClick={() => setShowAddModal(true)} className="btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', flexShrink: 0 }}>
            <Plus size={15} />
            <span>Thêm Mốc</span>
          </button>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="timeline-track-wrap">
        {/* Central glowing vertical track */}
        <div
          style={{
            position: 'absolute',
            left: '23px',
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'linear-gradient(to bottom, var(--primary-pink), var(--accent-purple), rgba(255,255,255,0.1))',
            borderRadius: '999px',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {filteredMilestones.map((item) => {
            const isStreak = item.category === 'streak';
            const badgeColor = item.streakBadgeColor || '#f59e0b';

            return (
              <div key={item.id} style={{ position: 'relative', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                {/* Timeline Node Badge */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-32px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--bg-deep)',
                    border: `2px solid ${isStreak ? badgeColor : 'var(--primary-pink)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isStreak ? badgeColor : 'var(--primary-pink)',
                    boxShadow: isStreak ? `0 0 14px ${badgeColor}66` : '0 0 12px var(--primary-pink-glow)',
                    zIndex: 2,
                  }}
                >
                  {isStreak ? <Flame size={16} fill={badgeColor} color={badgeColor} /> : <Heart size={14} fill="var(--primary-pink)" />}
                </div>

                {/* Milestone Content Card */}
                <div
                  className="glass-card"
                  style={{
                    flex: 1,
                    padding: '1.5rem',
                    border: isStreak ? `1px solid ${badgeColor}40` : undefined,
                    background: isStreak ? `linear-gradient(135deg, ${badgeColor}12 0%, rgba(255,255,255,0.03) 100%)` : undefined,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        {isStreak && (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '999px',
                              background: `${badgeColor}25`,
                              border: `1px solid ${badgeColor}60`,
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: badgeColor,
                            }}
                          >
                            <Flame size={12} fill={badgeColor} />
                            STREAK {item.streakDays} NGÀY
                          </span>
                        )}
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#ffffff' }}>
                          {item.title}
                        </h3>
                      </div>

                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Calendar size={14} color="var(--accent-gold)" />
                          {item.date}
                        </span>
                        {item.location && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <MapPin size={14} color="var(--accent-cyan)" />
                            {item.location}
                          </span>
                        )}
                      </div>
                    </div>

                    {item.tags && (
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        {item.tags.map((tag, i) => (
                          <span key={i} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', color: 'var(--text-highlight)' }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Special Streak Visual Callout */}
                  {isStreak && item.streakDays && (
                    <div
                      style={{
                        margin: '1rem 0',
                        padding: '1.25rem 1.5rem',
                        borderRadius: '16px',
                        background: 'rgba(0, 0, 0, 0.35)',
                        border: `1px solid ${badgeColor}35`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            background: `radial-gradient(circle, ${badgeColor}40 0%, ${badgeColor}10 70%)`,
                            border: `2px solid ${badgeColor}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 0 20px ${badgeColor}50`,
                          }}
                        >
                          <Flame size={32} fill={badgeColor} color="#fff" />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Số ngày trò chuyện liên tục
                          </div>
                          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', lineHeight: 1.1, fontFamily: 'var(--font-serif)' }}>
                            {item.streakDays} <span style={{ fontSize: '1.1rem', fontWeight: 400, color: badgeColor }}>ngày</span>
                          </div>
                        </div>
                      </div>

                      {item.streakSubtext && (
                        <div
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            fontSize: '0.85rem',
                            color: 'var(--text-highlight)',
                            fontWeight: 500,
                          }}
                        >
                          ✨ {item.streakSubtext}
                        </div>
                      )}
                    </div>
                  )}

                  <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: item.quote ? '1rem' : 0 }}>
                    {item.description}
                  </p>

                  {item.quote && (
                    <div
                      style={{
                        marginTop: '1rem',
                        padding: '0.75rem 1.25rem',
                        background: isStreak ? `${badgeColor}15` : 'rgba(255, 94, 142, 0.08)',
                        borderLeft: `3px solid ${isStreak ? badgeColor : 'var(--primary-pink)'}`,
                        borderRadius: '0 12px 12px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                      }}
                    >
                      <Quote size={18} color={isStreak ? badgeColor : 'var(--accent-blush)'} />
                      <span className="font-romantic" style={{ fontSize: '1.25rem', color: 'var(--text-highlight)' }}>
                        "{item.quote}"
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Add Milestone */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
        >
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Ghi Thêm Mốc Kỷ Niệm Mới ✨</h3>
            <form onSubmit={handleAddMilestone} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  Tiêu đề cột mốc
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lần đầu cùng nhau ngắm sao..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid var(--glass-border)',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                    Ngày diễn ra
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid var(--glass-border)',
                      background: 'rgba(255,255,255,0.08)',
                      color: '#fff',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                    Địa điểm (tùy chọn)
                  </label>
                  <input
                    type="text"
                    placeholder="Quán cafe, công viên..."
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid var(--glass-border)',
                      background: 'rgba(255,255,255,0.08)',
                      color: '#fff',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  Câu chuyện kỷ niệm
                </label>
                <textarea
                  rows={3}
                  placeholder="Kể lại cảm xúc của ngày hôm ấy..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid var(--glass-border)',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary" style={{ padding: '0.6rem 1.2rem' }}>
                  Hủy
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
                  Lưu Kỷ Niệm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
