import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();

  // Restaurer la session si nécessaire (attente async du chargement)
  if (!authStore.isAuthenticated && !authStore.isLoading) {
    await authStore.loadUser();
  }

  // Utilisateur connecté
  if (authStore.isAuthenticated) {
    // Ne peut pas accéder aux pages /auth/*
    if (to.path.startsWith('/auth') || to.path === '/app' || to.path === '/app/') {
      return navigateTo(authStore.isShipper ? '/app/us' : '/app/uc');
    }
  }

  // Utilisateur non connecté
  else {
    // Ne peut pas accéder aux pages /app/*
    if (to.path.startsWith('/app')) {
      return navigateTo('/auth/login');
    }
  }
});
