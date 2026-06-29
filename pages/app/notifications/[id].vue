<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <RootAppNotifDetailHeader />
    <RootAppNotifDetailCard />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
});

useHead({
  title: 'Détails de la notification',
  meta: [
    { name: 'description', content: 'Consultez les détails de votre notification sur Bourse de Fret.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
