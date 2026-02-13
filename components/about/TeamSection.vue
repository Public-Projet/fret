<template>
  <section v-if="contentStore.loading.team || contentStore.team.length > 0"
    class="section bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
    <div class="container-custom">
      <div class="text-center mb-16">
        <UiGradientBadge text="L'Équipe" variant="blue" />
        <h2 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          Les visages derrière la plateforme
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Une équipe passionnée par l'innovation et le transport
        </p>
      </div>

      <div v-if="contentStore.loading.team" class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div v-for="i in 3" :key="i"
          class="bg-white dark:bg-gray-800 rounded-3xl p-8 animate-pulse shadow-lg border border-gray-200 dark:border-gray-700">
          <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-3"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-6"></div>
          <div class="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full mx-auto"></div>
        </div>
      </div>

      <div v-else-if="contentStore.team.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div v-for="(member, index) in contentStore.team" :key="member.id"
          class="group bg-white dark:bg-gray-800 rounded-3xl p-8 text-center shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">

          <div v-if="member.photo"
            class="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg group-hover:scale-110 transition-transform duration-300">
            <img :src="member.photo" :alt="member.name" class="w-full h-full object-cover" />
          </div>
          <div v-else
            :class="['w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300', getAvatarClass(index)]">
            <span class="text-3xl font-black text-white">{{ getInitials(member.name) }}</span>
          </div>

          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ member.name }}</h3>
          <p :class="['font-semibold mb-3', getRoleClass(index)]">{{ member.role }}</p>
          <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">{{ member.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useSiteContentStore, getInitials, getAvatarClass, getRoleClass } from '~/stores/siteContent';

const contentStore = useSiteContentStore();

onMounted(() => {
  contentStore.fetchTeam();
});
</script>
