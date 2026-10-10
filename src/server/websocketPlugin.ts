import type { Plugin, ViteDevServer } from 'vite';
import { WebSocketServer, WebSocket } from 'ws';
import fs from 'fs';
import path from 'path';

export interface ChatMessagePayload {
  id: string;
  senderId: 'kyneesa' | 'tsunn';
  senderName: string;
  text: string;
  timestamp: string;
  createdAt: number;
  seen?: boolean;
  reactions?: Record<string, string[]>; // emoji -> array of userIds
}

const CHAT_HISTORY_FILE = path.resolve(process.cwd(), 'src/data/chat_history.json');

// Khởi tạo lịch sử tin nhắn ban đầu nếu chưa có file
const initialMessages: ChatMessagePayload[] = [
  {
    id: 'init-1',
    senderId: 'tsunn',
    senderName: 'Xuân (Tsunn) ❤️',
    text: 'Anh yêu ơi! Hôm nay của anh thế nào rồi? Có nhớ em một chút nào không đó? 🥺',
    timestamp: '22:15',
    createdAt: Date.now() - 3600000,
    seen: true,
    reactions: { '❤️': ['kyneesa'] }
  },
  {
    id: 'init-2',
    senderId: 'kyneesa',
    senderName: 'Kyneesa',
    text: 'Nhớ em cả ngày luôn nè, bận mấy cũng phải vào không gian của hai đứa mình nhắn cho em!',
    timestamp: '22:18',
    createdAt: Date.now() - 3400000,
    seen: true,
    reactions: { '🥰': ['tsunn'] }
  },
  {
    id: 'init-3',
    senderId: 'tsunn',
    senderName: 'Xuân (Tsunn) ❤️',
    text: 'Hí hí dẻo miệng quá nha! Từ giờ hai đứa mình có thể nhắn tin trực tiếp qua đây như Messenger rồi nè moah moah 💕',
    timestamp: '22:20',
    createdAt: Date.now() - 3200000,
    seen: true,
    reactions: { '🔥': ['kyneesa'] }
  }
];

function loadChatHistory(): ChatMessagePayload[] {
  try {
    if (fs.existsSync(CHAT_HISTORY_FILE)) {
      const data = fs.readFileSync(CHAT_HISTORY_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('[WebSocket] Lỗi đọc chat history:', err);
  }
  // Ghi dữ liệu ban đầu
  saveChatHistory(initialMessages);
  return initialMessages;
}

function saveChatHistory(messages: ChatMessagePayload[]) {
  try {
    const dir = path.dirname(CHAT_HISTORY_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CHAT_HISTORY_FILE, JSON.stringify(messages, null, 2), 'utf-8');
  } catch (err) {
    console.error('[WebSocket] Lỗi lưu chat history:', err);
  }
}

export function websocketChatPlugin(): Plugin {
  return {
    name: 'vite-plugin-websocket-messenger',
    configureServer(server: ViteDevServer) {
      if (!server.httpServer) return;

      const wss = new WebSocketServer({ noServer: true });
      let chatHistory = loadChatHistory();
      const onlineUsers = new Map<WebSocket, { id: 'kyneesa' | 'tsunn'; name: string }>();

      // Đón sự kiện nâng cấp HTTP sang WebSocket trên đường dẫn /ws
      server.httpServer.on('upgrade', (req, socket, head) => {
        const url = req.url || '';
        if (url === '/ws' || url.startsWith('/ws')) {
          wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit('connection', ws, req);
          });
        }
      });

      // Broadcast tin nhắn tới tất cả client
      const broadcast = (data: any, exceptWs?: WebSocket) => {
        const messageStr = JSON.stringify(data);
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN && client !== exceptWs) {
            client.send(messageStr);
          }
        });
      };

      const broadcastOnlineUsers = () => {
        const users = Array.from(onlineUsers.values());
        broadcast({
          type: 'online_status',
          users,
          activeCount: onlineUsers.size
        });
      };

      wss.on('connection', (ws: WebSocket) => {
        // Gửi ngay lịch sử trò chuyện khi vừa kết nối
        ws.send(JSON.stringify({
          type: 'history',
          messages: chatHistory
        }));

        ws.on('message', (rawData) => {
          try {
            const data = JSON.parse(rawData.toString());

            switch (data.type) {
              case 'join': {
                onlineUsers.set(ws, data.user);
                broadcastOnlineUsers();
                break;
              }

              case 'chat_message': {
                const newMsg: ChatMessagePayload = {
                  id: data.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                  senderId: data.senderId,
                  senderName: data.senderName,
                  text: data.text,
                  timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  createdAt: Date.now(),
                  seen: false,
                  reactions: {}
                };

                chatHistory.push(newMsg);
                // Giữ tối đa 500 tin nhắn gần nhất
                if (chatHistory.length > 500) {
                  chatHistory = chatHistory.slice(-500);
                }
                saveChatHistory(chatHistory);

                // Gửi tin nhắn mới tới toàn bộ kết nối (bao gồm cả người gửi để xác nhận)
                broadcast({
                  type: 'new_message',
                  message: newMsg
                });
                break;
              }

              case 'typing': {
                // Gửi trạng thái đang soạn tin tới các máy khác
                broadcast({
                  type: 'user_typing',
                  senderId: data.senderId,
                  senderName: data.senderName,
                  isTyping: data.isTyping
                }, ws);
                break;
              }

              case 'seen': {
                // Đánh dấu tất cả tin nhắn gửi bởi đối phương là đã xem
                let updated = false;
                chatHistory.forEach((msg) => {
                  if (msg.senderId !== data.userId && !msg.seen) {
                    msg.seen = true;
                    updated = true;
                  }
                });

                if (updated) {
                  saveChatHistory(chatHistory);
                  broadcast({
                    type: 'messages_seen',
                    seenBy: data.userId
                  });
                }
                break;
              }

              case 'reaction': {
                // Thêm hoặc gỡ reaction
                const targetMsg = chatHistory.find((m) => m.id === data.messageId);
                if (targetMsg) {
                  if (!targetMsg.reactions) targetMsg.reactions = {};
                  const emoji = data.emoji;
                  const userId = data.userId;

                  // Xóa reaction cũ của user này nếu có
                  Object.keys(targetMsg.reactions).forEach((k) => {
                    targetMsg.reactions![k] = targetMsg.reactions![k].filter((id) => id !== userId);
                    if (targetMsg.reactions![k].length === 0) {
                      delete targetMsg.reactions![k];
                    }
                  });

                  // Thêm reaction mới nếu chưa có
                  if (data.action !== 'remove') {
                    if (!targetMsg.reactions[emoji]) targetMsg.reactions[emoji] = [];
                    targetMsg.reactions[emoji].push(userId);
                  }

                  saveChatHistory(chatHistory);
                  broadcast({
                    type: 'reaction_updated',
                    messageId: data.messageId,
                    reactions: targetMsg.reactions
                  });
                }
                break;
              }
            }
          } catch (e) {
            console.error('[WebSocket] Lỗi xử lý tin nhắn:', e);
          }
        });

        ws.on('close', () => {
          onlineUsers.delete(ws);
          broadcastOnlineUsers();
        });

        ws.on('error', (err) => {
          console.error('[WebSocket] Socket error:', err);
          onlineUsers.delete(ws);
          broadcastOnlineUsers();
        });
      });

      console.log('⚡ [WebSocket Messenger] Sẵn sàng phục vụ tại đường dẫn /ws');
    }
  };
}
