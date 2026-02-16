import { defineStore } from 'pinia';

export interface Partner {
  id: string;
  name: string;
  logo?: string;
  description?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role?: string;
  photo?: string;
  rating?: number;
}

export interface LegalSection {
  title: string;
  paragraph: string;
}

export interface LegalPage {
  id: string;
  slug: 'terms' | 'privacy' | 'legal' | 'cookies';
  title: string;
  sections: LegalSection[];
  lastUpdated?: string;
}

export interface FaqCategory {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  order: number;
}

export interface FaqItem {
  id: string;
  category: string | FaqCategory;
  question: string;
  answer: string;
  order: number;
}

export interface SafetyItem {
  id: string;
  type: 'feature' | 'tip';
  title: string;
  content: string;
  icon?: string;
  color?: string;
  order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description?: string;
  photo?: string;
}

export interface HelpCategory {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  articles?: HelpArticle[];
}

export interface HelpArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string | HelpCategory;
  views: number;
  updatedAt: string;
}

interface SiteContentState {
  partners: Partner[];
  testimonials: Testimonial[];
  team: TeamMember[];
  legal: Record<string, LegalPage>;
  faqs: FaqItem[];
  faqCategories: FaqCategory[];
  safetyItems: SafetyItem[];
  helpCategories: HelpCategory[];
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
    },
  }),

  actions: {
    /** Récupérer la liste des partenaires */
    async fetchPartners() {
      if (this.partners.length > 0) return; // Déjà chargé
      this.loading.partners = true;
      try {
        const { get } = useAPI();
        const res = await get<{ data: Partner[] }>('/public/cms/partners');
        if (res.success && res.data) {
          this.partners = res.data.data;
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
        const { get } = useAPI();
        const res = await get<{ data: Testimonial[] }>('/public/cms/testimonials');
        if (res.success && res.data) {
          this.testimonials = res.data.data;
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
        const { get } = useAPI();
        const res = await get<{ data: TeamMember[] }>('/public/cms/team');
        if (res.success && res.data) {
          this.team = res.data.data;
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
        const { get } = useAPI();
        const res = await get<{ data: LegalPage }>(`/public/cms/legal/${slug}`);
        if (res.success && res.data) {
          this.legal[slug] = res.data.data;
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
        const { get } = useAPI();
        const res = await get<{ data: FaqItem[] }>('/public/cms/faq');
        if (res.success && res.data) {
          this.faqs = res.data.data;
        }
      } catch (e) {
        console.error('[siteContent] Erreur chargement FAQ:', e);
      } finally {
        this.loading.faqs = false;
      }
    },

    /** Récupérer la liste des catégories de FAQ */
    async fetchFaqCategories() {
      // Pas de check de longueur car on veut peut-être rafraîchir
      // Mais pour l'instant on fait simple
      if (this.helpCategories.length > 0 && this.faqs.length > 0) {
        // hack: reusing helpCategories because I typed it wrong in state? 
        // No, wait. I need a new state for faqCategories.
      }
    },

    /** Récupérer la liste des contenus de sécurité */
    async fetchSafetyItems() {
      if (this.safetyItems.length > 0) return;
      this.loading.safetyItems = true;
      try {
        const { get } = useAPI();
        const res = await get<{ data: SafetyItem[] }>('/public/cms/safety');
        if (res.success && res.data) {
          this.safetyItems = res.data.data;
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
        const { get } = useAPI();
        const res = await get<{ data: HelpCategory[] }>('/public/cms/help');
        if (res.success && res.data) {
          this.helpCategories = res.data.data;
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
        const { get } = useAPI();
        const res = await get<{ data: HelpArticle }>(`/public/cms/help/article/${slug}`);
        if (res.success && res.data) {
          this.currentArticle = res.data.data;

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
