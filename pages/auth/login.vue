<template>
  <RootAuthLogin />
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
});

useHead({
  title: 'Connexion - Bourse de Fret',
  meta: [
    { name: 'description', content: 'Connectez-vous à votre compte Bourse de Fret pour accéder à votre espace.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>

