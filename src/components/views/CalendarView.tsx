import React, { useState } from 'react';
import { mockCalendarEvents } from '../../data/mockCalendar';
import type { CalendarEvent } from '../../types';
import { Calendar as CalendarIcon, Clock, CheckCircle2, Plus, Sparkles, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CalendarView: React.FC = () => {
  const { triggerCelebration } = useApp();
  const [events, setEvents] = useState<CalendarEvent[]>(mockCalendarEvents);
  const [showAddForm, setShowAddForm] = useState(false);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');

  const toggleEventComplete = (id: string) => {
    setEvents(events.map(ev => ev.id === id ? { ...ev, completed: !ev.completed } : ev));
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title,
      date,
      time: time || '19:00',
      type: 'date',
      note,
      completed: false,
    };

    setEvents([...events, newEvent]);
    setShowAddForm(false);
    setTitle('');
    setDate('');
    setTime('');
    setNote('');
    triggerCelebration();
  };

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', marginBottom: '0.25rem' }}>
            <Sparkles size={16} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>SẮP XẾP LỊCH & HẸN HÒ</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Những Ngày Chúng Mình Sắp Gặp Nhau</h2>
        </div>

        <button onClick={() => setShowAddForm(true)} className="btn-primary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
          <Plus size={16} />
          <span>Lên Lịch Hẹn Mới</span>
        </button>
      </div>

      {/* Events List */}
      <div className="responsive-card-grid">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="glass-card"
            style={{
              opacity: ev.completed ? 0.6 : 1,
              borderLeft: ev.type === 'anniversary' ? '4px solid var(--primary-pink)' : '4px solid var(--accent-gold)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', fontSize: '0.85rem' }}>
                  <CalendarIcon size={16} />
                  <span>{ev.date}</span>
                  {ev.time && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)' }}>
                      • <Clock size={14} /> {ev.time}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => toggleEventComplete(ev.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: ev.completed ? '#4ade80' : 'var(--text-dim)',
                    transition: 'all 0.2s',
                  }}
                  title={ev.completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
                >
                  <CheckCircle2 size={20} />
                </button>
              </div>

              <h3 style={{ fontSize: '1.15rem', color: '#fff', textDecoration: ev.completed ? 'line-through' : 'none', marginBottom: '0.5rem' }}>
                {ev.title}
              </h3>

              {ev.note && (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {ev.note}
                </p>
              )}
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--accent-blush)' }}>
              <Heart size={13} fill="currentColor" />
              <span>{ev.type === 'anniversary' ? 'Ngày đặc biệt của tình yêu' : 'Kế hoạch hẹn hò'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      {showAddForm && (
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '1.25rem' }}>Thêm Buổi Hẹn Mới 💕</h3>
            <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  Tên buổi hẹn / Kế hoạch
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Đi ăn lẩu nướng cuối tuần..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                    Ngày hẹn
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
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
                    Giờ
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
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
                  Ghi chú cho buổi hẹn
                </label>
                <textarea
                  rows={3}
                  placeholder="Nhớ mang quà hoặc dặn nhau điều gì..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
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
                <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary" style={{ padding: '0.6rem 1.2rem' }}>
                  Hủy
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
                  Lên Lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
