import { useCmnAuthStore } from '~/stores/cmnAuth';
import { ROLES } from '~/utils/roles';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useCmnAuthStore();
  const path = to.path;

  // Si l'utilisateur n'est pas connecté, le middleware auth.global.ts gère déjà la redirection
  if (!authStore.isAuthenticated || !authStore.currentUser) {
    return;
  }

  const userRole = authStore.currentUser.role;

  // Règles d'accès pour les Expéditeurs (Shippers)
  if (userRole === ROLES.Shipper) {
    if (path.startsWith('/app/uc')) {
      return navigateTo('/app/us');
    }
  }

  // Règles d'accès pour les Transporteurs (Carriers)
  if (userRole === ROLES.Carrier) {
    if (path.startsWith('/app/us') || path.startsWith('/offers/create')) {
      return navigateTo('/app/uc');
    }
  }
});
