<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
    <ContactHero />

    <div class="container-custom -mt-20 pb-20 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ContactInfo />
        <ContactForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ContactHero from '~/components/help/ContactHero.vue';
import ContactInfo from '~/components/help/ContactInfo.vue';
import ContactForm from '~/components/help/ContactForm.vue';

useHead({
  title: 'Contact'
});

definePageMeta({
  layout: 'guest'
});
</script>
