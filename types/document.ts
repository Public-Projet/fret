import type { DocumentType } from './common';

export interface Document {
  id: string;
  userId: string;
  type: DocumentType;
  name: string;
  url: string;
  verified: boolean;
  uploadedAt: string;
}
