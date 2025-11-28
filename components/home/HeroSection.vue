<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Background animé avec gradient moderne -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
      <div class="absolute inset-0 opacity-20">
        <div
          class="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob">
        </div>
        <div
          class="absolute top-40 right-10 w-72 h-72 bg-green-400 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000">
        </div>
        <div
          class="absolute -bottom-8 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000">
        </div>
      </div>
    </div>

    <!-- Image AP -->
    <div class="absolute inset-0">
      <img src="https://transportsgranger.com/wp-content/uploads/2025/06/Transport-de-fret-par-conteneur.jpg"
        alt="background transport" class="w-full h-full object-cover opacity-20 mix-blend-overlay" />
    </div>

    <!-- Contenu Hero -->
    <div class="container-custom relative z-10 py-20">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
        <!-- TEXTE -->
        <div class="lg:col-span-2">
          <div class="text-left max-w-3xl">
            <!-- Badge animé -->
            <div
              class="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-8 animate-fade-in">
              <IconSparkles class="w-5 h-5 text-yellow-300" />
              <span class="text-sm text-white font-medium">La plateforme n°1 du transport au Bénin</span>
            </div>

            <!-- Titre principal -->
            <h1 class="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Révolutionnez votre
              <span
                class="block mt-2 bg-gradient-to-r from-green-400 via-green-300 to-green-200 bg-clip-text text-transparent">
                logistique de transport
              </span>
            </h1>

            <!-- Sous-titre -->
            <p class="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed max-w-2xl">
              Connectez-vous instantanément avec des milliers de transporteurs qualifiés.
              Economisez jusqu'à 40% sur vos coûts de transport.
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 mb-16">
              <NuxtLink to="/auth/register?role=shipper"
                class="group relative px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 flex items-center space-x-3">
                <IconTruck class="w-6 h-6 group-hover:rotate-12 transition-transform" />
                <span>Je suis chargeur</span>
                <IconArrowRight class="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </NuxtLink>

              <NuxtLink to="/auth/register?role=carrier"
                class="group relative px-8 py-4 bg-green-500 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-green-400/50 transition-all duration-300 hover:scale-105 flex items-center space-x-3">
                <IconUsersGroup class="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>Je suis transporteur</span>
                <IconArrowRight class="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </NuxtLink>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-6 max-w-2xl">
              <StatCard :value="shippers" label="Chargeurs actifs" />
              <StatCard :value="carriers" label="Transporteurs" />
              <StatCard :value="deliveries" label="Transports réussis" suffix="k+" />
            </div>
          </div>
        </div>

        <!-- IMAGE -->
        <div class="lg:col-span-1 flex justify-center">
          <div class="relative max-w-md w-full animate-slide-right">
            <img src="https://developers.google.com/static/maps/solutions/images/store_locator.png"
              alt="Transport Logistics" class="w-full h-auto" />

            <!-- Décorations -->
            <div class="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div
              class="absolute -bottom-8 -left-8 w-40 h-40 bg-green-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <IconChevronDown class="w-8 h-8 text-white/70" />
    </div>

    <!-- Wave separator moderne -->
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
import { ref, onMounted } from 'vue';
import StatCard from './StatCard.vue';
import { IconArrowRight, IconChevronDown, IconSparkles, IconTruck, IconUsersGroup } from '@tabler/icons-vue';

const shippers = ref(0);
const carriers = ref(0);
const deliveries = ref(0);

const animateValue = (target: any, start: number, end: number, duration: number) => {
  const startTime = performance.now();

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    target.value = Math.floor(start + (end - start) * progress);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

onMounted(() => {
  setTimeout(() => {
    animateValue(shippers, 0, 5247, 2000);
    animateValue(carriers, 0, 12389, 2000);
    animateValue(deliveries, 0, 847, 2000);
  }, 500);
});
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
