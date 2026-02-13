export * from './api'
export * from './auth'




// Types pour les utilisateurs
export type UserRole = 'shipper' | 'carrier'; // chargeur | transporteur

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


// Types pour les annonces
export type CargoType = 'palettes' | 'vrac' | 'conteneur' | 'frigorifique' | 'dangereux' | 'autre';
export type AnnouncementStatus = 'pending' | 'negotiating' | 'accepted' | 'completed' | 'cancelled';

export interface Location {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  lat?: number;
  lng?: number;
}

export interface Announcement {
  id: string;
  userId: string;
  shipperId?: string;
  user?: User;
  shipper?: User;
  title: string;
  description: string;
  cargoType: CargoType;
  weight: number; // en kg
  volume: number; // en m³
  origin: Location;
  destination: Location;
  distance?: number; // en kg
  pickupDate: string;
  deliveryDate: string;
  budget: number; // en euros
  status: AnnouncementStatus;
  createdAt: string;
  updatedAt: string;
  offers?: Offer[];
}

// Types pour les disponibilités (transporteurs)
export interface Availability {
  id: string;
  carrierId: string;
  carrier?: User;
  vehicleType: string;
  capacity: number; // en kg
  volumeCapacity: number; // en m³
  availableFrom: string;
  availableTo: string;
  origin: Location;
  destination?: Location;
  pricePerKm: number;
  createdAt: string;
}

// Types pour les offres
export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'counter';

export interface Offer {
  id: string;
  announcementId: string;
  carrierId: string;
  carrier?: User;
  price: number;
  message: string;
  status: OfferStatus;
  createdAt: string;
  counterOffers?: CounterOffer[];
}

export interface CounterOffer {
  id: string;
  offerId: string;
  userId: string;
  user?: User;
  price: number;
  message: string;
  createdAt: string;
}

// Types pour les messages
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

// Types pour les avis
export interface Review {
  id: string;
  fromUserId: string;
  fromUser?: User;
  toUserId: string;
  toUser?: User;
  announcementId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

// Types pour les signalements
export type ReportType = 'user' | 'announcement' | 'offer';
export type ReportReason = 'spam' | 'fraud' | 'inappropriate' | 'other';

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

// Types pour les documents
export type DocumentType = 'license' | 'insurance' | 'registration' | 'identity' | 'other';

export interface Document {
  id: string;
  userId: string;
  type: DocumentType;
  name: string;
  url: string;
  verified: boolean;
  uploadedAt: string;
}

// Types pour les statistiques
export interface UserStats {
  totalAnnouncements: number;
  activeAnnouncements: number;
  completedAnnouncements: number;
  totalOffers: number;
  acceptedOffers: number;
  averageRating: number;
  totalReviews: number;
}

// Types pour les filtres
export interface AnnouncementFilters {
  cargoType?: CargoType;
  minBudget?: number;
  maxBudget?: number;
  minDistance?: number;
  maxDistance?: number;
  status?: AnnouncementStatus;
  originCity?: string;
  destinationCity?: string;
}
