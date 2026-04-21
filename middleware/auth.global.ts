import { useCmnAuthStore } from '~/stores/cmnAuth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useCmnAuthStore();

  // Restaurer la session si nécessaire (attente async du chargement)
  if (!authStore.isAuthenticated && !authStore.isLoading) {
    await authStore.loadUser();
  }

  // Utilisateur connecté
  if (authStore.isAuthenticated) {
    if (to.path.startsWith('/auth') || to.path === '/app' || to.path === '/app/') {
      return navigateTo(authStore.isShipper ? '/app/us' : '/app/uc');
    }
  }

  // Utilisateur non connecté
  else {
    if (to.path.startsWith('/app')) {
      return navigateTo('/auth/login');
    }
  }
});
