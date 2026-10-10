import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Heart, Smile, Footprints } from 'lucide-react';

export const MovesetBar: React.FC = () => {
  const { activeMoveset, setActiveMoveset, triggerCelebration } = useApp();

  const moves = [
    { id: 'idle', label: 'Dịu Dàng', icon: <Heart size={14} /> },
    { id: 'happy', label: 'Vui Mừng', icon: <Smile size={14} /> },
    { id: 'walk', label: 'Dạo Bước', icon: <Footprints size={14} /> },
    { id: 'jump_run', label: 'Nhảy Múa', icon: <Sparkles size={14} /> },
  ];

  return (
    <div className="moveset-container">
      <span className="moveset-label" style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 600, padding: '0 0.35rem', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
        CỬ CHỈ 3D:
      </span>

      {moves.map((move) => {
        const isActive = activeMoveset === move.id;
        return (
          <button
            key={move.id}
            onClick={() => {
              setActiveMoveset(move.id);
              if (move.id === 'happy' || move.id === 'jump_run') {
                triggerCelebration();
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '999px',
              border: isActive ? '1px solid rgba(243, 206, 122, 0.5)' : '1px solid transparent',
              background: isActive
                ? 'linear-gradient(135deg, rgba(226, 115, 138, 0.4), rgba(243, 206, 122, 0.3))'
                : 'rgba(255, 255, 255, 0.05)',
              color: isActive ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: isActive ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            title={`Chuyển chuyển động sang: ${move.label}`}
          >
            <span style={{ color: isActive ? 'var(--accent-gold)' : 'var(--primary-rose)' }}>
              {move.icon}
            </span>
            <span>{move.label}</span>
          </button>
        );
      })}
    </div>
  );
};
