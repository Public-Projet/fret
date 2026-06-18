<template>
  <div class="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]"></div>
    </div>

    <div class="container-custom relative z-10 text-center">
      <span
        class="inline-block py-1 px-3 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold tracking-wider uppercase mb-4 animate-fade-in-up">
        Tarification simple et transparente
      </span>
      <h1
        class="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight animate-fade-in-up delay-100">
        Choisissez l'offre adaptée à <br class="hidden md:block" />
        <span
          class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400">
          vos besoins logistiques
        </span>
      </h1>
      <p
        class="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
        Que vous soyez un expéditeur occasionnel ou une entreprise de transport, nous avons une solution pour vous.
        Commencez gratuitement dès aujourd'hui.
      </p>

      <!-- Billing Toggle -->
      <div class="flex items-center justify-center space-x-4 mb-12 animate-fade-in-up delay-300">
        <span class="text-sm font-medium"
          :class="!isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'">Mensuel</span>
        <button @click="$emit('update:isAnnual', !isAnnual)"
          class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
          :class="isAnnual ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'">
          <span
            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
            :class="isAnnual ? 'translate-x-5' : 'translate-x-0'"></span>
        </button>
        <span class="text-sm font-medium"
          :class="isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'">
          Annuel <span class="text-green-500 text-xs font-bold ml-1">-20%</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isAnnual: boolean;
}>();

defineEmits<{
  (e: 'update:isAnnual', value: boolean): void;
}>();
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.delay-100 {
  animation-delay: 0.1s;
}

.delay-200 {
  animation-delay: 0.2s;
}

.delay-300 {
  animation-delay: 0.3s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
