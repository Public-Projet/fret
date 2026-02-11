<template>
  <div class="container-custom py-12 max-w-4xl">
    <div class="card p-8 md:p-12">
      <HelpFaqHeader />
      <HelpFaqCategories :categories="categories" :activeCategory="activeCategory"
        @update:activeCategory="activeCategory = $event" />
      <HelpFaqList :faqs="filteredFaqs" />
      <HelpFaqContact />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const categories = ['Toutes', 'Général', 'Compte', 'Transport', 'Paiement', 'Sécurité'];
const activeCategory = ref('Toutes');

const faqs = [
  {
    category: 'Général',
    question: "Qu'est-ce que Bourse de Fret Bénin ?",
    answer: "Bourse de Fret Bénin est une plateforme digitale qui met en relation les expéditeurs (entreprises ou particuliers ayant des marchandises à transporter) avec des transporteurs professionnels vérifiés. Notre objectif est de simplifier et sécuriser le transport de marchandises au Bénin."
  },
  {
    category: 'Général',
    question: "La plateforme est-elle gratuite ?",
    answer: "L'inscription et la consultation des annonces sont gratuites. Nous proposons des plans payants pour les transporteurs professionnels souhaitant accéder à des fonctionnalités avancées comme la réponse illimitée aux annonces et le badge vérifié."
  },
  {
    category: 'Compte',
    question: "Comment créer un compte ?",
    answer: "Pour créer un compte, cliquez sur 'S'inscrire' en haut de la page et choisissez votre profil (Expéditeur ou Transporteur). Remplissez le formulaire avec vos informations et validez votre email. Votre compte sera actif immédiatement."
  },
  {
    category: 'Compte',
    question: "Comment devenir un transporteur vérifié ?",
    answer: "Pour obtenir le badge 'Vérifié', vous devez soumettre vos documents professionnels (licence de transport, assurance, pièce d'identité) depuis votre espace personnel. Notre équipe vérifie les documents sous 24-48h."
  },
  {
    category: 'Transport',
    question: "Comment publier une annonce de transport ?",
    answer: "Connectez-vous à votre compte, allez dans 'Mes annonces' et cliquez sur 'Nouvelle annonce'. Décrivez votre marchandise, les points de départ et d'arrivée, la date souhaitée et votre budget. Votre annonce sera visible par tous les transporteurs."
  },
  {
    category: 'Transport',
    question: "Comment répondre à une annonce ?",
    answer: "Les transporteurs Pro peuvent répondre aux annonces en cliquant sur 'Faire une offre'. Vous pouvez proposer votre prix, votre disponibilité et un message personnalisé. L'expéditeur recevra votre proposition et pourra vous contacter."
  },
  {
    category: 'Paiement',
    question: "Quels sont les moyens de paiement acceptés ?",
    answer: "Nous utilisons l'agragteur de paiements béninois Fedapay. Les moyens de paiement sont ceux définis par celui-ci. Pour le plan Entreprise, nous acceptons les virements bancaires.",
  },
  {
    category: 'Paiement',
    question: "Puis-je annuler mon abonnement ?",
    answer: "Oui, vous pouvez annuler votre abonnement à tout moment depuis vos paramètres de compte. L'abonnement restera actif jusqu'à la fin de la période payée."
  },
  {
    category: 'Sécurité',
    question: "Comment signaler un problème ou une fraude ?",
    answer: "Si vous rencontrez un comportement suspect, utilisez le bouton 'Signaler' sur le profil de l'utilisateur concerné ou contactez directement notre support via la page Contact. Nous traitons chaque signalement avec la plus grande attention."
  },
  {
    category: 'Sécurité',
    question: "Mes données personnelles sont-elles protégées ?",
    answer: "Absolument. Nous utilisons un cryptage SSL et respectons les meilleures pratiques en matière de protection des données. Vos informations ne sont jamais partagées avec des tiers sans votre consentement."
  }
];

const filteredFaqs = computed(() => {
  if (activeCategory.value === 'Toutes') {
    return faqs;
  }
  return faqs.filter(faq => faq.category === activeCategory.value);
});

useHead({
  title: 'FAQ'
});

definePageMeta({
  layout: 'guest'
});
</script>
