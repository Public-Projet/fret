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
          Activer les notifications
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
