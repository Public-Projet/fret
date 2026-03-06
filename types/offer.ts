import type { OfferStatus } from './common';
import type { User } from './users';

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
