<template>
  <section class="section bg-gray-50 dark:bg-gray-900">
    <div class="container-custom">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <UiGradientBadge text="Notre Mission" variant="blue" />
          <h2 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
            Connecter les acteurs du
            <span class="text-gradient">transport au Bénin</span>
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            Bourse de Fret Bénin est née d'un constat simple : le transport de marchandises au Bénin
            manquait cruellement de digitalisation et de transparence. Notre plateforme met en relation
            directe les chargeurs avec des transporteurs qualifiés, éliminant les intermédiaires inutiles.
          </p>
          <p class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Notre objectif est de rendre le transport de fret accessible, sécurisé et économique pour
            tous. Que vous soyez une entreprise cherchant à optimiser sa logistique ou un transporteur
            indépendant en quête de nouvelles opportunités, nous sommes là pour vous.
          </p>
        </div>

        <div class="relative">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-3xl blur-3xl">
          </div>
          <div
            class="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
            <div class="space-y-6">
              <div v-for="(item, index) in missionItems" :key="index" class="flex items-start gap-4">
                <div :class="['p-3 rounded-xl', item.bgClass]">
                  <component :is="item.icon" :class="['w-8 h-8', item.iconColor]" />
                </div>
                <div>
                  <h4 class="font-bold text-gray-900 dark:text-white mb-1">{{ item.title }}</h4>
                  <p class="text-gray-600 dark:text-gray-400">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconTarget, IconRocket, IconHeart } from '@tabler/icons-vue';

const missionItems = [
  {
    icon: IconTarget,
    title: 'Vision',
    description: "Devenir la référence du transport de fret en Afrique de l'Ouest",
    bgClass: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    icon: IconRocket,
    title: 'Ambition',
    description: "Digitaliser 100% du transport de marchandises au Bénin d'ici 2030",
    bgClass: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    icon: IconHeart,
    title: 'Engagement',
    description: "Support 24/7 et accompagnement personnalisé",
    bgClass: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400'
  }
];
</script>

<style scoped>
.text-gradient {
  @apply bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent;
}
</style>
