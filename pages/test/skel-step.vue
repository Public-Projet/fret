<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto space-y-12">
      <!-- En-tête -->
      <div class="text-center space-y-4">
        <h1 class="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          Playground des composants UI dynamiques
        </h1>
        <p class="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">
          Démonstration et vérification visuelle des composants <code
            class="text-primary-600 dark:text-primary-400">AppSkeleton</code> et <code
            class="text-primary-600 dark:text-primary-400">StepLoading</code>.
        </p>
      </div>

      <!-- SECTION 1: APP SKELETON -->
      <section
        class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-gray-700/80 p-8 shadow-xl">
        <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-gray-700">
          <h2 class="text-2xl font-black text-gray-900 dark:text-white flex items-center">
            <span class="p-2.5 bg-primary-50 dark:bg-primary-900/30 rounded-xl text-primary-600 mr-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z">
                </path>
              </svg>
            </span>
            Composant : AppSkeleton.vue
          </h2>
          <!-- Toggle Simulation -->
          <button @click="skeletonLoading = !skeletonLoading"
            class="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-black rounded-xl shadow-lg shadow-primary-500/20 active:scale-95 transition-all">
            {{ skeletonLoading ? 'Afficher le vrai contenu' : 'Simuler le chargement' }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Modèles de formes prédéfinis -->
          <div class="space-y-6">
            <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest">Formes & Types</h3>
            <div class="space-y-4">
              <div>
                <span class="text-[10px] font-bold text-gray-400 block mb-1">Type: Heading</span>
                <UiAppSkeleton type="heading" />
              </div>
              <div>
                <span class="text-[10px] font-bold text-gray-400 block mb-1">Type: Text (count: 3)</span>
                <UiAppSkeleton type="text" :count="3" gap="2" />
              </div>
              <div class="flex items-center space-x-4">
                <div>
                  <span class="text-[10px] font-bold text-gray-400 block mb-1">Type: Avatar</span>
                  <UiAppSkeleton type="avatar" />
                </div>
                <div>
                  <span class="text-[10px] font-bold text-gray-400 block mb-1">Type: Circle</span>
                  <UiAppSkeleton type="circle" width="50px" height="50px" />
                </div>
                <div>
                  <span class="text-[10px] font-bold text-gray-400 block mb-1">Type: Square</span>
                  <UiAppSkeleton type="square" width="50px" height="50px" />
                </div>
              </div>
              <div>
                <span class="text-[10px] font-bold text-gray-400 block mb-1">Type: Rectangle</span>
                <UiAppSkeleton type="rectangle" />
              </div>
              <div>
                <span class="text-[10px] font-bold text-gray-400 block mb-1">Type: Table-Row</span>
                <UiAppSkeleton type="table-row" />
              </div>
            </div>
          </div>

          <!-- Wrapper de contenu réel et animations -->
          <div class="space-y-6">
            <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest">Wrapper & Type Image</h3>

            <div class="space-y-4">
              <!-- Type image avec icône -->
              <div>
                <span class="text-[10px] font-bold text-gray-400 block mb-2">Type: Image (avec icône intégrée)</span>
                <UiAppSkeleton type="image" />
              </div>

              <!-- Exemple de carte complète avec chargement conditionnel -->
              <div>
                <span class="text-[10px] font-bold text-gray-400 block mb-2">Exemple concret : Wrapper
                  Conditionnel</span>
                <UiAppSkeleton :loading="skeletonLoading" type="card">
                  <!-- Contenu réel affiché après chargement -->
                  <div
                    class="p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-[2rem] border border-gray-700 shadow-xl flex items-center justify-between">
                    <div class="space-y-2">
                      <div
                        class="inline-flex px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">
                        Véhicule Disponible
                      </div>
                      <h4 class="text-xl font-bold">Volvo FH16 (AB-123-CD)</h4>
                      <p class="text-xs text-gray-400">Trajet: Cotonou → Parakou</p>
                    </div>
                    <div class="text-right">
                      <span class="text-2xl font-black text-emerald-400">250 000 FCFA</span>
                    </div>
                  </div>
                </UiAppSkeleton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 2: STEP LOADING -->
      <section
        class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-gray-700/80 p-8 shadow-xl">
        <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-gray-700">
          <h2 class="text-2xl font-black text-gray-900 dark:text-white flex items-center">
            <span class="p-2.5 bg-secondary-50 dark:bg-secondary-900/30 rounded-xl text-secondary-600 mr-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-2 4h.01M9 16h.01M9 12h.01M12 12h.01M12 16h.01M15 16h.01M15 12h.01">
                </path>
              </svg>
            </span>
            Composant : StepLoading.vue
          </h2>
          <!-- Restart button -->
          <button @click="restartSteps"
            class="px-5 py-2.5 bg-secondary-600 hover:bg-secondary-700 text-white text-xs font-black rounded-xl shadow-lg shadow-secondary-500/20 active:scale-95 transition-all">
            Réinitialiser les étapes
          </button>
        </div>

        <div class="space-y-10">
          <!-- 1. Mode Replace dans un Bouton -->
          <div class="p-6 bg-gray-50/50 dark:bg-gray-900/30 rounded-[2rem] border border-gray-100 dark:border-gray-800">
            <h3 class="text-sm font-black text-gray-800 dark:text-white mb-4">
              1. Mode <code class="text-secondary-600">replace</code> (Intégration Bouton de souscription)
            </h3>
            <p class="text-xs text-gray-500 mb-6">Idéal pour le changement de libellé dynamique lors de soumissions de
              formulaires ou de paiements.</p>

            <div class="flex items-center space-x-6">
              <button :disabled="isSubscribing" @click="startSubscriptionSim"
                class="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black shadow-lg shadow-primary-500/20 active:scale-95 transition-all disabled:opacity-90 disabled:active:scale-100 min-w-[280px]">
                <template v-if="!isSubscribing && !subscriptionCompleted">
                  Souscrire à l'abonnement
                </template>
                <template v-else-if="subscriptionCompleted">
                  Abonnement Activé ✓
                </template>
                <template v-else>
                  <UiStepLoading :steps="['Vérification', 'Souscription', 'Génération facture']" duration="1.2s"
                    color="white" mode="replace" @complete="onSubscriptionComplete" />
                </template>
              </button>

              <button v-if="subscriptionCompleted" @click="resetSubscriptionSim"
                class="text-xs font-bold text-red-500 hover:underline">
                Réinitialiser le bouton
              </button>
            </div>
          </div>

          <!-- 2. Mode Cascade -->
          <div class="p-6 bg-gray-50/50 dark:bg-gray-900/30 rounded-[2rem] border border-gray-100 dark:border-gray-800">
            <h3 class="text-sm font-black text-gray-800 dark:text-white mb-4">
              2. Mode <code class="text-secondary-600">cascade</code> (Journal de bord / Avancement détaillé)
            </h3>
            <p class="text-xs text-gray-500 mb-6">Affiche l'historique des étapes au fur et à mesure de leur réalisation
              sous
              forme de cascade.</p>

            <div
              class="max-w-md bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-inner">
              <UiStepLoading :key="cascadeKey"
                :steps="['Création du profil', 'Vérification K-Bis', 'Mise en ligne', 'Notification chargeurs']"
                duration="1.5s" mode="cascade" color="secondary" />
            </div>
          </div>

          <!-- 3. Mode Inline -->
          <div class="p-6 bg-gray-50/50 dark:bg-gray-900/30 rounded-[2rem] border border-gray-100 dark:border-gray-800">
            <h3 class="text-sm font-black text-gray-800 dark:text-white mb-4">
              3. Mode <code class="text-secondary-600">inline</code> (Stepper Horizontal Interactif)
            </h3>
            <p class="text-xs text-gray-500 mb-8">Parfait pour guider l'utilisateur tout au long d'un processus clair en
              plusieurs
              étapes.</p>

            <div
              class="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-inner">
              <UiStepLoading :key="inlineKey" :steps="['Véhicule', 'Trajet', 'Tarif', 'Confirmation']" duration="2s"
                mode="inline" color="primary" />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
definePageMeta({
  layout: 'guest'
});

// États de simulation AppSkeleton
const skeletonLoading = ref(true)

// États de simulation StepLoading - Bouton
const isSubscribing = ref(false)
const subscriptionCompleted = ref(false)

const startSubscriptionSim = () => {
  isSubscribing.value = true
  subscriptionCompleted.value = false
}

const onSubscriptionComplete = () => {
  isSubscribing.value = false
  subscriptionCompleted.value = true
}

const resetSubscriptionSim = () => {
  isSubscribing.value = false
  subscriptionCompleted.value = false
}

// États de réinitialisation des autres modes
const cascadeKey = ref(0)
const inlineKey = ref(0)

const restartSteps = () => {
  cascadeKey.value++
  inlineKey.value++
  resetSubscriptionSim()
}

useHead({
  title: 'Test Components',
  meta: [
    { name: 'description', content: 'Test Components' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
