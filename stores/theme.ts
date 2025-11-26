import { defineStore } from 'pinia';

interface ThemeState {
  isDark: boolean;
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    isDark: false,
  }),

  getters: {
    theme: (state) => state.isDark ? 'dark' : 'light',
  },

  actions: {
    /**
     * Basculer entre mode clair et sombre
     */
    toggleTheme() {
      this.isDark = !this.isDark;
      this.applyTheme();
      this.saveTheme();
    },

    /**
     * Définir le thème
     */
    setTheme(isDark: boolean) {
      this.isDark = isDark;
      this.applyTheme();
      this.saveTheme();
    },

    /**
     * Appliquer le thème au DOM
     */
    applyTheme() {
      if (process.client) {
        if (this.isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },

    /**
     * Sauvegarder le thème dans le localStorage
     */
    saveTheme() {
      if (process.client) {
        localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
      }
    },

    /**
     * Restaurer le thème depuis le localStorage
     */
    restoreTheme() {
      if (process.client) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
          this.isDark = savedTheme === 'dark';
        } else {
          // Utiliser la préférence système par défaut
          this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        this.applyTheme();
      }
    },
  },
});
