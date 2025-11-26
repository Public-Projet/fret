import { defineStore } from 'pinia';
import type { User, UserRole } from '~/types';
import { mockUsers } from '~/data/mock';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
  }),

  getters: {
    currentUser: (state) => state.user,
    isShipper: (state) => state.user?.role === 'shipper',
    isCarrier: (state) => state.user?.role === 'carrier',
    userRole: (state) => state.user?.role,
  },

  actions: {
    /**
     * Connexion utilisateur (mock)
     */
    async login(email: string, password: string) {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Recherche de l'utilisateur dans les données mockées
      const user = mockUsers.find(u => u.email === email);

      if (user) {
        this.user = user;
        this.isAuthenticated = true;

        // Sauvegarde dans le localStorage
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(user));
        }

        return { success: true, user };
      }

      return { success: false, error: 'Email ou mot de passe incorrect' };
    },

    /**
     * Inscription utilisateur (mock)
     */
    async register(userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role: UserRole;
      company?: string;
      phone: string;
    }) {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 800));

      // Vérifier si l'email existe déjà
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        return { success: false, error: 'Cet email est déjà utilisé' };
      }

      // Créer un nouvel utilisateur
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        company: userData.company,
        phone: userData.phone,
        rating: 0,
        reviewCount: 0,
        verified: false,
        createdAt: new Date().toISOString(),
      };

      // Ajouter l'utilisateur aux données mockées
      mockUsers.push(newUser);

      this.user = newUser;
      this.isAuthenticated = true;

      // Sauvegarde dans le localStorage
      if (process.client) {
        localStorage.setItem('user', JSON.stringify(newUser));
      }

      return { success: true, user: newUser };
    },

    /**
     * Déconnexion
     */
    logout() {
      this.user = null;
      this.isAuthenticated = false;

      if (process.client) {
        localStorage.removeItem('user');
      }
    },

    /**
     * Restaurer la session depuis le localStorage
     */
    restoreSession() {
      if (process.client) {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            this.user = JSON.parse(savedUser);
            this.isAuthenticated = true;
          } catch (error) {
            console.error('Erreur lors de la restauration de la session:', error);
            localStorage.removeItem('user');
          }
        }
      }
    },

    /**
     * Mettre à jour le profil utilisateur
     */
    async updateProfile(updates: Partial<User>) {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 500));

      if (this.user) {
        this.user = { ...this.user, ...updates };

        if (process.client) {
          localStorage.setItem('user', JSON.stringify(this.user));
        }

        return { success: true, user: this.user };
      }

      return { success: false, error: 'Utilisateur non connecté' };
    },
  },
});
