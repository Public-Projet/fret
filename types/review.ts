import type { User } from './users';

export interface Review {
  id: string;
  fromUserId: string;
  fromUser?: User;
  toUserId: string;
  toUser?: User;
  announcementId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
