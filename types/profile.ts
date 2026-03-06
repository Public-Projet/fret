import type { UserRole } from './common';

export interface UserProfile {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  phone?: string;
  role: UserRole;
  bio?: string;
  photoUrl?: string;
  status: 'pending' | 'active' | 'suspended';
  kycDocuments?: {
    id: string;
    type: string;
    name: string;
    status: 'pending' | 'verified' | 'rejected';
    uploadedAt: number;
    url: string;
  }[];
  kycStatus?: 'none' | 'pending' | 'verified' | 'rejected';
}

export interface UpdateProfileData {
  firstname?: string;
  lastname?: string;
  phone?: string;
  photoUrl?: string;
  bio?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateEmailData {
  newEmail: string;
  password: string;
}

export interface Vehicle {
  id: string;
  type: 'truck' | 'van' | 'pickup' | 'semi' | 'other';
  licensePlate: string;
  brand?: string;
  model?: string;
  capacity?: number;
  volume?: number;
  status: 'available' | 'in_transit' | 'maintenance';
  availability?: any;
  history?: any[];
}

export interface AddVehicleData {
  type: string;
  licensePlate: string;
  brand?: string;
  model?: string;
  capacity?: number;
  volume?: number;
}
