import { defineStore } from 'pinia';
import type { UserRole } from '~/types';
import type {
  AuthUser, AuthState, LoginResponse, RegisterResponse, RegisterData, mapApiUserToAuthUser
} from '~/types/auth';
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

      // On considère l'utilisateur authentifié si le token existe
      // Le backend validera le token à chaque requête
      this.isAuthenticated = true;

      return { success: true };
    },

    /**
     * Connexion utilisateur (appel API réel)
     */
    async login(email: string, password: string, role: UserRole) {
      this.isLoading = true;

      const api = useAPI();
      const endpoint = role === 'shipper'
        ? '/shipper/auth/login'
        : '/carrier/auth/login';

      const response = await api.post<LoginResponse>(endpoint, { email, password });

      this.isLoading = false;

      if (!response.success || !response.data) {
        // Extraire le message d'erreur de manière plus intelligente
        let errorMessage = 'Erreur de connexion';

        if (response.error?.data) {
          const errorData = response.error.data as Record<string, unknown>;
          // Chercher un message dans les différentes structures possibles
          if (errorData.badCombo && typeof errorData.badCombo === 'object') {
            errorMessage = (errorData.badCombo as { message?: string }).message || errorMessage;
          } else if (errorData.message) {
            errorMessage = errorData.message as string;
          }
        } else if (response.error?.message && !response.error.message.startsWith('Erreur HTTP')) {
          errorMessage = response.error.message;
        }

        return { success: false, error: errorMessage };
      }

      const { token, user: apiUser } = response.data;

      // Mapper l'utilisateur API vers le format frontend
      const user = mapUser(apiUser);

      // Stocker dans les cookies
      const tokenCookie = useCookie('auth_token', {
        maxAge: 60 * 60 * 24 * 7, // 7 jours
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      const roleCookie = useCookie<UserRole>('auth_role', {
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      const lastRoleCookie = useCookie<UserRole>('last_connected_role', {
        maxAge: 60 * 60 * 24 * 365, // 1 an - persistant
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
    },

    /**
     * Inscription utilisateur
     */
    async register(userData: RegisterData, role: UserRole) {
      this.isLoading = true;

      const api = useAPI();
      const endpoint = role === 'shipper'
        ? '/shipper/auth/register'
        : '/carrier/auth/register';

      const response = await api.post<RegisterResponse>(endpoint, userData);

      this.isLoading = false;

      if (!response.success || !response.data) {
        // Extraire le message d'erreur de manière plus intelligente
        let errorMessage = 'Erreur lors de l\'inscription';

        if (response.error?.data) {
          const errorData = response.error.data as Record<string, unknown>;

          // Chercher dans les différentes structures d'erreur possibles
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
        } else if (response.error?.message && !response.error.message.startsWith('Erreur HTTP')) {
          errorMessage = response.error.message;
        }

        return { success: false, error: errorMessage };
      }

      return {
        success: true,
        message: response.data.message || 'Inscription réussie. Vérifiez votre email.'
      };
    },

    /**
     * Déconnexion (appel API réel)
     */
    async logout() {
      const api = useAPI();
      const role = this.user?.role;

      if (role) {
        const endpoint = role === 'shipper'
          ? '/shipper/auth/logout'
          : '/carrier/auth/logout';
        await api.post(endpoint);
      }

      // Supprimer les cookies de session
      const tokenCookie = useCookie('auth_token');
      const roleCookie = useCookie('auth_role');

      tokenCookie.value = null;
      roleCookie.value = null;

      // Réinitialiser le state
      this.user = null;
      this.isAuthenticated = false;

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
