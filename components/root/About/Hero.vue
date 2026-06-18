<template>
  <section class="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
    <!-- Background animé -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 dark:from-slate-900 dark:via-gray-900 dark:to-slate-950">
      <div class="absolute inset-0 opacity-20">
        <div
          class="absolute top-20 left-10 w-72 h-72 bg-white dark:bg-blue-500/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob">
        </div>
        <div
          class="absolute top-40 right-10 w-72 h-72 bg-green-400 dark:bg-emerald-500/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000">
        </div>
        <div
          class="absolute -bottom-8 left-20 w-72 h-72 bg-blue-400 dark:bg-purple-500/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000">
        </div>
      </div>
    </div>

    <div class="container-custom relative z-10 py-20 text-center">
      <div
        class="inline-flex items-center space-x-2 bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-full px-6 py-3 mb-8 animate-fade-in">
        <IconInfoCircle class="w-5 h-5 text-green-300 dark:text-emerald-400" />
        <span class="text-sm text-white dark:text-gray-200 font-medium">Qui sommes-nous ?</span>
      </div>

      <h1 class="text-5xl md:text-7xl font-black text-white dark:text-gray-100 mb-6 leading-tight">
        Notre
        <span
          class="bg-gradient-to-r from-green-400 via-green-300 to-green-200 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-300 bg-clip-text text-transparent">
          Histoire
        </span>
      </h1>

      <p class="text-xl md:text-2xl text-blue-100 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
        Découvrez l'équipe passionnée qui révolutionne le transport de marchandises au Bénin
      </p>
    </div>

    <!-- Wave separator -->
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
        <path
          d="M0 200L48 183.3C96 166.7 192 133.3 288 116.7C384 100 480 100 576 108.3C672 116.7 768 133.3 864 133.3C960 133.3 1056 116.7 1152 108.3C1248 100 1344 100 1392 100L1440 100V200H1392C1344 200 1248 200 1152 200C1056 200 960 200 864 200C768 200 672 200 576 200C480 200 384 200 288 200C192 200 96 200 48 200H0Z"
          fill="currentColor" class="text-gray-50 dark:text-gray-900" />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconInfoCircle } from '@tabler/icons-vue';
</script>

<style scoped>
@keyframes blob {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  25% {
    transform: translate(20px, -50px) scale(1.1);
  }

  50% {
    transform: translate(-20px, 20px) scale(0.9);
  }

  75% {
    transform: translate(50px, 50px) scale(1.05);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
