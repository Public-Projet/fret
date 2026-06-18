<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
    <RootHelpContactHero />

    <div class="container-custom -mt-20 pb-20 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RootHelpContactInfo />
        <RootHelpContactForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Contactez-nous',
  meta: [
    { name: 'description', content: 'Une question ou besoin d\'assistance ? Contactez l\'équipe de Bourse de Fret via notre formulaire ou nos coordonnées directes.' },
    { name: 'robots', content: 'index, follow' }
  ]
});

definePageMeta({
  layout: 'guest'
});
</script>
