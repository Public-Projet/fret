<template>
  <UiBaseModal
    :show="showPromptModal"
    max-width="md"
    @close="dismissPrompt"
  >
    <!-- Contenu personnalisé de la modal -->
    <div class="flex flex-col items-center text-center space-y-4 py-2">
      <div class="relative">
        <!-- Effet halo lumineux -->
        <div class="absolute inset-0 bg-primary-500/20 dark:bg-primary-500/10 rounded-full blur-xl scale-150 animate-pulse"></div>
        <div class="relative w-16 h-16 bg-primary-50 dark:bg-primary-950/50 rounded-2xl flex items-center justify-center border border-primary-100 dark:border-primary-900/50 shadow-inner">
          <IconBellRinging class="w-8 h-8 text-primary-600 dark:text-primary-400 animate-bounce" />
        </div>
      </div>

      <div class="space-y-2">
        <h3 class="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Activer les notifications ?
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          Soyez informé en temps réel des nouvelles opportunités de fret, des messages de vos partenaires et du suivi de vos trajets.
        </p>
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
          <span class="inline-flex items-center gap-1">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            Une confirmation de votre navigateur sera demandée.
          </span>
        </p>
      </div>
    </div>

    <!-- Liste des avantages -->
    <div class="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-4 space-y-3 text-sm text-gray-600 dark:text-gray-300 my-4">
      <div class="flex items-start gap-3">
        <IconCircleCheck class="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
        <div>
          <span class="font-bold text-gray-800 dark:text-gray-200">Alertes de Fret :</span>
          Soyez averti dès qu'un fret ou camion correspondant est publié.
        </div>
      </div>
      <div class="flex items-start gap-3">
        <IconCircleCheck class="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
        <div>
          <span class="font-bold text-gray-800 dark:text-gray-200">Messagerie instantanée :</span>
          Répondez plus vite à vos collaborateurs et clients.
        </div>
      </div>
      <div class="flex items-start gap-3">
        <IconCircleCheck class="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
        <div>
          <span class="font-bold text-gray-800 dark:text-gray-200">Suivi en direct :</span>
          Suivez le statut de vos expéditions sans rafraîchir la page.
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex flex-col sm:flex-row gap-3 w-full">
        <button
          @click="dismissPrompt"
          class="order-2 sm:order-1 flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors"
        >
          Plus tard
        </button>
        <button
          @click="acceptPrompt"
          class="order-1 sm:order-2 flex-1 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-sm font-semibold text-white transition-all shadow-md shadow-primary-500/10 hover:shadow-primary-600/25 flex items-center justify-center gap-2"
        >
          <IconBell class="w-4 h-4" />
          Continuer et activer
        </button>
      </div>
    </template>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { useDesktopNotifications } from '~/composables/useDesktopNotifications';
import { IconBell, IconBellRinging, IconCircleCheck } from '@tabler/icons-vue';

const { showPromptModal, acceptPrompt, dismissPrompt } = useDesktopNotifications();
</script>
