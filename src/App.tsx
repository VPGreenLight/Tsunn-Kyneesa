import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Scene3D } from './components/3d/Scene3D';
import { Navbar } from './components/common/Navbar';
import { DashboardView } from './components/views/DashboardView';
import { TimelineView } from './components/views/TimelineView';
import { MemoryBoxView } from './components/views/MemoryBoxView';
import { CalendarView } from './components/views/CalendarView';
import { MapLocationView } from './components/views/MapLocationView';
import { ChatRoomView } from './components/views/ChatRoomView';
import { MovesetBar } from './components/common/MovesetBar';
import { Heart } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 3D Living Background */}
      <Scene3D interactive={true} />

      {/* Top Floating Glass Navbar */}
      <Navbar />

      {/* View Content Area */}
      <main className="main-content">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'timeline' && <TimelineView />}
        {activeTab === 'memory' && <MemoryBoxView />}
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'map' && <MapLocationView />}
        {activeTab === 'chat' && <ChatRoomView />}
      </main>

      {/* Floating Moveset Controller */}
      <MovesetBar />

      {/* Romantic Footer */}
      <footer
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '2rem 1rem',
          color: 'var(--text-dim)',
          fontSize: '0.85rem',
        }}
      >
        <p style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          Dành riêng cho <strong>Xuân (Tsunn)</strong> với tất cả sự nâng niu
          <Heart size={14} fill="var(--primary-pink)" color="var(--primary-pink)" />
          từ <strong>Kyneesa</strong>
        </p>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
