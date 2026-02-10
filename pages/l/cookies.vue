<template>
  <LegalPageLayout title="Politique de Cookies" last-update="12 janvier 2026">
    <LegalCookiesContent />
  </LegalPageLayout>
</template>

<script setup lang="ts">
useHead({
  title: 'Politique de cookies'
});

definePageMeta({
  layout: 'guest'
});
</script>
