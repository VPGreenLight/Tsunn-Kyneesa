import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ChatMessage, WebSocketChatMessage } from '../../types';
import {
  Send,
  Heart,
  Sparkles,
  Smile,
  Radio,
  CheckCheck,
  MessageCircle,
  Bot,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

type ChatMode = 'messenger' | 'ai';
type UserRole = 'kyneesa' | 'tsunn';

const REACTION_EMOJIS = ['❤️', '🥰', '😆', '😮', '😢', '🔥', '👍'];

export const ChatRoomView: React.FC = () => {
  const { triggerCelebration } = useApp();

  // Mode: Messenger (WebSocket) hoặc Tsunn AI
  const [activeMode, setActiveMode] = useState<ChatMode>('messenger');

  // Role hiện tại trong phòng Messenger: Kyneesa hoặc Xuân
  const [myRole, setMyRole] = useState<UserRole>(() => {
    return (localStorage.getItem('tsunn_messenger_role') as UserRole) || 'kyneesa';
  });

  // ==========================================
  // WEBSOCKET MESSENGER STATE
  // ==========================================
  const [wsMessages, setWsMessages] = useState<WebSocketChatMessage[]>([]);
  const [wsInput, setWsInput] = useState('');
  const [wsConnected, setWsConnected] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState<{ isTyping: boolean; name: string } | null>(null);
  const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);
  const [onlineCount, setOnlineCount] = useState<number>(1);

  const wsRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wsEndRef = useRef<HTMLDivElement>(null);

  const myName = myRole === 'kyneesa' ? 'Kyneesa 💙' : 'Xuân (Tsunn) 🌸';
  const partnerRole: UserRole = myRole === 'kyneesa' ? 'tsunn' : 'kyneesa';
  const partnerName = partnerRole === 'kyneesa' ? 'Kyneesa' : 'Xuân';

  // Lưu role vào localStorage
  const handleSwitchRole = (newRole: UserRole) => {
    setMyRole(newRole);
    localStorage.setItem('tsunn_messenger_role', newRole);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'join',
          user: { id: newRole, name: newRole === 'kyneesa' ? 'Kyneesa' : 'Xuân (Tsunn)' }
        })
      );
    }
  };

  // Cuộn xuống tin nhắn mới nhất
  const scrollToWsBottom = (smooth = true) => {
    wsEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  // Kết nối WebSocket
  const connectWebSocket = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsConnected(true);
        // Gửi thông tin user khi tham gia
        ws.send(
          JSON.stringify({
            type: 'join',
            user: { id: myRole, name: myRole === 'kyneesa' ? 'Kyneesa' : 'Xuân (Tsunn)' }
          })
        );
        // Gửi đã xem
        ws.send(
          JSON.stringify({
            type: 'seen',
            userId: myRole
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case 'history': {
              setWsMessages(data.messages || []);
              setTimeout(() => scrollToWsBottom(false), 100);
              break;
            }

            case 'new_message': {
              setWsMessages((prev) => {
                // Tránh duplicate id
                if (prev.some((m) => m.id === data.message.id)) return prev;
                return [...prev, data.message];
              });

              // Nếu tin nhắn từ đối phương, đánh dấu đã xem ngay
              if (data.message.senderId !== myRole && ws.readyState === WebSocket.OPEN) {
                ws.send(
                  JSON.stringify({
                    type: 'seen',
                    userId: myRole
                  })
                );
              }
              break;
            }

            case 'user_typing': {
              if (data.senderId !== myRole) {
                if (data.isTyping) {
                  setPartnerTyping({ isTyping: true, name: data.senderName });
                } else {
                  setPartnerTyping(null);
                }
              }
              break;
            }

            case 'messages_seen': {
              setWsMessages((prev) =>
                prev.map((msg) =>
                  msg.senderId !== data.seenBy ? { ...msg, seen: true } : msg
                )
              );
              break;
            }

            case 'reaction_updated': {
              setWsMessages((prev) =>
                prev.map((msg) =>
                  msg.id === data.messageId ? { ...msg, reactions: data.reactions } : msg
                )
              );
              break;
            }

            case 'online_status': {
              if (typeof data.activeCount === 'number') {
                setOnlineCount(data.activeCount);
              }
              break;
            }
          }
        } catch (err) {
          console.error('[WebSocket] Lỗi phân tích dữ liệu:', err);
        }
      };

      ws.onclose = () => {
        setWsConnected(false);
        wsRef.current = null;
        // Tự động kết nối lại sau 3s
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectTimeoutRef.current = null;
            connectWebSocket();
          }, 3000);
        }
      };

      ws.onerror = () => {
        setWsConnected(false);
        ws.close();
      };
    } catch (e) {
      console.error('[WebSocket] Lỗi khởi tạo socket:', e);
    }
  }, [myRole]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connectWebSocket]);

  useEffect(() => {
    scrollToWsBottom();
  }, [wsMessages, partnerTyping]);

  // Gửi tin nhắn qua WebSocket
  const handleSendWsMessage = (customText?: string) => {
    const textToSend = customText || wsInput;
    if (!textToSend.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    const payload = {
      type: 'chat_message',
      senderId: myRole,
      senderName: myRole === 'kyneesa' ? 'Kyneesa' : 'Xuân (Tsunn) ❤️',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    wsRef.current.send(JSON.stringify(payload));
    if (!customText) setWsInput('');

    // Dừng typing
    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'typing',
          senderId: myRole,
          senderName: myName,
          isTyping: false
        })
      );
    }
  };

  // Gõ phím gửi sự kiện typing
  const handleWsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setWsInput(val);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'typing',
          senderId: myRole,
          senderName: myName,
          isTyping: true
        })
      );

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: 'typing',
              senderId: myRole,
              senderName: myName,
              isTyping: false
            })
          );
        }
      }, 1500);
    }
  };

  // Thả reaction
  const handleSendReaction = (messageId: string, emoji: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(
      JSON.stringify({
        type: 'reaction',
        messageId,
        emoji,
        userId: myRole
      })
    );
    setActiveReactionMsgId(null);
  };

  // Nút Thả tim bự kiểu Messenger
  const handleBigHeart = () => {
    handleSendWsMessage('❤️');
    triggerCelebration();
  };

  const messengerQuickPrompts = [
    'Anh nhớ em nhiều lắm! 💕',
    'Em ăn cơm chưa đó? 🍲',
    'Cục cưng ngoan của anh đâu rồi? 🥺',
    'Tối nay gọi video với em nha! 📱',
    'Yêu vợ nhất trên đời! 💍',
    'Đang làm gì đó công chúa ơi? ✨'
  ];

  // ==========================================
  // TSUNN AI COMPANION STATE (BÌNH THƯỜNG)
  // ==========================================
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([
    {
      id: 'ai-1',
      sender: 'tsunn',
      text: 'Chào anh yêu! Em là Tsunn AI companion của anh nè. Em ghi nhớ mọi khoảnh khắc ngọt ngào của hai đứa mình, anh muốn tâm sự gì với em không? 🌸',
      timestamp: '14:20',
      emotion: 'shy'
    },
    {
      id: 'ai-2',
      sender: 'user',
      text: 'Anh nhớ em nhiều lắm Tsunn ơi!',
      timestamp: '14:22'
    },
    {
      id: 'ai-3',
      sender: 'tsunn',
      text: 'Hí hí, em cũng nhớ anh nhiều lắm á! Anh cứ thoải mái hỏi em về kỷ niệm, chuỗi streak hay ngày gặp nhau nhé ❤️',
      timestamp: '14:23',
      emotion: 'happy'
    }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  const aiEndRef = useRef<HTMLDivElement>(null);

  const scrollToAiBottom = () => {
    aiEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeMode === 'ai') {
      scrollToAiBottom();
    }
  }, [aiMessages, aiTyping, activeMode]);

  const aiQuickPrompts = [
    'Em có nhớ chuỗi Streak 300 ngày của tụi mình không? 🔥',
    'Em có nhớ chuyến xe Bình Lục – Chợ Nề không?',
    'Chiếc nhẫn kỷ niệm 11/8 em vẫn giữ chứ?',
    'Em thích tên Như Nguyệt hay Bình Minh hơn?',
    'Yêu em nhất trên đời ❤️'
  ];

  const handleSendAiMessage = (textToSend?: string) => {
    const messageText = textToSend || aiInput;
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAiMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setAiInput('');
    setAiTyping(true);

    setTimeout(() => {
      let replyText = 'Em nghe anh nè! Lúc nào anh nhắn em cũng vui hết á 🥰';
      let emotion: 'happy' | 'loving' | 'pout' | 'teasing' = 'happy';
      const lower = messageText.toLowerCase();

      if (lower.includes('streak') || lower.includes('lửa') || lower.includes('300') || lower.includes('200')) {
        replyText =
          'Làm sao em quên được kỷ lục 300 ngày siêu đỉnh của hai đứa mình chứ! Từ ngọn lửa 3 ngày đầu tiên (13/08/2025), rồi đến 30 ngày (679 tin nhắn), 100 ngày ngọn lửa hồng, 200 ngày lửa tím và chạm mốc 300 ngày huyền thoại cùng @spriing! Chúng mình chưa từng bỏ lỡ một ngày nào hết á, tự hào ghê luôn! 🔥🔮❤️';
        emotion = 'loving';
        triggerCelebration();
      } else if (
        lower.includes('bình lục') ||
        lower.includes('chợ nề') ||
        lower.includes('chuyến xe') ||
        lower.includes('gặp nhau')
      ) {
        replyText =
          'Làm sao mà em quên được chứ! Chuyến xe về Bình Lục – Chợ Nề ngày 29/04/2025 ấy định mệnh se duyên cho hai đứa mình gặp nhau. Hôm đó nhìn anh vừa ngơ vừa đáng yêu xỉu luôn á! 🚌🌸';
        emotion = 'teasing';
      } else if (
        lower.includes('nhẫn') ||
        lower.includes('11/8') ||
        lower.includes('lời hứa') ||
        lower.includes('mãi mãi')
      ) {
        replyText =
          'Chiếc nhẫn kỷ niệm ngày 11/8 là báu vật của em đó! Lời chúc và lời hứa bên nhau mãi mãi em sẽ giữ trọn trong tim suốt cả cuộc đời này ❤️💍';
        emotion = 'loving';
        triggerCelebration();
      } else if (
        lower.includes('như nguyệt') ||
        lower.includes('bình minh') ||
        lower.includes('tên con') ||
        lower.includes('em bé')
      ) {
        replyText =
          'Cả hai cái tên đều tuyệt vời luôn anh ơi! Bé gái Nguyễn Ngọc Như Nguyệt dịu dàng thanh khiết, bé trai Nguyễn Bình Minh thì kiên định và ấm áp. Em mong sau này tổ ấm của hai đứa mình luôn tràn ngập tiếng cười của hai thiên thần nhỏ 🥰👶';
        emotion = 'loving';
      } else if (lower.includes('sinh nhật') || lower.includes('nụ hôn')) {
        replyText =
          'Ngày sinh nhật 5/7 và nụ hôn đầu tiên em nhớ mãi luôn! Em luôn yêu thương mình và chiều chuộng mình nhất mà, anh biết rồi còn hỏi nữa hí hí 💋';
        emotion = 'loving';
      } else if (lower.includes('yêu') || lower.includes('❤️')) {
        replyText = 'Em cũng yêu anh nhiều lắmmm! Nghe anh nói câu này tim em lại đập thình thịch nè moah moah 💕';
        emotion = 'loving';
        triggerCelebration();
      } else if (lower.includes('ăn')) {
        replyText =
          'Em vừa ăn rồi nè! Anh cũng phải ăn uống đúng giờ đó nha, không được bỏ bữa đâu đấy, em mà biết là em giận á! 😤🍲';
        emotion = 'pout';
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'tsunn',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion
      };

      setAiMessages((prev) => [...prev, botMsg]);
      setAiTyping(false);
    }, 1100);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 120px)',
        maxHeight: '860px',
        gap: '0.75rem'
      }}
    >
      {/* Top Mode Selector Tabs */}
      <div
        className="glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.6rem 1rem',
          borderRadius: '18px',
          gap: '0.75rem',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveMode('messenger')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 1.1rem',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              border:
                activeMode === 'messenger'
                  ? '1px solid #38bdf8'
                  : '1px solid var(--glass-border)',
              background:
                activeMode === 'messenger'
                  ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.4), rgba(56, 189, 248, 0.2))'
                  : 'rgba(255, 255, 255, 0.05)',
              color: activeMode === 'messenger' ? '#fff' : 'var(--text-muted)',
              boxShadow:
                activeMode === 'messenger' ? '0 0 16px rgba(56, 189, 248, 0.35)' : 'none'
            }}
          >
            <MessageCircle size={17} color="#38bdf8" />
            <span>Messenger Trực Tiếp (WebSocket)</span>
            <span
              style={{
                fontSize: '0.7rem',
                padding: '0.15rem 0.45rem',
                borderRadius: '8px',
                background: wsConnected ? '#10b981' : '#f59e0b',
                color: '#fff',
                fontWeight: 700
              }}
            >
              {wsConnected ? 'LIVE' : 'WAIT'}
            </span>
          </button>

          <button
            onClick={() => setActiveMode('ai')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 1.1rem',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              border:
                activeMode === 'ai'
                  ? '1px solid var(--primary-pink)'
                  : '1px solid var(--glass-border)',
              background:
                activeMode === 'ai'
                  ? 'linear-gradient(135deg, rgba(255, 94, 142, 0.4), rgba(244, 63, 94, 0.2))'
                  : 'rgba(255, 255, 255, 0.05)',
              color: activeMode === 'ai' ? '#fff' : 'var(--text-muted)',
              boxShadow:
                activeMode === 'ai' ? '0 0 16px rgba(255, 94, 142, 0.35)' : 'none'
            }}
          >
            <Bot size={17} color="var(--primary-pink)" />
            <span>Tâm Sự Tsunn AI</span>
            <span
              style={{
                fontSize: '0.7rem',
                padding: '0.15rem 0.45rem',
                borderRadius: '8px',
                background: 'rgba(255, 94, 142, 0.3)',
                color: '#ff8ca3',
                fontWeight: 600
              }}
            >
              AI Companion
            </span>
          </button>
        </div>

        {/* Identity switch when in Messenger mode */}
        {activeMode === 'messenger' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bạn là:</span>
            <div
              style={{
                display: 'inline-flex',
                background: 'rgba(0, 0, 0, 0.35)',
                padding: '3px',
                borderRadius: '999px',
                border: '1px solid var(--glass-border)'
              }}
            >
              <button
                type="button"
                onClick={() => handleSwitchRole('kyneesa')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '999px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background:
                    myRole === 'kyneesa'
                      ? 'linear-gradient(135deg, #0284c7, #38bdf8)'
                      : 'transparent',
                  color: myRole === 'kyneesa' ? '#fff' : 'var(--text-muted)'
                }}
              >
                💙 Kyneesa
              </button>
              <button
                type="button"
                onClick={() => handleSwitchRole('tsunn')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '999px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background:
                    myRole === 'tsunn'
                      ? 'linear-gradient(135deg, #ec4899, #f43f5e)'
                      : 'transparent',
                  color: myRole === 'tsunn' ? '#fff' : 'var(--text-muted)'
                }}
              >
                🌸 Xuân
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Container */}
      <div
        className="glass-panel"
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* ============================================================== */}
        {/* MODE 1: WEBSOCKET MESSENGER */}
        {/* ============================================================== */}
        {activeMode === 'messenger' && (
          <>
            {/* Messenger Header */}
            <div
              style={{
                padding: '0.9rem 1.4rem',
                borderBottom: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(2, 132, 199, 0.08)',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background:
                        partnerRole === 'tsunn'
                          ? 'linear-gradient(135deg, #ff5e8e, #ff8ca3)'
                          : 'linear-gradient(135deg, #0284c7, #38bdf8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: '#fff',
                      boxShadow:
                        partnerRole === 'tsunn'
                          ? '0 0 14px rgba(255, 94, 142, 0.5)'
                          : '0 0 14px rgba(56, 189, 248, 0.5)'
                    }}
                  >
                    {partnerRole === 'tsunn' ? 'X' : 'K'}
                  </div>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 1,
                      right: 1,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: wsConnected ? '#10b981' : '#f59e0b',
                      border: '2px solid var(--bg-deep)'
                    }}
                    title={wsConnected ? 'Đã kết nối trực tiếp' : 'Đang chờ máy chủ'}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                      {partnerRole === 'tsunn' ? 'Xuân (Tsunn) ❤️' : 'Kyneesa 💙'}
                    </h3>
                    <Radio size={14} color={wsConnected ? '#10b981' : '#f59e0b'} />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                    {wsConnected ? (
                      <span style={{ color: '#34d399' }}>
                        ● Đang trực tuyến ({onlineCount} thiết bị kết nối)
                      </span>
                    ) : (
                      <span style={{ color: '#fbbf24' }}>
                        ● Đang kết nối lại máy chủ WebSocket...
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Status & Quick celebrate */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleBigHeart}
                  className="btn-primary"
                  style={{
                    padding: '0.45rem 0.9rem',
                    fontSize: '0.8rem',
                    borderRadius: '999px',
                    gap: '0.35rem',
                    background: 'linear-gradient(135deg, #f43f5e, #fb7185)'
                  }}
                  title="Gửi tim to đùng cho đối phương"
                >
                  <Heart size={15} fill="#fff" />
                  <span>Thả Tim Lớn</span>
                </button>
              </div>
            </div>

            {/* Hint alert on top */}
            <div
              style={{
                padding: '0.4rem 1.25rem',
                background: 'rgba(56, 189, 248, 0.08)',
                borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}
            >
              <span>
                💡 <strong>Chat Messenger Real-time</strong>: Mở web trên 2 tab (hoặc 2 máy tính/điện thoại) và đổi vai trò để nhắn tin tức thời qua lại!
              </span>
              <span style={{ color: '#38bdf8' }}>WS: /ws</span>
            </div>

            {/* Messenger Message Feed */}
            <div
              style={{
                flex: 1,
                padding: '1.25rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}
            >
              {wsMessages.length === 0 ? (
                <div
                  style={{
                    margin: 'auto',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem'
                  }}
                >
                  <MessageCircle size={40} color="var(--primary-pink)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                  <p>Chưa có tin nhắn nào. Hãy gửi lời yêu thương đầu tiên qua Messenger nhé! 💕</p>
                </div>
              ) : (
                wsMessages.map((msg, index) => {
                  const isMine = msg.senderId === myRole;
                  const isLastMineMsg =
                    isMine &&
                    !wsMessages.slice(index + 1).some((m) => m.senderId === myRole);

                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isMine ? 'flex-end' : 'flex-start',
                        gap: '0.2rem',
                        position: 'relative'
                      }}
                    >
                      {/* Sender name for group clarity */}
                      {!isMine && (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            color: 'var(--text-muted)',
                            marginLeft: '2.5rem',
                            marginBottom: '2px'
                          }}
                        >
                          {msg.senderName}
                        </span>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-end',
                          gap: '0.5rem',
                          maxWidth: '78%'
                        }}
                      >
                        {/* Avatar for partner */}
                        {!isMine && (
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              background:
                                msg.senderId === 'tsunn'
                                  ? 'var(--primary-pink)'
                                  : 'var(--primary-cyan)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: '#fff',
                              flexShrink: 0
                            }}
                          >
                            {msg.senderId === 'tsunn' ? 'X' : 'K'}
                          </div>
                        )}

                        <div style={{ position: 'relative' }}>
                          {/* Bubble */}
                          <div
                            onClick={() =>
                              setActiveReactionMsgId(
                                activeReactionMsgId === msg.id ? null : msg.id
                              )
                            }
                            style={{
                              padding:
                                msg.text === '❤️'
                                  ? '0.3rem 0.8rem'
                                  : '0.8rem 1.15rem',
                              fontSize: msg.text === '❤️' ? '2.4rem' : '0.92rem',
                              borderRadius: isMine
                                ? '18px 18px 4px 18px'
                                : '18px 18px 18px 4px',
                              background:
                                msg.text === '❤️'
                                  ? 'transparent'
                                  : isMine
                                  ? myRole === 'kyneesa'
                                    ? 'linear-gradient(135deg, #0284c7, #38bdf8)'
                                    : 'linear-gradient(135deg, #e11d48, #fb7185)'
                                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.05))',
                              border:
                                msg.text === '❤️'
                                  ? 'none'
                                  : isMine
                                  ? 'none'
                                  : '1px solid rgba(255, 255, 255, 0.15)',
                              backdropFilter: msg.text === '❤️' ? 'none' : 'blur(10px)',
                              color: '#ffffff',
                              boxShadow:
                                msg.text === '❤️'
                                  ? 'none'
                                  : isMine
                                  ? '0 4px 14px rgba(2, 132, 199, 0.35)'
                                  : '0 4px 14px rgba(0, 0, 0, 0.2)',
                              lineHeight: 1.45,
                              wordBreak: 'break-word',
                              cursor: 'pointer'
                            }}
                            title="Nhấp để thả cảm xúc"
                          >
                            {msg.text}
                          </div>

                          {/* Reaction Picker Popup */}
                          {activeReactionMsgId === msg.id && (
                            <div
                              style={{
                                position: 'absolute',
                                bottom: '100%',
                                [isMine ? 'right' : 'left']: 0,
                                marginBottom: '6px',
                                background: 'rgba(15, 23, 42, 0.95)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '999px',
                                padding: '0.25rem 0.5rem',
                                display: 'flex',
                                gap: '0.35rem',
                                zIndex: 10,
                                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                                animation: 'fadeIn 0.15s ease'
                              }}
                            >
                              {REACTION_EMOJIS.map((emoji) => (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => handleSendReaction(msg.id, emoji)}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '1.25rem',
                                    cursor: 'pointer',
                                    padding: '0.1rem 0.25rem',
                                    transition: 'transform 0.15s ease'
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.transform = 'scale(1.35)')
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.transform = 'scale(1)')
                                  }
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Reactions Display */}
                          {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                            <div
                              style={{
                                position: 'absolute',
                                bottom: '-8px',
                                [isMine ? 'left' : 'right']: '8px',
                                background: 'rgba(15, 23, 42, 0.85)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '999px',
                                padding: '1px 6px',
                                fontSize: '0.72rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                zIndex: 2
                              }}
                            >
                              {Object.entries(msg.reactions).map(([emoji, users]) =>
                                users.length > 0 ? (
                                  <span key={emoji} title={`${users.join(', ')}`}>
                                    {emoji}
                                    {users.length > 1 ? ` ${users.length}` : ''}
                                  </span>
                                ) : null
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Timestamp & Seen Receipt */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.68rem',
                          color: 'rgba(255, 255, 255, 0.5)',
                          marginRight: isMine ? '0.35rem' : 'auto',
                          marginLeft: isMine ? 'auto' : '2.5rem'
                        }}
                      >
                        <span>{msg.timestamp}</span>
                        {isLastMineMsg && (
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2px',
                              color: msg.seen ? '#38bdf8' : 'rgba(255, 255, 255, 0.5)'
                            }}
                          >
                            <CheckCheck size={12} />
                            <span>{msg.seen ? 'Đã xem' : 'Đã gửi'}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Typing indicator */}
              {partnerTyping && partnerTyping.isTyping && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    animation: 'fadeIn 0.2s ease'
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background:
                        partnerRole === 'tsunn'
                          ? 'var(--primary-pink)'
                          : 'var(--primary-cyan)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#fff'
                    }}
                  >
                    {partnerRole === 'tsunn' ? 'X' : 'K'}
                  </div>
                  <div
                    style={{
                      padding: '0.55rem 1rem',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <span>{partnerName} đang soạn tin nhắn</span>
                    <span className="typing-dots">
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </span>
                  </div>
                </div>
              )}

              <div ref={wsEndRef} />
            </div>

            {/* Quick Messages Bar */}
            <div
              style={{
                padding: '0.45rem 1rem',
                display: 'flex',
                gap: '0.45rem',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(0, 0, 0, 0.15)'
              }}
            >
              {messengerQuickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendWsMessage(prompt)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '999px',
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#38bdf8';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Messenger Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendWsMessage();
              }}
              style={{
                padding: '0.85rem 1.25rem',
                borderTop: '1px solid var(--glass-border)',
                display: 'flex',
                gap: '0.65rem',
                alignItems: 'center',
                background: 'rgba(0, 0, 0, 0.2)'
              }}
            >
              <input
                type="text"
                placeholder={
                  wsConnected
                    ? `Nhắn tin cho ${partnerName} (với tư cách ${myRole === 'kyneesa' ? 'Kyneesa' : 'Xuân'})...`
                    : 'Đang kết nối lại máy chủ WebSocket...'
                }
                value={wsInput}
                disabled={!wsConnected}
                onChange={handleWsInputChange}
                style={{
                  flex: 1,
                  padding: '0.8rem 1.2rem',
                  borderRadius: '999px',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />

              <button
                type="button"
                onClick={handleBigHeart}
                style={{
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid #fb7185',
                  borderRadius: '50%',
                  width: 42,
                  height: 42,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fb7185',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                title="Gửi tim to đùng"
              >
                <Heart size={20} fill="#fb7185" />
              </button>

              <button
                type="submit"
                disabled={!wsConnected || !wsInput.trim()}
                className="btn-primary"
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: '999px',
                  opacity: !wsConnected || !wsInput.trim() ? 0.5 : 1,
                  cursor: !wsConnected || !wsInput.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                <Send size={16} />
                <span>Gửi</span>
              </button>
            </form>
          </>
        )}

        {/* ============================================================== */}
        {/* MODE 2: TSUNN AI COMPANION (BÌNH THƯỜNG) */}
        {/* ============================================================== */}
        {activeMode === 'ai' && (
          <>
            {/* AI Header */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255, 94, 142, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ff5e8e, #ff8ca3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: '#fff',
                      boxShadow: '0 0 14px rgba(255, 94, 142, 0.5)'
                    }}
                  >
                    X
                  </div>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 1,
                      right: 1,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: '#4ade80',
                      border: '2px solid var(--bg-deep)'
                    }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                      Xuân (Tsunn AI Companion)
                    </h3>
                    <Sparkles size={15} color="var(--accent-gold)" />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--accent-blush)', margin: 0 }}>
                    ● AI trợ lý tình yêu • Trả lời dựa trên toàn bộ ký ức của hai đứa
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={triggerCelebration}
                className="btn-secondary"
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
              >
                <Heart size={15} fill="var(--primary-pink)" color="var(--primary-pink)" />
                <span>Hiệu Ứng Tim</span>
              </button>
            </div>

            {/* AI Message Feed */}
            <div
              style={{
                flex: 1,
                padding: '1.25rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}
            >
              {aiMessages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: isUser ? 'flex-end' : 'flex-start',
                      alignItems: 'flex-end',
                      gap: '0.5rem'
                    }}
                  >
                    {!isUser && (
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          background: 'var(--primary-pink)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#fff',
                          flexShrink: 0
                        }}
                      >
                        X
                      </div>
                    )}

                    <div
                      style={{
                        maxWidth: '75%',
                        padding: '0.85rem 1.2rem',
                        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: isUser
                          ? 'linear-gradient(135deg, #0284c7, #38bdf8)'
                          : 'linear-gradient(135deg, rgba(255, 94, 142, 0.25), rgba(192, 132, 252, 0.25))',
                        border: isUser ? 'none' : '1px solid rgba(255, 94, 142, 0.3)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: isUser
                          ? '0 4px 14px rgba(2, 132, 199, 0.3)'
                          : '0 4px 14px rgba(255, 94, 142, 0.15)'
                      }}
                    >
                      <p style={{ fontSize: '0.92rem', lineHeight: 1.5, color: '#fff', margin: 0 }}>
                        {msg.text}
                      </p>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          color: 'rgba(255,255,255,0.6)',
                          display: 'block',
                          textAlign: 'right',
                          marginTop: '0.3rem'
                        }}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {aiTyping && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: 'var(--primary-pink)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#fff'
                    }}
                  >
                    X
                  </div>
                  <div
                    style={{
                      padding: '0.65rem 1.1rem',
                      borderRadius: '18px',
                      background: 'rgba(255, 94, 142, 0.15)',
                      border: '1px solid rgba(255, 94, 142, 0.2)',
                      fontSize: '0.82rem',
                      color: 'var(--accent-blush)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <span>Tsunn AI đang suy nghĩ câu trả lời</span>
                    <span className="animate-heart-pulse">❤️</span>
                  </div>
                </div>
              )}
              <div ref={aiEndRef} />
            </div>

            {/* AI Quick Suggestion Pills */}
            <div
              style={{
                padding: '0.45rem 1rem',
                display: 'flex',
                gap: '0.45rem',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(0, 0, 0, 0.15)'
              }}
            >
              {aiQuickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendAiMessage(prompt)}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '999px',
                    padding: '0.32rem 0.8rem',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary-pink)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* AI Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendAiMessage();
              }}
              style={{
                padding: '0.85rem 1.25rem',
                borderTop: '1px solid var(--glass-border)',
                display: 'flex',
                gap: '0.65rem',
                alignItems: 'center',
                background: 'rgba(0, 0, 0, 0.2)'
              }}
            >
              <input
                type="text"
                placeholder="Nhắn gì đó dịu dàng với Tsunn AI nè..."
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.8rem 1.2rem',
                  borderRadius: '999px',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />

              <button
                type="button"
                onClick={triggerCelebration}
                style={{
                  background: 'rgba(255, 94, 142, 0.15)',
                  border: '1px solid var(--primary-pink)',
                  borderRadius: '50%',
                  width: 42,
                  height: 42,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-pink)'
                }}
                title="Thả tim"
              >
                <Smile size={19} />
              </button>

              <button
                type="submit"
                disabled={!aiInput.trim()}
                className="btn-primary"
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: '999px',
                  opacity: !aiInput.trim() ? 0.5 : 1
                }}
              >
                <Send size={16} />
                <span>Gửi</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
