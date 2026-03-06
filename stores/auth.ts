import { defineStore } from 'pinia';
import type { UserRole, AuthUser, AuthState, LoginResponse, RegisterResponse, RegisterData, ApiUser } from '~/types';
import { mapApiUserToAuthUser as mapUser } from '~/types/auth';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    lastConnectedRole: null,
    lastConnectedAt: null,
  }),

  getters: {
    currentUser: (state) => state.user,
    isShipper: (state) => state.user?.role === 'shipper',
    isCarrier: (state) => state.user?.role === 'carrier',
    userRole: (state) => state.user?.role,
  },

  actions: {
    /**
     * Charge l'utilisateur depuis les cookies (tokenCookie, roleCookie)
     * Appelé au démarrage de l'application
     */
    async loadUser() {
      const tokenCookie = useCookie('auth_token');
      const roleCookie = useCookie<UserRole | null>('auth_role');
      const lastRoleCookie = useCookie<UserRole | null>('last_connected_role');
      const lastAtCookie = useCookie<string | null>('last_connected_at');

      // Charger le dernier rôle connecté (pour l'UI des tabs)
      this.lastConnectedRole = lastRoleCookie.value;
      this.lastConnectedAt = lastAtCookie.value;

      // Si pas de token, pas d'utilisateur authentifié
      if (!tokenCookie.value || !roleCookie.value) {
        this.user = null;
        this.isAuthenticated = false;
        return { success: false, error: 'Aucune session active' };
      }

      // Charger les données utilisateur depuis l'API server
      this.isLoading = true;

      try {
        const response = await $fetch<{ user: ApiUser }>('/api/auth/me', {
          query: { role: roleCookie.value },
          headers: {
            'Authorization': `Bearer ${tokenCookie.value}`,
          },
        });

        if (response?.user) {
          this.user = mapUser(response.user);
          this.isAuthenticated = true;
          this.isLoading = false;
          return { success: true };
        } else {
          tokenCookie.value = null;
          roleCookie.value = null;
          this.user = null;
          this.isAuthenticated = false;
          this.isLoading = false;
          return { success: false, error: 'Session expirée' };
        }
      } catch (e) {
        this.user = null;
        this.isAuthenticated = false;
        this.isLoading = false;
        return { success: false, error: 'Erreur de chargement du profil' };
      }
    },

    /**
     * Connexion utilisateur
     */
    async login(email: string, password: string, role: UserRole, rememberMe: boolean = false) {
      this.isLoading = true;

      try {
        const responseData = await $fetch<LoginResponse>('/api/auth/login', {
          method: 'POST',
          body: { email, password, rememberMe, role },
        });

        this.isLoading = false;

        const { token, user: apiUser } = responseData;

        // Mapper l'utilisateur API vers le format frontend
        const user = mapUser(apiUser);

        // Stocker dans les cookies
        const tokenCookie = useCookie('auth_token', {
          maxAge: 60 * 60 * 24 * 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
        const roleCookie = useCookie<UserRole>('auth_role', {
          maxAge: 60 * 60 * 24 * 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
        const lastRoleCookie = useCookie<UserRole>('last_connected_role', {
          maxAge: 60 * 60 * 24 * 365,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
        const lastAtCookie = useCookie<string>('last_connected_at', {
          maxAge: 60 * 60 * 24 * 365,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });

        tokenCookie.value = token;
        roleCookie.value = user.role;
        lastRoleCookie.value = user.role;
        lastAtCookie.value = new Date().toISOString();

        // Mettre à jour le state
        this.user = user;
        this.isAuthenticated = true;
        this.lastConnectedRole = user.role;
        this.lastConnectedAt = lastAtCookie.value;

        return { success: true, user };
      } catch (error: any) {
        this.isLoading = false;

        let errorMessage = 'Erreur de connexion';
        const errorData = error?.data?.data || error?.data;

        if (errorData) {
          if (errorData.badCombo && typeof errorData.badCombo === 'object') {
            errorMessage = (errorData.badCombo as { message?: string }).message || errorMessage;
          } else if (errorData.message) {
            errorMessage = errorData.message as string;
          }
        } else if (error?.message && !error.message.startsWith('Erreur HTTP')) {
          errorMessage = error.message;
        }

        return { success: false, error: errorMessage };
      }
    },

    /**
     * Inscription utilisateur
     */
    async register(userData: RegisterData, role: UserRole) {
      this.isLoading = true;

      try {
        const responseData = await $fetch<RegisterResponse>('/api/auth/register', {
          method: 'POST',
          body: { ...userData, role },
        });

        this.isLoading = false;

        return {
          success: true,
          message: responseData.message || 'Inscription réussie. Vérifiez votre email.'
        };
      } catch (error: any) {
        this.isLoading = false;

        let errorMessage = 'Erreur lors de l\'inscription';
        const errorData = error?.data?.data || error?.data;

        if (errorData) {
          if (errorData.emailAlreadyInUse) {
            const emailError = errorData.emailAlreadyInUse;
            errorMessage = typeof emailError === 'object' && emailError !== null
              ? (emailError as { message?: string }).message || 'Cet email est déjà utilisé.'
              : 'Cet email est déjà utilisé.';
          } else if (errorData.passwordFormatInvalid) {
            const pwdError = errorData.passwordFormatInvalid;
            errorMessage = typeof pwdError === 'object' && pwdError !== null
              ? (pwdError as { message?: string }).message || 'Format de mot de passe invalide.'
              : typeof pwdError === 'string' ? pwdError : 'Format de mot de passe invalide.';
          } else if (errorData.invalidPhoneFormat) {
            const phoneError = errorData.invalidPhoneFormat;
            errorMessage = typeof phoneError === 'object' && phoneError !== null
              ? (phoneError as { message?: string }).message || 'Format de téléphone invalide.'
              : 'Format de téléphone invalide.';
          } else if (errorData.message) {
            errorMessage = errorData.message as string;
          }
        } else if (error?.message && !error.message.startsWith('Erreur HTTP')) {
          errorMessage = error.message;
        }

        return { success: false, error: errorMessage };
      }
    },

    /**
     * Déconnexion
     */
    async logout() {
      const role = this.user?.role;

      if (role) {
        try {
          await $fetch('/api/auth/logout', {
            method: 'POST',
            body: { role },
            headers: {
              'Authorization': `Bearer ${useCookie('auth_token').value}`,
            },
          });
        } catch (e) {
          // Ignorer les erreurs de logout
        }
      }

      // Supprimer les cookies de session
      const tokenCookie = useCookie('auth_token');
      const roleCookie = useCookie('auth_role');

      tokenCookie.value = null;
      roleCookie.value = null;

      // Réinitialiser le state
      this.user = null;
      this.isAuthenticated = false;

      // Arrêter le rafraîchissement des notifications
      const notificationStore = useNotificationStore();
      notificationStore.stopPolling();

      // Rediriger vers la page de connexion
      const router = useRouter();
      router.push('/auth/login');
    },

    /**
     * Restaurer la session depuis les cookies
     */
    restoreSession() {
      this.loadUser();
    },

    /**
     * Mettre à jour le profil utilisateur (pour compatibilité)
     */
    async updateProfile(updates: Partial<AuthUser>) {
      if (this.user) {
        this.user = { ...this.user, ...updates };
        return { success: true, user: this.user };
      }
      return { success: false, error: 'Utilisateur non connecté' };
    },
  },
});
