import React, { useState } from 'react';
import { mockPlaces } from '../../data/mockPlaces';
import type { MemoryLocation } from '../../types';
import { MapPin, Navigation, BatteryCharging, Sparkles, Compass, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MapLocationView: React.FC = () => {
  const { triggerCelebration } = useApp();
  const [places] = useState<MemoryLocation[]>(mockPlaces);
  const [selectedPlace, setSelectedPlace] = useState<MemoryLocation>(mockPlaces[0]);

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', marginBottom: '0.25rem' }}>
            <Sparkles size={16} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ĐỊNH VỊ & DẤU CHÂN KỶ NIỆM</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Khoảng Cách Không Xa Khi Tim Luôn Gần</h2>
        </div>

        <button onClick={triggerCelebration} className="btn-primary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
          <Navigation size={16} />
          <span>Gửi Tín Hiệu Yêu Thương</span>
        </button>
      </div>

      {/* Real-time Location Sharing Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Kyneesa's Status Card */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', borderLeft: '4px solid var(--accent-cyan)' }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: 700,
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)',
            }}
          >
            K
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: '1.1rem', color: '#fff' }}>Kyneesa</h4>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#4ade80' }}>
                <BatteryCharging size={14} /> 85%
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginTop: '0.25rem' }}>
              ● Đang ở phòng làm việc
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Cập nhật 2 phút trước • Hà Nội
            </p>
          </div>
        </div>

        {/* Tsunn's Status Card */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', borderLeft: '4px solid var(--primary-pink)' }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff5e8e, #ff8ca3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: 700,
              boxShadow: '0 0 15px rgba(255, 94, 142, 0.4)',
            }}
          >
            X
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: '1.1rem', color: '#fff' }}>Xuân (Tsunn) ❤️</h4>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#4ade80' }}>
                <BatteryCharging size={14} /> 92%
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--primary-pink)', marginTop: '0.25rem' }}>
              ● Đang ở nhà ngoan ngoãn
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Cách anh ~3.5 km • Đang online
            </p>
          </div>
        </div>
      </div>

      {/* Map & Footprints Section */}
      <div className="map-layout-grid">
        {/* Places List */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Compass size={18} color="var(--accent-cyan)" />
            <span>Địa Điểm Đã Từng Qua</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {places.map((place) => (
              <div
                key={place.id}
                onClick={() => setSelectedPlace(place)}
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  background: selectedPlace.id === place.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.04)',
                  border: selectedPlace.id === place.id ? '1px solid var(--accent-cyan)' : '1px solid var(--glass-border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '1rem', color: '#fff' }}>{place.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>{place.visitDate}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {place.address}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Place Visual Spotlight */}
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {selectedPlace.photo && (
            <div style={{ width: '100%', height: '240px', borderRadius: '16px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <img
                src={selectedPlace.photo}
                alt={selectedPlace.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>
              <MapPin size={16} />
              <span>{selectedPlace.address} • Tọa độ [{selectedPlace.coordinates.lat}, {selectedPlace.coordinates.lng}]</span>
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0.5rem 0' }}>{selectedPlace.name}</h3>
            <p style={{ fontSize: '1rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
              {selectedPlace.memoryDescription}
            </p>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-pink)' }}>
            <Heart size={16} fill="currentColor" />
            <span className="font-romantic" style={{ fontSize: '1.3rem' }}>
              Một dấu chân đong đầy hạnh phúc của hai đứa
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
