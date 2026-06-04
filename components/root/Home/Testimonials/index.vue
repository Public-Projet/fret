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
        <div v-for="i in 3" :key="i" class="card p-8 bg-gray-50 dark:bg-gray-700/30 rounded-[2rem] border border-gray-100 dark:border-gray-700">
          <UiAppSkeleton type="text" count="2" gap="3" class="mb-8" />
          <div class="flex items-center space-x-4">
            <UiAppSkeleton type="avatar" />
            <div class="flex-1 space-y-2">
              <UiAppSkeleton type="text" width="60%" />
              <UiAppSkeleton type="text" width="40%" />
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="contentStore.testimonials.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <RootHomeTestimonialsCard v-for="(t, index) in contentStore.testimonials" :key="t.id" :quote="t.quote"
          :name="t.name" :role="t.role" :photo="t.photo" :rating="t.rating" :initials="getInitials(t.name)"
          :avatar-class="getAvatarClass(index)" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePbcSiteContentStore } from '~/stores/pbcSiteContent';
import { getInitials, getAvatarClass } from '~/utils/siteContent';

const contentStore = usePbcSiteContentStore();

onMounted(() => {
  contentStore.fetchTestimonials();
});
</script>
