export interface PublicUser {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  photoUrl?: string;
  bio?: string;
  rating: number;
  reviewsCount: number;
  kycStatus: string;
  role: 'carrier' | 'shipper';
  company?: string;
  location?: string;
  myReview?: { score: number; comment?: string } | null;
}
