<template>
  <section v-if="contentStore.loading.testimonials || contentStore.testimonials.length > 0"
    class="section bg-white dark:bg-gray-800">
    <div class="container-custom">
      <div class="text-center mb-16">
        <UiGradientBadge text="Témoignages" />
        <h2 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          Ils nous font confiance
        </h2>
      </div>

      <div v-if="contentStore.loading.testimonials" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="card p-8 animate-pulse bg-gray-50 dark:bg-gray-700/50">
          <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full mb-4"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6 mb-8"></div>
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600"></div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="contentStore.testimonials.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <HomeTestimonialCard v-for="(t, index) in contentStore.testimonials" :key="t.id" :quote="t.quote" :name="t.name"
          :role="t.role" :photo="t.photo" :initials="getInitials(t.name)" :avatar-class="getAvatarClass(index)" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useSiteContentStore, getInitials, getAvatarClass } from '~/stores/siteContent';

const contentStore = useSiteContentStore();

onMounted(() => {
  contentStore.fetchTestimonials();
});
</script>
