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
    if (to.path.startsWith('/auth') || to.path === '/app' || to.path === '/app/') {
      return navigateTo(authStore.isShipper ? '/app/shipper' : '/app/carrier');
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
