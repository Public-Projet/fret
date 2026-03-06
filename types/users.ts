import type { UserRole } from './common';
import type { Document } from './document';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  company?: string;
  phone?: string;
  avatar?: string;
  rating?: number;
  reviewCount?: number;
  verified?: boolean;
  createdAt?: string;
  status?: 'pending' | 'active' | 'suspended';
  documents?: Document[];
}
