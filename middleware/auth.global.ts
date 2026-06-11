import { useCmnAuthStore } from '~/stores/cmnAuth';

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useCmnAuthStore();

  // Lire le rôle ou le token depuis le cookie
  const tokenCookie = useCookie('auth_token');
  const roleCookie = useCookie('auth_role');
  const hasToken = process.server ? !!tokenCookie.value : !!roleCookie.value;

  // Si déjà authentifié dans le store → utiliser le state actuel
  const isAuthenticated = authStore.isAuthenticated || hasToken;

  // Utilisateur connecté (ou token présent)
  if (isAuthenticated) {
    if (to.path.startsWith('/auth') || to.path === '/app' || to.path === '/app/') {
      const redirect = to.query.redirect as string;
      if (redirect && redirect.startsWith('/')) {
        return navigateTo(redirect);
      }
      return navigateTo(authStore.isShipper ? '/app/us' : '/app/uc');
    }
  }

  // Utilisateur non connecté
  else {
    if (to.path.startsWith('/app')) {
      return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`);
    }
  }
});
