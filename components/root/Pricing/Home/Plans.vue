<template>
  <div class="container-custom pb-24">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
      <div
        v-for="plan in PLANS"
        :key="plan.id"
        :class="[
          'relative h-full flex flex-col',
          plan.isPopular ? 'transform md:-translate-y-4' : 'group'
        ]"
      >
        <!-- Background element -->
        <div
          v-if="plan.isPopular"
          class="absolute inset-0 bg-gradient-to-r from-primary-500 to-blue-600 rounded-3xl blur-sm opacity-70"
        ></div>
        <div
          v-else
          class="absolute inset-0 bg-gradient-to-b from-gray-200 to-transparent dark:from-gray-700 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        ></div>

        <!-- Card Body -->
        <div
          :class="[
            'relative p-8 rounded-3xl border h-full flex flex-col transition-all duration-300',
            plan.isPopular
              ? 'bg-white dark:bg-gray-900 border-primary-500/30 shadow-2xl'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl'
          ]"
        >
          <!-- Popular Badge -->
          <div
            v-if="plan.isPopular"
            class="absolute top-0 right-0 bg-gradient-to-r from-primary-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-3xl"
          >
            POPULAIRE
          </div>

          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ plan.name }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 h-10">{{ plan.description }}</p>

          <!-- Pricing Section -->
          <div class="flex items-baseline mb-6">
            <template v-if="plan.id === 'free'">
              <span class="text-4xl font-extrabold text-gray-900 dark:text-white">Gratuit</span>
            </template>
            <template v-else-if="plan.id === 'pro'">
              <span class="text-4xl font-extrabold text-gray-900 dark:text-white">
                {{ isAnnual ? '15.000' : '18.750' }}
              </span>
              <span class="text-lg text-gray-500 dark:text-gray-400 ml-1">FCFA</span>
              <span class="text-sm text-gray-400 ml-2">/ mois</span>
            </template>
            <template v-else-if="plan.id === 'enterprise'">
              <span class="text-4xl font-extrabold text-gray-900 dark:text-white">Sur devis</span>
            </template>
          </div>

          <!-- Billing Info (Pro only) -->
          <template v-if="plan.id === 'pro'">
            <p class="text-xs text-green-600 dark:text-green-400 font-medium mb-6" v-if="isAnnual">
              Facturé 180.000 FCFA par an (2 mois offerts)
            </p>
            <p class="text-xs text-gray-400 font-medium mb-6" v-else>
              Facturation mensuelle sans engagement
            </p>
          </template>

          <!-- Buttons -->
          <!-- Free Button -->
          <template v-if="plan.id === 'free'">
            <button
              v-if="authStore.isAuthenticated && (authStore.user?.subscriptionPlan === 'free' || !authStore.user?.subscriptionPlan)"
              disabled
              class="w-full btn bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 border-none rounded-xl py-3 font-semibold mb-8 cursor-not-allowed"
            >
              Votre offre actuelle
            </button>
            <NuxtLink
              v-else-if="!authStore.isAuthenticated"
              to="/auth/register"
              class="w-full btn bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white border-none rounded-xl py-3 font-semibold mb-8"
            >
              Commencer
            </NuxtLink>
            <button
              v-else
              disabled
              class="w-full btn bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 border-none rounded-xl py-3 font-semibold mb-8 cursor-not-allowed"
            >
              Inclus
            </button>
          </template>

          <!-- Pro Button -->
          <template v-else-if="plan.id === 'pro'">
            <button
              v-if="proButtonState.disabled"
              disabled
              class="w-full btn bg-green-500 text-white border-none rounded-xl py-3 font-bold mb-8 cursor-not-allowed"
            >
              ✓ {{ proButtonState.text }}
            </button>
            <button
              v-else
              @click="handleSubscribe"
              :disabled="isLoading"
              class="w-full btn btn-primary rounded-xl py-3 font-bold shadow-lg shadow-primary-500/30 mb-8 transform transition-transform hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              <IconLoader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
              <span>{{ proButtonState.text }}</span>
            </button>
            <p v-if="errorMsg" class="text-xs text-red-500 text-center mb-4">{{ errorMsg }}</p>
          </template>

          <!-- Enterprise Button -->
          <template v-else-if="plan.id === 'enterprise'">
            <NuxtLink
              to="/support/contact"
              class="w-full btn bg-white dark:bg-transparent border-2 border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl py-3 font-semibold mb-8"
            >
              Contacter l'équipe
            </NuxtLink>
          </template>

          <!-- Features List -->
          <ul class="space-y-4 mb-8 flex-1">
            <li v-for="(feature, fIndex) in plan.features" :key="fIndex" class="flex items-start">
              <IconCheck :class="['w-5 h-5 mr-3 flex-shrink-0', plan.iconColorClass]" />
              <span
                :class="[
                  'text-sm text-gray-600 dark:text-gray-300',
                  plan.id === 'pro' && fIndex === 1 ? 'font-medium' : ''
                ]"
              >
                {{ feature }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IconCheck, IconLoader2 } from '@tabler/icons-vue';
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
