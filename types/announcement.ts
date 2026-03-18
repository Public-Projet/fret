import type { CargoType, AnnouncementStatus } from './common';
import type { Location } from './location';
import type { User } from './users';
import type { Offer } from './offer';

export interface Announcement {
  id: string;
  userId: string;
  shipperId?: string;
  user?: User;
  shipper?: User;
  title: string;
  description: string;
  cargoType: CargoType;
  weight: number;
  volume: number;
  origin: Location;
  destination: Location;
  distance?: number;
  pickupDate: string;
  deliveryDate: string;
  budget: number;
  status: AnnouncementStatus;
  views?: number;
  uniqueViews?: number;
  createdAt: string;
  updatedAt: string;
  offers?: Offer[];
}

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
