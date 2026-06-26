/**
 * Centralized mapping functions for UI labels and classes
 */

export const getSubscriptionStatusLabel = (status?: string): string => {
  const labels: Record<string, string> = {
    active: 'Actif',
    inactive: 'Inactif',
    pending: 'En attente',
    canceled: 'Annulé'
  };
  return labels[status || 'inactive'] || status || 'Inconnu';
};

export const getKycStatusLabel = (status?: string): string => {
  const labels: Record<string, string> = {
    none: 'Non soumis',
    pending: 'En attente',
    approved: 'Approuvé',
    verified: 'Vérifié',
    rejected: 'Rejeté'
  };
  return labels[status || 'none'] || 'Non soumis';
};

export const getKycStatusClass = (status?: string): string => {
  const classes: Record<string, string> = {
    none: 'badge-ghost text-secondary-100 border-secondary-400',
    pending: 'bg-yellow-400 text-yellow-900 border-0',
    approved: 'bg-green-400 text-green-900 border-0',
    verified: 'bg-green-400 text-green-900 border-0',
    rejected: 'bg-red-400 text-red-100 border-0'
  };
  return classes[status || 'none'] || 'badge-ghost';
};

export const getTransactionStatusLabel = (status?: string): string => {
  const map: Record<string, string> = {
    approved: 'Approuvé',
    pending: 'En attente',
    declined: 'Refusé',
    canceled: 'Annulé',
    refunded: 'Remboursé'
  };
  return map[status || 'pending'] || status || 'Inconnu';
};

export const getTransactionStatusClass = (status?: string): string => {
  const map: Record<string, string> = {
    approved: 'badge-success text-white',
    pending: 'badge-warning text-white',
    declined: 'badge-danger text-white',
    canceled: 'badge-ghost',
    refunded: 'badge-info text-white'
  };
  return map[status || 'pending'] || 'badge-ghost';
};

export const formatDate = (timestamp: number | string): string => {
  if (!timestamp) return '-';
  return new Date(timestamp).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const formatDateTime = (timestamp: number | string): string => {
  if (!timestamp) return '-';
  return new Date(timestamp).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

export const formatAmount = (amount: number): string => {
  if (amount === undefined || amount === null) return '-';
  return new Intl.NumberFormat('fr-FR').format(amount);
};
