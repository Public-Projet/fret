<template>
  <div class="container-custom py-12 max-w-4xl">
    <div class="card p-8 md:p-12">
      <HelpSafetyHeader />
      <div class="prose dark:prose-invert max-w-none space-y-8">
        <HelpSafetyFeatures />
        <HelpSafetyTips />
        <HelpSafetyReport />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Sécurité & Confiance'
});

definePageMeta({
  layout: 'guest'
});
</script>
