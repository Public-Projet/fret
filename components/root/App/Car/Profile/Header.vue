<template>
  <div class="h-64 bg-slate-800 relative overflow-hidden group">
    <div
      class="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] opacity-10 bg-center bg-no-repeat bg-cover">
    </div>
    <div class="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>

    <div class="container-custom h-full flex flex-col justify-end pb-8 relative z-10">
      <!-- CHARGEMENT -->
      <div v-if="loading" class="space-y-4">
        <UiAppSkeleton :loading="true" type="heading" theme="dark" class="mb-2" />
        <UiAppSkeleton :loading="true" type="text" theme="dark" class="w-full md:w-2/3" />
      </div>

      <!-- DONNÉES -->
      <div v-else-if="profile">
        <div class="flex items-center space-x-4 mb-2">
          <span v-if="profile.status === 'active'"
            class="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center">
            <IconRosetteDiscountCheck class="w-3 h-3 mr-1 shrink-0" />
            Transporteur Vérifié
          </span>
          <span v-else-if="profile.status === 'pending'"
            class="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
            En attente de vérification
          </span>
        </div>
        <h1 class="text-4xl font-extrabold text-white tracking-tight">
          {{ profile.firstname }} {{ profile.lastname }}
        </h1>
        <p class="text-slate-400 mt-2 max-w-2xl">
          {{ profile.bio || 'Expert en logistique et transport de marchandises.' }}
        </p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { IconRosetteDiscountCheck } from '@tabler/icons-vue';
import type { UserProfile } from '~/types';

defineProps<{
  profile: UserProfile | null;
  loading?: boolean;
}>();
</script>
