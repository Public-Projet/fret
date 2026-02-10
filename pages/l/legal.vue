<template>
  <LegalPageLayout title="Mentions Légales" last-update="12 janvier 2026">
    <LegalLegalContent />
  </LegalPageLayout>
</template>

<script setup lang="ts">
useHead({
  title: 'Mentions légales'
});

definePageMeta({
  layout: 'guest'
});
</script>
