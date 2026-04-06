// Types
export interface HelpArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categorySlug: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface HelpCategory {
  slug: string;
  title: string;
  description: string;
  icon: string;
  iconBg: string;
}

// Categories
export const helpCategories: HelpCategory[] = [
  {
    slug: 'compte',
    title: 'Mon Compte',
    description: 'Inscription, connexion, profil et paramètres',
    icon: 'IconUser',
    iconBg: 'bg-blue-500'
  },
  {
    slug: 'annonces',
    title: 'Publier une annonce',
    description: 'Créer et gérer vos offres de transport',
    icon: 'IconTruck',
    iconBg: 'bg-green-500'
  },
  {
    slug: 'paiements',
    title: 'Paiements & Facturation',
    description: 'Abonnements, factures et moyens de paiement',
    icon: 'IconCreditCard',
    iconBg: 'bg-purple-500'
  },
  {
    slug: 'securite',
    title: 'Sécurité & Vérification',
    description: 'Vérification de profil et sécurité des transactions',
    icon: 'IconShieldCheck',
    iconBg: 'bg-orange-500'
  },
  {
    slug: 'parametres',
    title: 'Paramètres',
    description: 'Notifications, préférences et confidentialité',
    icon: 'IconSettings',
    iconBg: 'bg-gray-500'
  },
  {
    slug: 'communication',
    title: 'Communication',
    description: 'Messagerie et contact avec les utilisateurs',
    icon: 'IconMessageCircle',
    iconBg: 'bg-teal-500'
  }
];

