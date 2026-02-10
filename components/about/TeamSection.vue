<template>
  <section class="section bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
    <div class="container-custom">
      <div class="text-center mb-16">
        <UiGradientBadge text="L'Équipe" variant="blue" />
        <h2 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          Les visages derrière la plateforme
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Une équipe passionnée par l'innovation et le transport
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div v-for="member in TEAM" :key="member.initials"
          class="group bg-white dark:bg-gray-800 rounded-3xl p-8 text-center shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
          <div
            :class="['w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300', member.avatarClass]">
            <span class="text-3xl font-black text-white">{{ member.initials }}</span>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ member.name }}</h3>
          <p :class="['font-semibold mb-3', member.roleClass]">{{ member.role }}</p>
          <p class="text-gray-600 dark:text-gray-400 text-sm">{{ member.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const TEAM = [
  {
    initials: 'SA',
    name: 'Sylvestre AIZAN ALAGBE',
    role: 'Co-fondateur & CEO',
    description: "10 ans d'expérience dans la logistique et le transport au Bénin",
    avatarClass: 'bg-gradient-to-br from-blue-500 to-blue-700',
    roleClass: 'text-blue-600 dark:text-blue-400'
  },
  {
    initials: 'HD',
    name: 'Handel DOVOEDO',
    role: 'Co-fondateur & CTO',
    description: 'Expert en développement de plateformes digitales B2B',
    avatarClass: 'bg-gradient-to-br from-green-500 to-green-700',
    roleClass: 'text-green-600 dark:text-green-400'
  },
  {
    initials: 'AK',
    name: 'Amos KPOSSOU',
    role: 'Directeur des Opérations',
    description: 'Spécialiste en gestion de la relation client et qualité',
    avatarClass: 'bg-gradient-to-br from-blue-500 to-green-500',
    roleClass: 'text-blue-600 dark:text-blue-400'
  }
];
</script>
