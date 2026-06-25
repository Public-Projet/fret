<template>
  <div class="h-64 bg-slate-900 relative overflow-hidden">
    <div class="container-custom h-full flex items-end pb-8 relative z-10">
      <!-- CHARGEMENT -->
      <div v-if="loading" class="flex items-end space-x-6 w-full">
        <div class="w-32 h-32 -mb-16 shrink-0">
          <UiAppSkeleton :loading="true" type="avatar" class="w-full h-full" />
        </div>

        <div class="flex-1 pb-4 space-y-2">
          <UiAppSkeleton :loading="true" type="heading" class="h-8 w-48" />
          <UiAppSkeleton :loading="true" type="text" class="h-4 w-36" />
        </div>

        <div class="pb-4 flex space-x-3">
          <UiAppSkeleton :loading="true" type="text" class="h-10 w-12 rounded-lg" />
          <UiAppSkeleton :loading="true" type="text" class="h-10 w-36 rounded-lg" />
        </div>
      </div>

      <!-- DONNÉES -->
      <div v-else-if="profile" class="flex items-end space-x-6 w-full">
        <!-- Avatar contenu -->
        <div class="w-32 h-32 bg-white rounded-lg shadow-xl p-1 flex items-center justify-center -mb-16 shrink-0">
          <div
            class="w-full h-full bg-slate-100 rounded flex items-center justify-center text-4xl font-bold text-slate-700 uppercase">
            {{ profile.firstname?.[0] }}{{ profile.lastname?.[0] }}
          </div>
        </div>

        <!-- Infos contenu -->
        <div class="flex-1 pb-4">
          <h1 class="text-3xl font-bold text-white mb-1">
            {{ profile.firstname }} {{ profile.lastname }}
          </h1>
          <p class="text-slate-300 flex items-center flex-wrap gap-y-1">
            <IconBuildingSkyscraper class="w-4 h-4 mr-1 shrink-0" />
            Compte Expéditeur
            <span class="mx-2">•</span>
            <span v-if="profile.status === 'active'" class="text-green-400 flex items-center text-sm font-medium">
              <IconDiscountCheckFilled class="w-4 h-4 mr-1 shrink-0" />
              Vérifié
            </span>
            <span v-else class="text-yellow-400 text-sm font-medium">En attente</span>
          </p>
        </div>

        <!-- Actions contenu -->
        <div class="pb-4 flex space-x-3 shrink-0">
          <button @click="$emit('open-security')"
            class="btn bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm" title="Sécurité">
            <IconLock class="w-5 h-5" />
          </button>
          <button @click="$emit('open-edit')"
            class="btn bg-primary-600 hover:bg-primary-700 text-white border-0 shadow-lg shadow-primary-900/20">
            Modifier le profil
          </button>
        </div>
      </div>

      <!-- 3. AUCUNE DONNÉE / FALLBACK -->
      <template v-else></template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { IconBuildingSkyscraper, IconDiscountCheckFilled, IconLock } from '@tabler/icons-vue';
import type { UserProfile } from '~/types';

defineProps<{
  profile: UserProfile | null;
  loading?: boolean;
}>();

defineEmits<{
  'open-security': [];
  'open-edit': [];
}>();
</script>

<style scoped>
@keyframes blob {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  25% {
    transform: translate(20px, -50px) scale(1.1);
  }

  50% {
    transform: translate(-20px, 20px) scale(0.9);
  }

  75% {
    transform: translate(50px, 50px) scale(1.05);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
</style>