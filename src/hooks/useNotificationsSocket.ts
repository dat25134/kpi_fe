import { fetchNotifications } from '@/services/notifi';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface NotificationData {
  id: number;
  title: string;
  content: string;
  url?: string;
  read_at?: string | null;
  created_at: string;
  data: {
    id: number;
    title: string;
    content: string;
    url: string;
    read_at: string | null;
    created_at: string;
  };
  // ... các trường khác nếu có
}

export function useNotificationsSocket(userId: number) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Fetch initial notifications from backend
    const fetchInitialNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
        setUnreadCount(Array.isArray(data) ? data.filter((n) => !n.read_at).length : 0);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch notifications:', err);
      }
    };
    fetchInitialNotifications();

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:6001', {
      transports: ['websocket'],
      // Nếu cần auth: auth: { token: ... }
    });
    socketRef.current = socket;

    // Join vào room user
    socket.emit('subscribe', { channel: `private-user.${userId}` });

    // Lắng nghe event notification
    socket.on('notification', (notification: NotificationData) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return { notifications, unreadCount };
} 