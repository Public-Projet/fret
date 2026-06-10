import { defineStore } from 'pinia';
import type { UserRole, AuthUser, AuthState, LoginResponse, RegisterResponse, RegisterData, ApiUser } from '~/types';
import { mapApiUserToAuthUser as mapUser } from '~/types/auth';

export const useCmnAuthStore = defineStore('cmnAuth', {
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
    // Inscription utilisateur
    async registerUser(userData: RegisterData, role: UserRole) {
      this.isLoading = true;

      try {
        const responseData = await $fetch<RegisterResponse>('/api/common/auth/register', {
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

    // Vérification de l'adresse email
    async verifyUserEmail(token: string, role: UserRole) {
      this.isLoading = true;
      try {
        const response = await $fetch<{ message: string }>('/api/common/auth/verify-email', {
          method: 'POST',
          body: { token, role },
        });
        this.isLoading = false;
        return { success: true, data: response };
      } catch (error: any) {
        this.isLoading = false;
        return {
          success: false,
          error: {
            message: error.data?.message || 'Erreur lors de la vérification',
            data: error.data?.data || error.data
          }
        };
      }
    },

    // Renvoyer l'email de vérification
    async resendUserVerificationEmail(email: string, role: UserRole) {
      this.isLoading = true;
      try {
        const response = await $fetch<{ message: string }>('/api/common/auth/resend-verification', {
          method: 'POST',
          body: { email, role },
        });
        this.isLoading = false;
        return { success: true, data: response };
      } catch (error: any) {
        this.isLoading = false;
        return {
          success: false,
          error: {
            message: error.data?.message || 'Erreur lors du renvoi de l\'email',
            data: error.data?.data || error.data
          }
        };
      }
    },

    // Connexion utilisateur
    async loginUser(email: string, password: string, role: UserRole, rememberMe: boolean = false) {
      this.isLoading = true;

      try {
        const responseData = await $fetch<LoginResponse>('/api/common/auth/login', {
          method: 'POST',
          body: { email, password, rememberMe, role },
        });

        this.isLoading = false;

        const { token, user: apiUser } = responseData;
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
          } else if (errorData.accountPending && typeof errorData.accountPending === 'object') {
            errorMessage = (errorData.accountPending as { message?: string }).message || 'Votre compte est en attente de validation.';
          } else if (errorData.accountSuspended && typeof errorData.accountSuspended === 'object') {
            errorMessage = (errorData.accountSuspended as { message?: string }).message || 'Votre compte est suspendu.';
          } else if (errorData.message) {
            errorMessage = errorData.message as string;
          }
        } else if (error?.message && !error.message.startsWith('Erreur HTTP')) {
          errorMessage = error.message;
        }

        return { success: false, error: errorMessage };
      }
    },

    // Demande de réinitialisation de mot de passe
    async forgotUserPassword(email: string, role: UserRole) {
      this.isLoading = true;
      try {
        const response = await $fetch<{ message: string } | string>('/api/common/auth/forgot-password', {
          method: 'POST',
          body: { email, role },
        });
        this.isLoading = false;
        return { success: true, data: response };
      } catch (error: any) {
        this.isLoading = false;
        return {
          success: false,
          error: {
            message: error.data?.message || 'Erreur lors de l\'envoi de l\'email',
            data: error.data?.data || error.data
          }
        };
      }
    },

    // Réinitialisation du mot de passe
    async resetUserPassword(token: string, password: string, role: UserRole) {
      this.isLoading = true;
      try {
        const response = await $fetch<{ message: string }>('/api/common/auth/reset-password', {
          method: 'POST',
          body: { token, password, role },
        });
        this.isLoading = false;
        return { success: true, data: response };
      } catch (error: any) {
        this.isLoading = false;
        return {
          success: false,
          error: {
            message: error.data?.message || 'Erreur lors de la réinitialisation',
            data: error.data?.data || error.data
          }
        };
      }
    },

    // Déconnexion
    async logoutUser(redirect: boolean = true) {
      const role = this.user?.role;

      if (role) {
        try {
          await $fetch('/api/common/auth/logout', {
            method: 'POST',
            body: { role },
            headers: {
              'Authorization': `Bearer ${useCookie('auth_token').value}`,
            },
          });
        } catch (e) { }
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
      const notificationStore = useCmnNotificationStore();
      notificationStore.stopPolling();

      // Notification de déconnexion
      const toastStore = useCmnToastStore();
      toastStore.addToast('Vous avez été déconnecté avec succès.', 'success');

      if (redirect) {
        // Rediriger vers la page de connexion
        const router = useRouter();
        router.push('/auth/login');
      }
    },

    // Charge l'utilisateur depuis les cookies (tokenCookie, roleCookie)
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
        const response = await $fetch<{ user: ApiUser }>('/api/common/profile/me', {
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

    // Restaurer la session depuis les cookies
    restoreSession() {
      this.loadUser();
    },

    // Mettre à jour le profil utilisateur
    async updateProfile(updates: Partial<AuthUser>) {
      if (this.user) {
        this.user = { ...this.user, ...updates };
        return { success: true, user: this.user };
      }
      return { success: false, error: 'Utilisateur non connecté' };
    },
  },
});
