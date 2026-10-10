export type TabType = 'dashboard' | 'timeline' | 'memory' | 'calendar' | 'map' | 'chat';

export interface Milestone {
  id: string;
  title: string;
  date: string;
  location?: string;
  description: string;
  category: 'anniversary' | 'travel' | 'first-time' | 'special' | 'streak';
  photos?: string[];
  quote?: string;
  tags?: string[];
  streakDays?: number;
  streakSubtext?: string;
  streakBadgeColor?: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  type: 'photo' | 'letter' | 'capsule' | 'audio';
  content: string;
  mediaUrl?: string;
  unlockDate?: string;
  isLocked?: boolean;
  author?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'date' | 'anniversary' | 'trip' | 'reminder';
  note?: string;
  completed?: boolean;
}

export interface MemoryLocation {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  visitDate: string;
  memoryDescription: string;
  category: 'food' | 'travel' | 'first_date' | 'special';
  photo?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tsunn';
  text: string;
  timestamp: string;
  emotion?: 'happy' | 'shy' | 'pout' | 'loving' | 'teasing';
}

export interface WebSocketChatMessage {
  id: string;
  senderId: 'kyneesa' | 'tsunn';
  senderName: string;
  text: string;
  timestamp: string;
  createdAt: number;
  seen?: boolean;
  reactions?: Record<string, string[]>;
}

