/**
 * Types de base
 */

export type AnnouncementStatus = 'pending' | 'negotiating' | 'accepted' | 'completed' | 'cancelled';
export type CargoType = 'palettes' | 'vrac' | 'conteneur' | 'frigorifique' | 'dangereux' | 'autre';
export type DocumentType = 'license' | 'insurance' | 'registration' | 'identity' | 'other';
export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'counter';
export type ReportReason = 'spam' | 'fraud' | 'inappropriate' | 'other';
export type ReportType = 'user' | 'announcement' | 'offer';
export type UserRole = 'shipper' | 'carrier';
