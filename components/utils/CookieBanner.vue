<template>
  <Transition name="cookie-banner">
    <div v-if="isVisible" class="fixed bottom-4 right-4 md:right-6 md:bottom-6 md:max-w-md z-[999]">
      <div class="glass rounded-2xl p-5 shadow-2xl border border-white/20 dark:border-gray-700/60 flex flex-col gap-4">
        <!-- Icône + texte -->
        <div class="flex items-start gap-3">
          <div
            class="shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
            <IconCookie class="w-5 h-5 text-white" />
          </div>
          <div>
            <p class="text-sm font-bold text-gray-900 dark:text-white mb-1">🍪 Cookies & confidentialité</p>
            <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Ce site utilise des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le
              contenu.
              En continuant, vous acceptez notre
              <NuxtLink to="/legal/cookies"
                class="underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                politique de cookies
              </NuxtLink>.
            </p>
          </div>
        </div>

        <!-- Bouton d'acceptation -->
        <button @click="dismiss"
          class="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2">
          <IconCircleCheck class="w-4 h-4" />
          D'accord, j'ai compris
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IconCookie, IconCircleCheck } from '@tabler/icons-vue';

const STORAGE_KEY = 'bfb_cookie_consent';

const isVisible = ref(false);

onMounted(() => {
  // Vérifier si l'utilisateur a déjà accepté
  if (!localStorage.getItem(STORAGE_KEY)) {
    // Légère temporisation pour ne pas gêner le chargement initial
    setTimeout(() => { isVisible.value = true; }, 1200);
  }
});

function dismiss() {
  isVisible.value = false;
  localStorage.setItem(STORAGE_KEY, 'accepted');
}
</script>

<style scoped>
.cookie-banner-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.cookie-banner-leave-active {
  transition: all 0.25s ease-in;
}

.cookie-banner-enter-from {
  opacity: 0;
  transform: translateY(24px);
}

.cookie-banner-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>
