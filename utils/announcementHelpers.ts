import type { Announcement, AnnouncementFilters, AnnouncementStatus } from '~/types';

export interface AnnouncementBaseState {
  announcements: Announcement[];
  filters: AnnouncementFilters;
}

/**
 * Applique les filtres sur une liste d'annonces
 */
export const applyAnnouncementFilters = (announcements: Announcement[], filters: AnnouncementFilters): Announcement[] => {
  let filtered = [...announcements];

  if (filters.cargoType) {
    filtered = filtered.filter(a => a.cargoType === filters.cargoType);
  }

  if (filters.status) {
    filtered = filtered.filter(a => a.status === filters.status);
  }

  if (filters.minBudget) {
    filtered = filtered.filter(a => a.budget >= filters.minBudget!);
  }

  if (filters.maxBudget) {
    filtered = filtered.filter(a => a.budget <= filters.maxBudget!);
  }

  if (filters.minDistance) {
    filtered = filtered.filter(a => (a.distance || 0) >= filters.minDistance!);
  }

  if (filters.maxDistance) {
    filtered = filtered.filter(a => (a.distance || 0) <= filters.maxDistance!);
  }

  if (filters.originCity) {
    filtered = filtered.filter(a =>
      a.origin.city.toLowerCase().includes(filters.originCity!.toLowerCase())
    );
  }

  if (filters.destinationCity) {
    filtered = filtered.filter(a =>
      a.destination.city.toLowerCase().includes(filters.destinationCity!.toLowerCase())
    );
  }

  return filtered;
};

/**
 * Getters partagés pour les stores d'annonces
 */
export const sharedAnnouncementGetters = {
  allAnnouncements: (state: AnnouncementBaseState) => state.announcements,
  
  filteredAnnouncements: (state: AnnouncementBaseState) => {
    return applyAnnouncementFilters(state.announcements, state.filters);
  },

  userAnnouncements: (state: AnnouncementBaseState) => (userId: string) => {
    return state.announcements.filter(a => a.userId === userId);
  },

  announcementsByStatus: (state: AnnouncementBaseState) => (status: AnnouncementStatus) => {
    return state.announcements.filter(a => a.status === status);
  },
};

/**
 * Actions partagées pour les stores d'annonces
 */
export const sharedAnnouncementActions = {
  setFilters(filters: AnnouncementFilters) {
    (this as any).filters = filters;
  },
  resetFilters() {
    (this as any).filters = {};
  },
};
