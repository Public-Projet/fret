<template>
  <LegalPageLayout title="Conditions Générales d'Utilisation" last-update="12 janvier 2026">
    <LegalTermsContent />
  </LegalPageLayout>
</template>

<script setup lang="ts">
useHead({
  title: 'Conditions d\'utilisation'
});

definePageMeta({
  layout: 'guest'
});
</script>
