import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // Restaurer la session si nécessaire
  if (!authStore.isAuthenticated) {
    authStore.restoreSession();
  }

  // Utilisateur connecté
  if (authStore.isAuthenticated) {
    // Ne peut pas accéder aux pages /auth/*
    if (to.path.startsWith('/auth')) {
      return navigateTo('/app');
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
