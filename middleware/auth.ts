import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // Restaurer la session si nécessaire
  if (!authStore.isAuthenticated) {
    authStore.restoreSession();
  }

  // Si l'utilisateur n'est toujours pas authentifié, rediriger vers la page de connexion
  if (!authStore.isAuthenticated) {
    return navigateTo('/login');
  }
});
