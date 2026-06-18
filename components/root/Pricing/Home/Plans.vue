<template>
  <div class="container-custom pb-24">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
      <RootPricingHomePlanCard
        v-for="plan in PLANS"
        :key="plan.id"
        :plan="plan"
        :is-annual="isAnnual"
        :pro-button-state="proButtonState"
        :is-loading="isLoading"
        :error-msg="errorMsg"
        @subscribe="handleSubscribe"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { useRouter } from '#app';

interface Plan {
  id: 'free' | 'pro' | 'enterprise';
  name: string;
  description: string;
  iconColorClass: string;
  features: string[];
  isPopular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Découverte',
    description: 'Idéal pour les expéditeurs occasionnels.',
    iconColorClass: 'text-green-500',
    features: [
      'Accès aux annonces publiques',
      "Publier jusqu'à 3 annonces/mois",
      'Support par email basique'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Pour les professionnels du transport actif.',
    iconColorClass: 'text-primary-500',
    features: [
      'Toutes les options gratuites',
      'Répondre aux annonces en illimité',
      'Profil vérifié ("Badge Pro")',
      'Notifications instantanées prioritaires'
    ],
    isPopular: true
  },
  {
    id: 'enterprise',
    name: 'Entreprise',
    description: 'Pour les flottes et grandes logistiques.',
    iconColorClass: 'text-blue-500',
    features: [
      'Multi-utilisateurs & Gestion de flotte',
      "API d'intégration TMS",
      'Gestionnaire de compte dédié',
      'Facturation centralisée'
    ]
  }
];

const props = defineProps<{
  isAnnual: boolean;
}>();

const authStore = useCmnAuthStore();
const router = useRouter();
const isLoading = ref(false);
const errorMsg = ref('');

const proButtonState = computed(() => {
  if (!authStore.isAuthenticated) {
    return { disabled: false, text: "Commencer" };
  }

  const user = authStore.user;
  if (user?.subscriptionPlan === 'pro' && user?.subscriptionStatus === 'active') {
    if (props.isAnnual) {
      if (user.subscriptionType === 'annual') {
        return { disabled: false, text: "Prolonger d'un an" };
      } else {
        return { disabled: false, text: "Passer à l'annuel" };
      }
    } else {
      if (user.subscriptionType === 'annual') {
        return { disabled: true, text: "Offre annuelle en cours" };
      } else {
        return { disabled: false, text: "Prolonger d'un mois" };
      }
    }
  }

  return { disabled: false, text: "Devenir Pro" };
});

async function handleSubscribe() {
  if (!authStore.isAuthenticated) {
    return router.push('/auth/login?redirect=/pricing');
  }

  isLoading.value = true;
  errorMsg.value = '';

  try {
    const response = await $fetch<{ checkoutUrl: string }>('/api/common/subscription/checkout', {
      method: 'POST',
      body: {
        plan: 'pro',
        billing: props.isAnnual ? 'annual' : 'monthly'
      }
    });

    if (response && response.checkoutUrl) {
      window.location.href = response.checkoutUrl;
    } else {
      throw new Error('URL de redirection de paiement non reçue.');
    }
  } catch (err: any) {
    console.error(err);
    errorMsg.value = err.data?.message || 'Erreur lors du lancement de la transaction.';
    isLoading.value = false;
  }
}
</script>
