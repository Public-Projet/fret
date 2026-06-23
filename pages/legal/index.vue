<template>
  <NuxtLayout name="legal" title="Documents légaux">
    <div class="space-y-8">
      <RootLegalHomeIntro />
      <RootLegalHomeDocGrid />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  title: 'Documents légaux',
  meta: [
    {
      name: 'description',
      content:
        'Consultez les conditions d’utilisation, politique de confidentialité, charte de cookies et mentions légales de Bourse de Fret.'
    },
    { name: 'robots', content: 'index, follow' }
  ]
});

definePageMeta({
  layout: false
});
</script>
