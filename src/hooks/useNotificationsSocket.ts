import { fetchNotifications } from '@/services/notifi';
import { useEffect, useRef, useState } from 'react';
import Echo from 'laravel-echo';
import io from 'socket.io-client';
import { getAuthToken } from '@/services/auth';
import { toast } from 'sonner';

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
  const echoRef = useRef<any>(null);

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

    // Khởi tạo Echo với socket.io-client@2.4
    // @ts-ignore
    window.io = io;
    const echo = new Echo({
      broadcaster: 'socket.io',
      host: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:6001',
      transports: ['websocket'],
      withCredentials: true, 
      forceTLS: false,
      disableStats: true,
      auth: {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      },
      // Nếu cần auth: thêm auth: { headers: { Authorization: ... } }
    });
    echoRef.current = echo;
    // Lắng nghe notification trên kênh private-user.{userId}
    const channel = echo.channel(`kpi_database_user.${userId}`);
    channel.listen('.notification', (notification: any) => {
      fetchInitialNotifications()
      toast.info(notification.data.title, {
        description: notification.data.content,
        action: {
          label: 'Xem',
          onClick: () => {
            window.open(notification.data.url, '_blank');
          }
        }
      })
    });

    return () => {
      if (echoRef.current) {
        echoRef.current.leave(`user.${userId}`);
        echoRef.current.disconnect();
      }
    };
  }, [userId]);

  return { notifications, unreadCount };
} 