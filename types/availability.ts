import type { Location } from './location';
import type { User } from './users';
import type { Vehicle } from './profile';

/**
 * Availability (types globaux — utilisé dans les types généraux)
 */
export interface Availability {
  id: string;
  carrierId: string;
  carrier?: User;
  vehicleType: string;
  capacity: number;
  volumeCapacity: number;
  availableFrom: string;
  availableTo: string;
  origin: Location;
  destination?: Location;
  pricePerKm: number;
  createdAt: string;
}

/**
 * StoreLocation — format simplifié utilisé par le store availability
 */
export interface StoreLocation {
  city: string;
  country: string;
  address?: string;
  postalCode?: string;
}

/**
 * StoreAvailability — format détaillé utilisé par le store availability
 */
export interface StoreAvailability {
  id: string;
  vehicle: Vehicle;
  origin: StoreLocation;
  destination?: StoreLocation;
  startDate: string;
  endDate: string;
  price?: number;
  status: 'active' | 'expired' | 'full' | 'prolonged';
  maxRequests?: number;
  currentRequests: number;
  views?: number;
  uniqueViews?: number;
  createdAt: string;
  carrier?: {
    id: string;
    firstname: string;
    lastname: string;
    photoUrl?: string;
    rating?: number;
    reviewsCount?: number;
    myReview?: { score: number; comment?: string } | null;
  };
  bookings?: any[];
  myReview?: { score: number; comment?: string } | null;
}

/**
 * Données de création d'une disponibilité
 */
export interface CreateAvailabilityData {
  vehicleId: string;
  origin: StoreLocation;
  destination?: StoreLocation;
  startDate: string;
  endDate: string;
  price?: number;
  maxRequests?: number;
}
