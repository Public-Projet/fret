import type { ReportType, ReportReason } from './common';
import type { User } from './users';

export interface Report {
  id: string;
  reporterId: string;
  reporter?: User;
  type: ReportType;
  targetId: string;
  reason: ReportReason;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}
