<template>
  <div
    class="relative min-h-screen bg-gray-50 dark:bg-[#0A0F1D] flex items-center justify-center overflow-hidden font-body transition-colors duration-500">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary-500/20 dark:bg-primary-500/10 blur-[120px] rounded-full animate-float">
      </div>
      <div
        class="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-600/10 dark:bg-blue-600/20 blur-[120px] rounded-full animate-float-delayed">
      </div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] opacity-[0.03] dark:opacity-10 pointer-events-none"
        style="background-image: radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0); background-size: 40px 40px;">
      </div>
    </div>

    <!-- Theme Toggle Overlay -->
    <div class="absolute top-8 right-8 z-50">
      <UiThemeToggle />
    </div>

    <div class="container relative z-10 px-4">
      <div class="max-w-2xl mx-auto">
        <!-- Main Card -->
        <div
          class="backdrop-blur-xl bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-16 shadow-xl dark:shadow-2xl relative overflow-hidden group transition-all duration-300">
          <!-- Glass reflection effect -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-white/40 dark:from-white/[0.05] to-transparent pointer-events-none">
          </div>

          <div class="relative z-10 text-center">
            <!-- Error Code with dynamic glow -->
            <div class="relative inline-block mb-8">
              <h1
                class="text-8xl md:text-[10rem] font-black text-gray-200 dark:text-white leading-none tracking-tighter opacity-30 dark:opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                {{ error.statusCode }}
              </h1>
              <div class="absolute inset-0 flex items-center justify-center">
                <span
                  class="text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-primary-600 dark:from-blue-400 dark:to-primary-500 drop-shadow-xl">
                  {{ error.statusCode }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <h2 class="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
              {{ errorTitle }}
            </h2>

            <p class="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-lg mx-auto leading-relaxed">
              {{ errorMessage }}
            </p>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button @click="handleError"
                class="group relative px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold transition-all duration-300 shadow-[0_10px_20px_rgba(59,130,246,0.2)] dark:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_15px_30px_rgba(59,130,246,0.4)] flex items-center gap-3 overflow-hidden">
                <IconHome class="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
                <span class="relative z-10">Retour à l'accueil</span>
                <div
                  class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                </div>
              </button>

              <button @click="router.back()"
                class="px-8 py-4 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white border border-gray-200 dark:border-white/10 rounded-2xl font-bold transition-all duration-300 flex items-center gap-3 active:scale-95">
                <IconArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Page précédente
              </button>
            </div>
          </div>
        </div>

        <!-- Footer watermark/logo style -->
        <div class="mt-12 text-center opacity-40 hover:opacity-100 transition-opacity">
          <p class="text-gray-500 dark:text-gray-400 text-sm font-medium tracking-widest uppercase">
            &copy; {{ new Date().getFullYear() }} Bourse de Fret Bénin • Excellence & Logistique
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';
import { IconHome, IconArrowLeft } from '@tabler/icons-vue';

const props = defineProps<{
  error: NuxtError;
}>();

const router = useRouter();

const errorTitle = computed(() => {
  if (props.error.statusCode === 404) return 'Oups ! Page Perdue';
  if (props.error.statusCode === 403) return 'Accès Restreint';
  if (props.error.statusCode === 500) return 'Incident Technique';
  return 'Une erreur est survenue';
});

const errorMessage = computed(() => {
  if (props.error.statusCode === 404) return "La page que vous tentez d'atteindre semble s'être égarée dans nos entrepôts.";
  if (props.error.statusCode === 403) return "Vous n'avez pas l'autorisation d'accéder à cette zone sécurisée.";
  if (props.error.statusCode === 500) return "Nos équipes travaillent déjà à rétablir la situation. Merci de votre patience.";
  return props.error.message || "Un imprévu logistique a interrompu votre navigation.";
});

// Dynamic SEO Head
useHead({
  title: `${props.error.statusCode} - ${errorTitle.value}`,
  titleTemplate: null,
  meta: [
    {
      name: 'description',
      content: errorMessage.value
    },
    {
      name: 'robots',
      content: 'noindex, nofollow'
    }
  ]
});

const handleError = () => {
  clearError({ redirect: '/' });
};
</script>

<style scoped>
@keyframes float {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(5%, 5%) scale(1.1);
  }
}

@keyframes float-delayed {

  0%,
  100% {
    transform: translate(0, 0) scale(1.1);
  }

  50% {
    transform: translate(-5%, -5%) scale(1);
  }
}

.animate-float {
  animation: float 20s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 25s ease-in-out infinite;
}

/* Custom transitions for a smoother feel */
.btn-primary {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
