export interface Notification {
  id: string;
  title: string;
  content: string;
  status: 'read' | 'unread';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: number;
  metadata?: any;
}
