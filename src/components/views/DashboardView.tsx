import React from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, Sparkles, Calendar, MessageCircle, ArrowRight, Quote, Compass, Clock, Baby, Flame } from 'lucide-react';
import { mockMilestones } from '../../data/mockMilestones';
import { mockCalendarEvents } from '../../data/mockCalendar';

export const DashboardView: React.FC = () => {
  const { detailedTime, triggerCelebration, setActiveTab } = useApp();
  const latestMilestone = mockMilestones[mockMilestones.length - 1];
  const upcomingEvent = mockCalendarEvents[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '4rem' }}>
      {/* Editorial Romantic Sanctuary Header */}
      <section className="glass-panel dashboard-hero">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', color: 'var(--accent-gold)' }}>
          <Sparkles size={16} />
          <span style={{ fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Thời Gian Yêu Nhau (Từ 24/05/2025)
          </span>
          <Sparkles size={16} />
        </div>

        <h1 className="font-serif dashboard-title">
          Đã bên nhau{' '}
          <span
            style={{
              fontStyle: 'italic',
              fontFamily: 'var(--font-serif)',
              color: 'var(--accent-gold)',
              borderBottom: '1px solid rgba(243, 206, 122, 0.4)',
              paddingBottom: '2px',
            }}
          >
            {detailedTime.totalDays}
          </span>{' '}
          ngày ngọt ngào
        </h1>

        {/* Detailed Breakdown: Năm, Tháng, Ngày & Giờ/Phút/Giây */}
        <div className="dashboard-time-pill">
          <span>✨ <strong>{detailedTime.years} năm {detailedTime.months} tháng {detailedTime.days} ngày</strong></span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-highlight)' }}>
            <Clock size={15} color="var(--primary-rose)" />
            {detailedTime.hours} giờ {detailedTime.minutes} phút {detailedTime.seconds} giây
          </span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(Đã trừ 30 ngày tháng 6/2025)</span>
        </div>

        <p className="font-romantic dashboard-quote">
          "Em luôn yêu thương mình, chiều chuộng mình. Cảm ơn vì chúng mình đã tìm thấy nhau."
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={triggerCelebration} className="btn-primary">
            <Heart size={17} fill="#ffffff" />
            <span>Thả Tim Lung Linh</span>
          </button>
          <button onClick={() => setActiveTab('chat')} className="btn-secondary">
            <MessageCircle size={17} color="var(--primary-rose)" />
            <span>Tâm Sự Với Xuân</span>
          </button>
        </div>
      </section>

      {/* Asymmetric Intimate Grid */}
      <div className="dashboard-grid">
        
        {/* Left Column: Ước mơ đặt tên con & Cột mốc gần nhất */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', minWidth: 0 }}>
          
          {/* Card Ước Mơ Đặt Tên Con (Thiên Thần Nhỏ Của Hai Đứa) */}
          <div
            className="glass-panel"
            style={{
              padding: 'clamp(1.25rem, 3vw, 2.25rem)',
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(226, 115, 138, 0.1) 0%, rgba(243, 206, 122, 0.08) 100%)',
              border: '1px solid rgba(243, 206, 122, 0.25)',
              width: '100%',
              minWidth: 0,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent-gold)' }}>
                <Baby size={20} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Ước Mơ Cho Mai Này
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary-rose-soft)' }}>Tương lai của chúng mình ❤️</span>
            </div>

            <h3 className="font-serif" style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '0.75rem', fontWeight: 500 }}>
              Tên Cho Những Thiên Thần Nhỏ
            </h3>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Những cái tên đong đầy ước vọng và tình yêu mà hai đứa mình ấp ủ cho ngày mai chung một mái nhà:
            </p>

            <div className="baby-names-grid">
              {/* Con Gái */}
              <div
                style={{
                  padding: '1.2rem',
                  borderRadius: '16px',
                  background: 'rgba(226, 115, 138, 0.12)',
                  border: '1px solid rgba(226, 115, 138, 0.3)',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--primary-rose-soft)', marginBottom: '0.3rem', fontWeight: 600 }}>
                  👧 CON GÁI YÊU
                </div>
                <div style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700, letterSpacing: '0.02em' }}>
                  Nguyễn Ngọc Như Nguyệt
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontStyle: 'italic' }}>
                  Thanh khiết, dịu dàng và tỏa sáng như ánh trăng tròn
                </div>
              </div>

              {/* Con Trai */}
              <div
                style={{
                  padding: '1.2rem',
                  borderRadius: '16px',
                  background: 'rgba(243, 206, 122, 0.12)',
                  border: '1px solid rgba(243, 206, 122, 0.3)',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginBottom: '0.3rem', fontWeight: 600 }}>
                  👦 CON TRAI YÊU
                </div>
                <div style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700, letterSpacing: '0.02em' }}>
                  Nguyễn Bình Minh
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontStyle: 'italic' }}>
                  Rạng rỡ, kiên định và ấm áp như ánh rạng đông
                </div>
              </div>
            </div>
          </div>

          {/* Card Chuỗi Giữ Lửa Streak: 3 -> 30 -> 100 -> 200 -> 300 ngày */}
          <div
            className="glass-panel"
            style={{
              padding: 'clamp(1.25rem, 3vw, 2rem)',
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              cursor: 'pointer',
              width: '100%',
              minWidth: 0,
            }}
            onClick={() => setActiveTab('timeline')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#f59e0b' }}>
                <Flame size={20} fill="#f59e0b" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Hành Trình Giữ Lửa Streak
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#c084fc' }}>@NguyenThahXuan • @spring • @spriing</span>
            </div>

            <h3 className="font-serif" style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem', fontWeight: 500 }}>
              Chuỗi Ngày Trò Chuyện Bất Tận 🔥
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Mỗi tin nhắn gửi đi là một que diêm giữ cho ngọn lửa tình cảm luôn bùng cháy rực rỡ:
            </p>

            {/* 5 Badges Grid */}
            <div className="streak-badges-grid">
              {[
                { days: 3, date: '13/08/2025', color: '#f59e0b', sub: 'Mở khóa' },
                { days: 30, date: '11/09/2025', color: '#ef4444', sub: '679 sms' },
                { days: 100, date: '26/11/2025', color: '#ec4899', sub: 'Lửa hồng' },
                { days: 200, date: '10/03/2026', color: '#a855f7', sub: 'Lửa tím' },
                { days: 300, date: '07/06/2026', color: '#c026d3', sub: 'Đỉnh cao' },
              ].map((badge) => (
                <div
                  key={badge.days}
                  style={{
                    padding: '0.85rem 0.4rem',
                    borderRadius: '14px',
                    background: `${badge.color}15`,
                    border: `1px solid ${badge.color}45`,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.3rem',
                    transition: 'transform 0.2s',
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${badge.color}40, transparent)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Flame size={18} fill={badge.color} color={badge.color} />
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                    {badge.days}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: badge.color, fontWeight: 600 }}>
                    {badge.sub}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    {badge.date}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 500 }}>
              <span>Xem chi tiết dòng thời gian Streak</span>
              <ArrowRight size={15} />
            </div>
          </div>

          {/* Cột mốc gần nhất: Trao nhẫn 11/08/2025 */}
          <div
            className="glass-card"
            style={{ cursor: 'pointer', padding: 'clamp(1.25rem, 3vw, 1.75rem)', width: '100%', minWidth: 0 }}
            onClick={() => setActiveTab('timeline')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Kỷ Niệm Đáng Nhớ Nhất
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{latestMilestone.date}</span>
            </div>

            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.4rem', fontWeight: 600 }}>
              {latestMilestone.title}
            </h3>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {latestMilestone.description}
            </p>

            {latestMilestone.quote && (
              <div
                style={{
                  marginTop: '0.75rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Quote size={14} color="var(--primary-rose)" />
                <span className="font-romantic" style={{ fontSize: '1.15rem', color: 'var(--text-highlight)' }}>
                  "{latestMilestone.quote}"
                </span>
              </div>
            )}

            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-rose)', fontSize: '0.85rem', fontWeight: 500 }}>
              <span>Xem toàn bộ dòng thời gian</span>
              <ArrowRight size={15} />
            </div>
          </div>
        </div>

        {/* Right Column: Tsunn AI & Lịch Kỷ Niệm */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', minWidth: 0 }}>
          
          {/* Tsunn AI Companion Card */}
          <div
            className="glass-panel"
            style={{
              padding: 'clamp(1.25rem, 3vw, 2rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              background: 'linear-gradient(135deg, rgba(243, 206, 122, 0.06) 0%, rgba(17, 13, 25, 0.6) 100%)',
              width: '100%',
              minWidth: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e2738a, #f3ce7a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#fff',
                  boxShadow: '0 4px 16px rgba(226, 115, 138, 0.4)',
                }}
              >
                X
              </div>
              <div>
                <h4 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 600 }}>Xuân (Tsunn) ❤️</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#4ade80' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80' }} />
                  <span>Luôn yêu thương & chiều chuộng anh</span>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '1rem 1.25rem',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--glass-border)',
                fontSize: '0.92rem',
                lineHeight: 1.5,
                color: 'var(--text-highlight)',
                fontStyle: 'italic',
              }}
            >
              "Anh ơi, em vẫn luôn nhớ chuyến xe về Bình Lục – Chợ Nề ngày ấy... Cảm ơn anh vì đã trao cho em chiếc nhẫn và lời hứa bên nhau mãi mãi nhé ❤️"
            </div>

            <button
              onClick={() => setActiveTab('chat')}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.7rem 1.2rem', fontSize: '0.9rem' }}
            >
              <MessageCircle size={16} />
              <span>Nhắn Tin Với Xuân</span>
            </button>
          </div>

          {/* Upcoming Anniversary Card */}
          {upcomingEvent && (
            <div
              className="glass-card"
              style={{ cursor: 'pointer', padding: '1.75rem' }}
              onClick={() => setActiveTab('calendar')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', marginBottom: '0.75rem' }}>
                <Calendar size={16} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Ngày Kỷ Niệm Sắp Tới
                </span>
              </div>

              <h4 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.35rem', fontWeight: 600 }}>
                {upcomingEvent.title}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {upcomingEvent.date}
              </p>
              {upcomingEvent.note && (
                <p style={{ fontSize: '0.85rem', color: 'var(--accent-gold-soft)', marginTop: '0.5rem' }}>
                  💡 {upcomingEvent.note}
                </p>
              )}
            </div>
          )}

          {/* Footprints Quick Link */}
          <div
            className="glass-card"
            style={{ cursor: 'pointer', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            onClick={() => setActiveTab('map')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(243, 206, 122, 0.1)', color: 'var(--accent-gold)' }}>
                <Compass size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', color: '#fff' }}>Bình Lục – Chợ Nề & Những Dấu Chân</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nơi tình yêu bắt đầu</p>
              </div>
            </div>
            <ArrowRight size={16} color="var(--accent-gold)" />
          </div>

        </div>
      </div>
    </div>
  );
};
