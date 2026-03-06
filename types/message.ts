import type { User } from './users';
import type { Announcement } from './announcement';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: User;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  announcementId: string;
  announcement?: Announcement;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  status: 'active' | 'closed' | 'agreement' | 'dispute';
  createdAt: string;
  updatedAt: string;
}
