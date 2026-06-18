import { defineStore } from 'pinia';
import type { Partner, Testimonial, LegalPage, FaqCategory, FaqItem, SafetyItem, TeamMember, HelpCategory, HelpArticle, SocialLink, SiteContentState } from '~/types';

export const usePbcSiteContentStore = defineStore('pbcSiteContent', {
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
    // Récupérer la liste des partenaires
    async fetchPartners() {
      if (this.partners.length > 0) return;
      this.loading.partners = true;
      try {
        const res = await $fetch<{ data: Partner[] }>('/api/public/cms/ressource', { query: { resource: 'partners' } });
        if (res?.data) {
          this.partners = res.data;
        }
      } catch (e) {
        console.error('[siteContent] Erreur chargement partenaires:', e);
      } finally {
        this.loading.partners = false;
      }
    },

    // Récupérer la liste des témoignages
    async fetchTestimonials() {
      if (this.testimonials.length > 0) return;
      this.loading.testimonials = true;
      try {
        const res = await $fetch<{ data: Testimonial[] }>('/api/public/cms/ressource', { query: { resource: 'testimonials' } });
        if (res?.data) {
          this.testimonials = res.data;
        }
      } catch (e) {
        console.error('[siteContent] Erreur chargement témoignages:', e);
      } finally {
        this.loading.testimonials = false;
      }
    },

    // Récupérer la liste des membres de l'équipe
    async fetchTeam() {
      if (this.team.length > 0) return;
      this.loading.team = true;
      try {
        const res = await $fetch<{ data: TeamMember[] }>('/api/public/cms/ressource', { query: { resource: 'team' } });
        if (res?.data) {
          this.team = res.data;
        }
      } catch (e) {
        console.error('[siteContent] Erreur chargement équipe:', e);
      } finally {
        this.loading.team = false;
      }
    },

    // Récupérer la liste des catégories de FAQ
    async fetchFaqCategories() {
      if (this.faqCategories.length > 0) return;
      this.loading.faqCategories = true;
      try {
        const res = await $fetch<{ data: FaqCategory[] }>('/api/public/cms/ressource', { query: { resource: 'faq-category' } });
        if (res?.data) {
          this.faqCategories = res.data;
        }
      } catch (e) {
        console.error('[siteContent] Erreur chargement catégories FAQ:', e);
      } finally {
        this.loading.faqCategories = false;
      }
    },

    // Récupérer la liste des FAQ
    async fetchFaqs() {
      if (this.faqs.length > 0) return;
      this.loading.faqs = true;
      try {
        const res = await $fetch<{ data: FaqItem[] }>('/api/public/cms/ressource', { query: { resource: 'faq' } });
        if (res?.data) {
          this.faqs = res.data;
        }
      } catch (e) {
        console.error('[siteContent] Erreur chargement FAQ:', e);
      } finally {
        this.loading.faqs = false;
      }
    },

    // Récupérer la liste des contenus de sécurité
    async fetchSafetyItems() {
      if (this.safetyItems.length > 0) return;
      this.loading.safetyItems = true;
      try {
        const res = await $fetch<{ data: SafetyItem[] }>('/api/public/cms/ressource', { query: { resource: 'safety' } });
        if (res?.data) {
          this.safetyItems = res.data;
        }
      } catch (e) {
        console.error('[siteContent] Erreur chargement sécurité:', e);
      } finally {
        this.loading.safetyItems = false;
      }
    },

    // Récupérer les catégories et articles du centre d'aide
    async fetchHelp() {
      if (this.helpCategories.length > 0) return;
      this.loading.help = true;
      try {
        const res = await $fetch<{ data: HelpCategory[] }>('/api/public/cms/ressource', { query: { resource: 'help' } });
        if (res?.data) {
          this.helpCategories = res.data;
        }
      } catch (e) {
        console.error('[siteContent] Erreur chargement aide:', e);
      } finally {
        this.loading.help = false;
      }
    },

    // Récupérer la liste des liens sociaux
    async fetchSocialLinks() {
      if (this.socialLinks.length > 0) return;
      this.loading.socialLinks = true;
      try {
        const res = await $fetch<{ data: SocialLink[] }>('/api/public/cms/ressource', { query: { resource: 'social-links' } });
        if (res?.data) {
          this.socialLinks = res.data;
        }
      } catch (e) {
        console.error('[siteContent] Erreur chargement liens sociaux:', e);
      } finally {
        this.loading.socialLinks = false;
      }
    },

    // Récupérer un contenu légal par son slug
    async fetchLegalBySlug(slug: string) {
      if (this.legal[slug]) return this.legal[slug];
      this.loading.legal = true;
      try {
        const res = await $fetch<{ data: LegalPage }>(`/api/public/cms/legal`, { query: { slug } });
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

    // Récupérer un article par son slug
    async fetchArticleBySlug(slug: string) {
      this.loading.article = true;
      try {
        const res = await $fetch<{ data: HelpArticle }>(`/api/public/cms/article`, { query: { slug } });
        if (res?.data) {
          this.currentArticle = res.data;

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

    // Noter un article (like / dislike)
    async rateArticle(slug: string, action: 'like' | 'dislike') {
      try {
        const res = await $fetch<{ success: boolean; data: any }>(`/api/public/cms/rate-article`, {
          method: 'POST',
          body: { slug, action }
        });
        
        if (res?.success && this.currentArticle && this.currentArticle.slug === slug) {
          this.currentArticle.hasLiked = res.data.hasLiked;
          this.currentArticle.hasDisliked = res.data.hasDisliked;
          this.currentArticle.likesCount = res.data.likesCount;
          this.currentArticle.dislikesCount = res.data.dislikesCount;
        }
        return res;
      } catch (e) {
        console.error(`[siteContent] Erreur vote article ${slug}:`, e);
        throw e;
      }
    },
  },
});
