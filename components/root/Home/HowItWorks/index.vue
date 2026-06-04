<template>
  <section id="features" class="section bg-white dark:bg-gray-800 relative overflow-hidden">
    <div class="container-custom relative z-10">
      <div class="text-center mb-20">
        <UiGradientBadge text="Processus Simple" />
        <h2 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          Comment ça marche ?
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          En seulement 3 étapes, trouvez le transporteur idéal pour vos marchandises
        </p>
      </div>

      <!-- Timeline verticale sur mobile, horizontale sur desktop -->
      <div class="relative">
        <!-- Ligne de connexion -->
        <div
          class="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 transform -translate-y-1/2">
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <RootHomeFeaturesCard number="01" :icon="IconFileText" title="Publiez votre annonce"
            description="Décrivez votre besoin en quelques clics : origine, destination, type de marchandise, délai et budget."
            highlight="2 minutes chrono" :highlight-icon="IconClock"
            gradient-class="bg-gradient-to-br from-blue-500 to-blue-700"
            time-class="text-blue-600 dark:text-blue-400" />

          <RootHomeFeaturesCard number="02" :icon="IconSearch" title="Recevez des offres"
            description="Les transporteurs qualifiés consultent votre annonce et vous proposent leurs meilleurs tarifs en temps réel."
            highlight="Jusqu'à 20 offres" :highlight-icon="IconBolt"
            gradient-class="bg-gradient-to-br from-green-500 to-green-700"
            time-class="text-green-600 dark:text-green-400" />

          <RootHomeFeaturesCard number="03" :icon="IconCircleCheck" title="Choisissez et validez"
            description="Comparez, négociez et sélectionnez le transporteur qui correspond le mieux à vos besoins et budget."
            highlight="100% sécurisé" :highlight-icon="IconShieldCheck"
            gradient-class="bg-gradient-to-br from-blue-500 to-blue-700"
            time-class="text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconBolt, IconCircleCheck, IconClock, IconFileText, IconSearch, IconShieldCheck } from '@tabler/icons-vue';
</script>
