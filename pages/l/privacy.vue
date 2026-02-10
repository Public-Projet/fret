<template>
  <LegalPageLayout title="Politique de Confidentialité" last-update="12 janvier 2026">
    <LegalPrivacyContent />
  </LegalPageLayout>
</template>

<script setup lang="ts">
useHead({
  title: 'Politique de confidentialité'
});

definePageMeta({
  layout: 'guest'
});
</script>
