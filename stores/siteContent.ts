import { defineStore } from 'pinia';
import type { Partner, Testimonial, LegalPage, FaqCategory, FaqItem, SafetyItem, TeamMember, HelpCategory, HelpArticle, SocialLink } from '~/types';

interface SiteContentState {
  partners: Partner[];
  testimonials: Testimonial[];
  team: TeamMember[];
  legal: Record<string, LegalPage>;
  faqs: FaqItem[];
  faqCategories: FaqCategory[];
  safetyItems: SafetyItem[];
  helpCategories: HelpCategory[];
  socialLinks: SocialLink[];
  currentArticle: HelpArticle | null;
  loading: {
    partners: boolean;
    testimonials: boolean;
    team: boolean;
    legal: boolean;
    faqs: boolean;
    faqCategories: boolean;
    safetyItems: boolean;
    help: boolean;
    article: boolean;
    socialLinks: boolean;
  };
}

// --- Helpers ---

/** Génère les initiales à partir d'un nom complet */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

/** Palette de couleurs pour les avatars de fallback */
const AVATAR_COLORS = [
  'bg-gradient-to-br from-blue-500 to-blue-700',
  'bg-gradient-to-br from-green-500 to-green-700',
  'bg-gradient-to-br from-yellow-500 to-yellow-700',
  'bg-gradient-to-br from-purple-500 to-purple-700',
  'bg-gradient-to-br from-pink-500 to-pink-700',
  'bg-gradient-to-br from-indigo-500 to-indigo-700',
  'bg-gradient-to-br from-teal-500 to-teal-700',
];

