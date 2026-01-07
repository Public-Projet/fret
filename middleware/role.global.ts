import { useAuthStore } from '~/stores/auth';
import { ROLES } from '~/utils/roles';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const path = to.path;

  // Si l'utilisateur n'est pas connecté, le middleware auth.global.ts gère déjà la redirection
  if (!authStore.isAuthenticated || !authStore.currentUser) {
    return;
  }

  const userRole = authStore.currentUser.role;

  // Règles d'accès pour les Expéditeurs (Shippers)
  // Ne peuvent pas accéder aux routes transporteurs
  if (userRole === ROLES.Shipper) {
    if (path.startsWith('/app/carrier')) {
      return navigateTo('/app/shipper');
    }
  }

  // Règles d'accès pour les Transporteurs (Carriers)
  // Ne peuvent pas accéder aux routes expéditeurs
  if (userRole === ROLES.Carrier) {
    if (path.startsWith('/app/shipper') || path.startsWith('/offers/create')) {
      return navigateTo('/app/carrier');
    }
  }
});
