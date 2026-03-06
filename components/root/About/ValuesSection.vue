<template>
  <section class="section bg-white dark:bg-gray-800">
    <div class="container-custom">
      <div class="text-center mb-16">
        <UiGradientBadge text="Nos Valeurs" variant="green" />
        <h2 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          Ce qui nous guide au quotidien
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="value in VALUES" :key="value.title"
          :class="['group relative rounded-3xl p-8 border border-gray-200 dark:border-gray-700/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 dark:shadow-lg dark:shadow-black/20 dark:hover:shadow-xl dark:hover:shadow-black/30', value.bgClass]">
          <div
            :class="['w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg', value.iconBgClass]">
            <component :is="value.icon" class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">{{ value.title }}</h3>
          <p class="text-gray-600 dark:text-gray-300">{{ value.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconShieldCheck, IconBulb, IconUsers, IconBolt } from '@tabler/icons-vue';

const VALUES = [
  {
    icon: IconShieldCheck,
    title: 'Confiance',
    description: 'Tous nos transporteurs sont vérifiés et certifiés. Votre marchandise est entre de bonnes mains.',
    bgClass: 'bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800/80 dark:to-blue-900/20 dark:backdrop-blur-sm',
    iconBgClass: 'bg-gradient-to-br from-blue-500 to-blue-700'
  },
  {
    icon: IconBulb,
    title: 'Innovation',
    description: 'Nous utilisons les dernières technologies pour optimiser vos transports.',
    bgClass: 'bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-800/80 dark:to-green-900/20 dark:backdrop-blur-sm',
    iconBgClass: 'bg-gradient-to-br from-green-500 to-green-700'
  },
  {
    icon: IconUsers,
    title: 'Proximité',
    description: 'Une équipe à votre écoute, disponible pour vous accompagner à chaque étape.',
    bgClass: 'bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800/80 dark:to-blue-900/20 dark:backdrop-blur-sm',
    iconBgClass: 'bg-gradient-to-br from-blue-500 to-blue-700'
  },
  {
    icon: IconBolt,
    title: 'Efficacité',
    description: 'Trouvez un transporteur en moins de 30 minutes. Pas de perte de temps !',
    bgClass: 'bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-800/80 dark:to-green-900/20 dark:backdrop-blur-sm',
    iconBgClass: 'bg-gradient-to-br from-green-500 to-green-700'
  }
];
</script>