/** Retourne une classe de couleur d'avatar déterministe basée sur l'index */
export function getAvatarClass(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

/** Palette de couleurs pour le rôle */
const ROLE_COLORS = [
  'text-blue-600 dark:text-blue-400',
  'text-green-600 dark:text-green-400',
  'text-purple-600 dark:text-purple-400',
  'text-indigo-600 dark:text-indigo-400',
  'text-pink-600 dark:text-pink-400',
  'text-teal-600 dark:text-teal-400',
];

export function getRoleClass(index: number): string {
  return ROLE_COLORS[index % ROLE_COLORS.length];
}

// --- Store ---

export const useSiteContentStore = defineStore('siteContent', {
  state: (): SiteContentState => ({
    partners: [],
    testimonials: [],
    team: [],
    legal: {},
    faqs: [],
    faqCategories: [],
    safetyItems: [],
    helpCategories: [],
    socialLinks: [],
    currentArticle: null,
    loading: {
      partners: false,
      testimonials: false,
      team: false,
      legal: false,
      faqs: false,
      faqCategories: false,
      safetyItems: false,
      help: false,
      article: false,
      socialLinks: false,
    },
  }),

  actions: {
    /** Récupérer la liste des liens sociaux */
    async fetchSocialLinks() {
      if (this.socialLinks.length > 0) return;
      this.loading.socialLinks = true;
      try {
        const res = await $fetch<{ data: SocialLink[] }>('/api/cms', { query: { resource: 'social-links' } });
        if (res?.data) {
          this.socialLinks = res.data;
        }
      } catch (e) {
        console.error('[siteContent] Erreur chargement liens sociaux:', e);
      } finally {
        this.loading.socialLinks = false;
      }
    },

    /** Récupérer la liste des partenaires */
    async fetchPartners() {
      if (this.partners.length > 0) return;
      this.loading.partners = true;
      try {
        const res = await $fetch<{ data: Partner[] }>('/api/cms', { query: { resource: 'partners' } });
        if (res?.data) {
          this.partners = res.data;
        }
      } catch (e) {
        console.error('[siteContent] Erreur chargement partenaires:', e);
      } finally {
        this.loading.partners = false;
      }
    },

    /** Récupérer la liste des témoignages */
    async fetchTestimonials() {
      if (this.testimonials.length > 0) return;
      this.loading.testimonials = true;
      try {
        const res = await $fetch<{ data: Testimonial[] }>('/api/cms', { query: { resource: 'testimonials' } });
        if (res?.data) {
          this.testimonials = res.data;
        }
      } catch (e) {
        console.error('[siteContent] Erreur chargement témoignages:', e);
      } finally {
        this.loading.testimonials = false;
      }
    },

    /** Récupérer la liste des membres de l'équipe */
    async fetchTeam() {
      if (this.team.length > 0) return;
      this.loading.team = true;
      try {
        const res = await $fetch<{ data: TeamMember[] }>('/api/cms', { query: { resource: 'team' } });
        if (res?.data) {
          this.team = res.data;
        }
      } catch (e) {
        console.error('[siteContent] Erreur chargement équipe:', e);
      } finally {
        this.loading.team = false;
      }
    },

    /** Récupérer un contenu légal par son slug */
    async fetchLegalBySlug(slug: string) {
      if (this.legal[slug]) return this.legal[slug];
      this.loading.legal = true;
      try {
        const res = await $fetch<{ data: LegalPage }>(`/api/cms/legal/${slug}`);
        if (res?.data) {
          this.legal[slug] = res.data;
          return this.legal[slug];
        }
      } catch (e) {
        console.error(`[siteContent] Erreur chargement page légale ${slug}:`, e);
      } finally {
        this.loading.legal = false;
      }
      return null;
    },

    /** Récupérer la liste des FAQ */
    async fetchFaqs() {
      if (this.faqs.length > 0) return;
      this.loading.faqs = true;
      try {
        const res = await $fetch<{ data: FaqItem[] }>('/api/cms', { query: { resource: 'faq' } });
        if (res?.data) {
          this.faqs = res.data;
        }
      } catch (e) {
        console.error('[siteContent] Erreur chargement FAQ:', e);
      } finally {
        this.loading.faqs = false;
      }
    },

    /** Récupérer la liste des catégories de FAQ */
    async fetchFaqCategories() {
      // Placeholder — pas encore implémenté côté backend
    },

    /** Récupérer la liste des contenus de sécurité */
    async fetchSafetyItems() {
      if (this.safetyItems.length > 0) return;
      this.loading.safetyItems = true;
      try {
        const res = await $fetch<{ data: SafetyItem[] }>('/api/cms', { query: { resource: 'safety' } });
        if (res?.data) {
          this.safetyItems = res.data;
        }
      } catch (e) {
        console.error('[siteContent] Erreur chargement sécurité:', e);
      } finally {
        this.loading.safetyItems = false;
      }
    },

    /** Récupérer les catégories et articles du centre d'aide */
    async fetchHelp() {
      if (this.helpCategories.length > 0) return;
      this.loading.help = true;
      try {
        const res = await $fetch<{ data: HelpCategory[] }>('/api/cms', { query: { resource: 'help' } });
        if (res?.data) {
          this.helpCategories = res.data;
        }
      } catch (e) {
        console.error('[siteContent] Erreur chargement aide:', e);
      } finally {
        this.loading.help = false;
      }
    },

    /** Récupérer un article par son slug */
    async fetchArticleBySlug(slug: string) {
      this.loading.article = true;
      try {
        const res = await $fetch<{ data: HelpArticle }>(`/api/cms/help/article/${slug}`);
        if (res?.data) {
          this.currentArticle = res.data;

          // Mettre à jour l'article dans la liste des catégories pour synchroniser les vues
          const articleId = this.currentArticle.id;
          this.helpCategories.forEach(cat => {
            if (cat.articles) {
              const artIndex = cat.articles.findIndex(a => a.id === articleId);
              if (artIndex !== -1) {
                // @ts-ignore - on met à jour partiellement pour les vues
                cat.articles[artIndex].views = this.currentArticle?.views;
              }
            }
          });

          return this.currentArticle;
        }
      } catch (e) {
        console.error(`[siteContent] Erreur chargement article ${slug}:`, e);
      } finally {
        this.loading.article = false;
      }
      return null;
    },
  },
});
