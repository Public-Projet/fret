<template>
  <section class="relative py-24 overflow-hidden">
    <!-- Background animé -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600">
      <div class="absolute inset-0 opacity-20">
        <div
          class="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob">
        </div>
        <div
          class="absolute bottom-0 right-0 w-96 h-96 bg-green-400 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000">
        </div>
      </div>
    </div>

    <div class="container-custom relative z-10 text-center">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
          Prêt à transformer votre
          <span class="block">logistique ?</span>
        </h2>
        <p class="text-xl md:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto">
          Rejoignez plus de 5,000 entreprises qui ont déjà optimisé leur transport avec FreightConnect
        </p>

        <div class="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <NuxtLink to="/auth/register"
            class="group px-10 py-5 bg-white text-blue-600 rounded-2xl font-black text-xl shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:scale-110 flex items-center space-x-3">
            <span>Créer un compte gratuit</span>
            <IconArrowRight class="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </NuxtLink>

          <NuxtLink to="/offers"
            class="px-10 py-5 border-4 border-white text-white rounded-2xl font-black text-xl hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-110">
            Voir les annonces
          </NuxtLink>
        </div>

        <!-- Mini features -->
        <div class="flex flex-wrap justify-center gap-8 text-white">
          <div class="flex items-center space-x-2">
            <IconCircleCheck class="w-6 h-6" />
            <span class="font-semibold">Sans engagement</span>
          </div>
          <div class="flex items-center space-x-2">
            <IconCircleCheck class="w-6 h-6" />
            <span class="font-semibold">Inscription gratuite</span>
          </div>
          <div class="flex items-center space-x-2">
            <IconCircleCheck class="w-6 h-6" />
            <span class="font-semibold">Support 24/7</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconArrowRight, IconCircleCheck } from '@tabler/icons-vue';
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
