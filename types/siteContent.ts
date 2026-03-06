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