// Articles
export const helpArticles: HelpArticle[] = [
  // Catégorie: Compte
  {
    id: '1',
    slug: 'comment-creer-un-compte',
    title: 'Comment créer mon premier compte ?',
    excerpt: 'Apprenez à créer votre compte sur Bourse de Fret Bénin en quelques étapes simples.',
    content: `
## Créer votre compte

Pour créer un compte sur Bourse de Fret Bénin, suivez ces étapes :

### Étape 1 : Accéder à la page d'inscription
Cliquez sur le bouton **"S'inscrire"** en haut à droite de la page d'accueil.

### Étape 2 : Choisir votre profil
Sélectionnez votre type de compte :
- **Expéditeur** : Si vous avez des marchandises à faire transporter
- **Transporteur** : Si vous proposez des services de transport

### Étape 3 : Remplir le formulaire
Entrez vos informations personnelles :
- Nom complet
- Adresse email valide
- Numéro de téléphone
- Mot de passe sécurisé

### Étape 4 : Valider votre email
Un email de confirmation vous sera envoyé. Cliquez sur le lien pour activer votre compte.

> **Astuce** : Utilisez une adresse email professionnelle pour renforcer la confiance des autres utilisateurs.
    `,
    category: 'Mon Compte',
    categorySlug: 'compte',
    views: 47,
    createdAt: '2025-10-15',
    updatedAt: '2026-01-10'
  },
  {
    id: '2',
    slug: 'modifier-mon-profil',
    title: 'Comment modifier mon profil ?',
    excerpt: 'Mettez à jour vos informations personnelles et professionnelles.',
    content: `
## Modifier votre profil

Votre profil est votre vitrine sur la plateforme. Voici comment le personnaliser :

### Accéder aux paramètres du profil
1. Connectez-vous à votre compte
2. Cliquez sur votre avatar en haut à droite
3. Sélectionnez **"Mon profil"**

### Informations modifiables
- Photo de profil
- Nom et prénom
- Numéro de téléphone
- Adresse de l'entreprise
- Description de votre activité

### Conseils pour un bon profil
- Ajoutez une photo professionnelle
- Décrivez clairement vos services
- Gardez vos informations à jour
    `,
    category: 'Mon Compte',
    categorySlug: 'compte',
    views: 23,
    createdAt: '2025-11-02',
    updatedAt: '2026-01-05'
  },
  {
    id: '3',
    slug: 'reinitialiser-mot-de-passe',
    title: 'J\'ai oublié mon mot de passe',
    excerpt: 'Récupérez l\'accès à votre compte en réinitialisant votre mot de passe.',
    content: `
## Réinitialiser votre mot de passe

Si vous avez oublié votre mot de passe, suivez ces étapes :

### Étape 1 : Accéder à la page de connexion
Cliquez sur **"Se connecter"** puis sur **"Mot de passe oublié ?"**

### Étape 2 : Entrer votre email
Saisissez l'adresse email associée à votre compte.

### Étape 3 : Vérifier votre boîte mail
Vous recevrez un email avec un lien de réinitialisation valide pendant 24h.

### Étape 4 : Créer un nouveau mot de passe
Choisissez un mot de passe fort avec :
- Au moins 8 caractères
- Des lettres majuscules et minuscules
- Au moins un chiffre
- Un caractère spécial
    `,
    category: 'Mon Compte',
    categorySlug: 'compte',
    views: 76,
    createdAt: '2025-10-20',
    updatedAt: '2026-01-08'
  },

  // Catégorie: Annonces
  {
    id: '4',
    slug: 'publier-une-annonce',
    title: 'Comment publier une annonce de transport ?',
    excerpt: 'Guide complet pour créer et publier votre première annonce de fret.',
    content: `
## Publier une annonce de transport

### Avant de commencer
Assurez-vous d'avoir un compte expéditeur actif et vérifié.

### Étape 1 : Nouvelle annonce
Dans votre tableau de bord, cliquez sur **"Nouvelle annonce"**.

### Étape 2 : Décrire la marchandise
- Type de marchandise
- Poids estimé
- Dimensions (si applicable)

### Étape 3 : Itinéraire
- Adresse de départ
- Adresse de destination
- Date souhaitée de chargement
- Flexibilité sur les dates

### Étape 4 : Budget
- Prix proposé ou "Sur devis"
- Mode de paiement accepté

### Étape 5 : Publication
Vérifiez toutes les informations et cliquez sur **"Publier"**.

> Votre annonce sera visible par tous les transporteurs immédiatement.
    `,
    category: 'Publier une annonce',
    categorySlug: 'annonces',
    views: 56,
    createdAt: '2025-09-10',
    updatedAt: '2026-01-12'
  },
  {
    id: '5',
    slug: 'modifier-supprimer-annonce',
    title: 'Modifier ou supprimer une annonce',
    excerpt: 'Gérez vos annonces publiées : modification, mise en pause ou suppression.',
    content: `
## Gérer vos annonces

### Modifier une annonce
1. Accédez à **"Mes annonces"**
2. Cliquez sur l'annonce à modifier
3. Sélectionnez **"Modifier"**
4. Effectuez vos changements
5. Enregistrez

### Mettre en pause
Si vous ne souhaitez plus recevoir de propositions temporairement, mettez votre annonce en pause.

### Supprimer une annonce
> ⚠️ Cette action est irréversible

1. Allez dans **"Mes annonces"**
2. Cliquez sur les trois points (⋯)
3. Sélectionnez **"Supprimer"**
4. Confirmez la suppression
    `,
    category: 'Publier une annonce',
    categorySlug: 'annonces',
    views: 87,
    createdAt: '2025-11-15',
    updatedAt: '2026-01-03'
  },
  {
    id: '6',
    slug: 'repondre-annonce-transporteur',
    title: 'Comment répondre à une annonce (transporteur) ?',
    excerpt: 'Apprenez à faire des propositions attractives sur les annonces de fret.',
    content: `
## Répondre aux annonces

### Prérequis
- Compte transporteur actif
- Abonnement Pro (pour réponses illimitées)

### Faire une proposition
1. Parcourez les annonces disponibles
2. Cliquez sur une annonce qui vous intéresse
3. Cliquez sur **"Faire une offre"**

### Éléments de votre proposition
- **Prix** : Votre tarif tout compris
- **Disponibilité** : Date de chargement possible
- **Message** : Présentez-vous brièvement

### Conseils pour être sélectionné
- Répondez rapidement aux nouvelles annonces
- Proposez un prix compétitif
- Personnalisez votre message
- Maintenez un bon score d'évaluations
    `,
    category: 'Publier une annonce',
    categorySlug: 'annonces',
    views: 41,
    createdAt: '2025-10-01',
    updatedAt: '2026-01-11'
  },

  // Catégorie: Paiements
  {
    id: '7',
    slug: 'gerer-abonnement',
    title: 'Gérer mon abonnement Pro',
    excerpt: 'Modifier, annuler ou renouveler votre abonnement transporteur.',
    content: `
## Gestion de l'abonnement

### Voir mon abonnement actuel
Allez dans **Paramètres > Abonnement** pour voir :
- Votre plan actuel
- Date de renouvellement
- Historique des paiements

### Changer de plan
Vous pouvez upgrader ou downgrader votre plan à tout moment.

### Annuler l'abonnement
1. Accédez aux paramètres d'abonnement
2. Cliquez sur **"Annuler l'abonnement"**
3. Confirmez votre choix

> Votre accès Pro reste actif jusqu'à la fin de la période payée.

### Facturation
Les factures sont disponibles au format PDF dans votre espace personnel.
    `,
    category: 'Paiements & Facturation',
    categorySlug: 'paiements',
    views: 92,
    createdAt: '2025-12-01',
    updatedAt: '2026-01-09'
  },

  // Catégorie: Sécurité
  {
    id: '8',
    slug: 'devenir-transporteur-verifie',
    title: 'Comment devenir transporteur vérifié ?',
    excerpt: 'Obtenez le badge vérifié et gagnez la confiance des expéditeurs.',
    content: `
## Badge Transporteur Vérifié

### Avantages du badge
- Visibilité accrue
- Confiance des expéditeurs
- Accès prioritaire aux annonces

### Documents requis
1. **Pièce d'identité** (CNI ou passeport)
2. **Licence de transport** en cours de validité
3. **Attestation d'assurance** 
4. **Photo du véhicule** (optionnel)

### Processus de vérification
1. Téléchargez vos documents depuis votre profil
2. Notre équipe vérifie sous 24-48h
3. Recevez une notification de validation
4. Le badge apparaît sur votre profil

### En cas de refus
Vous recevrez un email expliquant les raisons et comment régulariser votre situation.
    `,
    category: 'Sécurité & Vérification',
    categorySlug: 'securite',
    views: 89,
    createdAt: '2025-09-25',
    updatedAt: '2026-01-10'
  },
  {
    id: '10',
    slug: 'signaler-probleme',
    title: 'Comment signaler un problème ou une fraude ?',
    excerpt: 'Protégez-vous et la communauté en signalant les comportements suspects.',
    content: `
## Signaler un problème

### Quand signaler ?
- Comportement suspect d'un utilisateur
- Tentative d'arnaque
- Contenu inapproprié
- Non-respect des engagements

### Comment signaler ?
1. Sur le profil de l'utilisateur, cliquez sur **"Signaler"**
2. Choisissez le motif du signalement
3. Décrivez la situation en détail
4. Joignez des preuves si possible (captures d'écran)

### Que se passe-t-il ensuite ?
- Notre équipe examine le signalement sous 24h
- Des mesures sont prises si nécessaire
- Vous êtes informé du résultat

### Urgence
Pour les situations urgentes, contactez-nous directement par email ou téléphone.
    `,
    category: 'Sécurité & Vérification',
    categorySlug: 'securite',
    views: 34,
    createdAt: '2025-10-10',
    updatedAt: '2026-01-06'
  },

  // Catégorie: Paramètres
  {
    id: '11',
    slug: 'gerer-notifications',
    title: 'Gérer mes notifications',
    excerpt: 'Personnalisez les alertes que vous recevez par email et sur l\'application.',
    content: `
## Paramètres de notifications

### Types de notifications
- **Email** : Récapitulatifs et alertes importantes
- **Push** : Notifications en temps réel
- **SMS** : Alertes urgentes (optionnel)

### Personnaliser vos préférences
Allez dans **Paramètres > Notifications** pour activer/désactiver :
- Nouvelles offres sur vos annonces
- Messages reçus
- Rappels de transport
- Newsletter et promotions

### Fréquence des emails
Choisissez entre :
- Instantané
- Récapitulatif quotidien
- Récapitulatif hebdomadaire
    `,
    category: 'Paramètres',
    categorySlug: 'parametres',
    views: 56,
    createdAt: '2025-11-25',
    updatedAt: '2026-01-04'
  },

  // Catégorie: Communication
  {
    id: '12',
    slug: 'contacter-transporteur',
    title: 'Comment contacter un transporteur ?',
    excerpt: 'Utilisez la messagerie intégrée pour échanger en toute sécurité.',
    content: `
## Contacter un transporteur

### Via une offre reçue
Quand un transporteur répond à votre annonce :
1. Consultez son offre
2. Cliquez sur **"Répondre"**
3. Discutez des détails

### Via son profil
1. Accédez au profil du transporteur
2. Cliquez sur **"Contacter"**
3. Rédigez votre message

### Bonnes pratiques
- Restez sur la messagerie de la plateforme
- Soyez clair et précis
- Répondez dans les meilleurs délais
- Ne partagez pas vos coordonnées personnelles trop tôt

### Historique des conversations
Toutes vos conversations sont conservées et accessibles dans **"Messages"**.
    `,
    category: 'Communication',
    categorySlug: 'communication',
    views: 87,
    createdAt: '2025-10-05',
    updatedAt: '2026-01-11'
  }
];

// Helpers
export const getArticlesByCategory = (categorySlug: string): HelpArticle[] => {
  return helpArticles.filter(article => article.categorySlug === categorySlug);
};

export const getArticleBySlug = (slug: string): HelpArticle | undefined => {
  return helpArticles.find(article => article.slug === slug);
};

export const getCategoryBySlug = (slug: string): HelpCategory | undefined => {
  return helpCategories.find(category => category.slug === slug);
};

export const getPopularArticles = (limit: number = 5): HelpArticle[] => {
  return [...helpArticles]
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
};

export const searchArticles = (query: string): HelpArticle[] => {
  const lowerQuery = query.toLowerCase();
  return helpArticles.filter(article =>
    article.title.toLowerCase().includes(lowerQuery) ||
    article.excerpt.toLowerCase().includes(lowerQuery) ||
    article.content.toLowerCase().includes(lowerQuery)
  );
};

export const getArticleCountByCategory = (categorySlug: string): number => {
  return helpArticles.filter(article => article.categorySlug === categorySlug).length;
};
