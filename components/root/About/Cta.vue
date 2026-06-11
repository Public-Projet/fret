<template>
  <section class="relative py-24 overflow-hidden">
    <div
      class="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 dark:from-slate-900 dark:via-gray-900 dark:to-slate-950">
      <div class="absolute inset-0 opacity-20">
        <div
          class="absolute top-0 left-0 w-96 h-96 bg-white dark:bg-blue-500/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob">
        </div>
        <div
          class="absolute bottom-0 right-0 w-96 h-96 bg-green-400 dark:bg-emerald-500/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000">
        </div>
      </div>
    </div>

    <div class="container-custom relative z-10 text-center">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-4xl md:text-6xl font-black text-white dark:text-gray-100 mb-6 leading-tight">
          Rejoignez l'aventure
          <span
            class="block bg-gradient-to-r from-green-400 via-green-300 to-green-200 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-300 bg-clip-text text-transparent">Bourse
            de Fret Bénin</span>
        </h2>
        <p class="text-xl md:text-2xl text-blue-100 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Que vous soyez chargeur ou transporteur, notre plateforme est faite pour vous
        </p>

        <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <NuxtLink to="/auth/register"
            class="group px-10 py-5 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-2xl font-black text-xl shadow-2xl hover:shadow-white/30 dark:hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-110 flex items-center space-x-3 dark:border dark:border-gray-700">
            <span>Créer mon compte</span>
            <IconArrowRight class="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </NuxtLink>

          <NuxtLink to="/support/contact"
            class="px-10 py-5 border-4 border-white dark:border-gray-600 text-white dark:text-gray-200 rounded-2xl font-black text-xl hover:bg-white hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-emerald-400 transition-all duration-300 hover:scale-110">
            Nous contacter
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconArrowRight } from '@tabler/icons-vue';
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

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
