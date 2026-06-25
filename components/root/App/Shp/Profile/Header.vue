<template>
  <div class="h-64 bg-slate-900 relative overflow-hidden">
    <div
      class="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob">
    </div>
    <div
      class="absolute -bottom-32 -left-32 w-64 h-64 bg-primary-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000">
    </div>

    <div class="container-custom h-full flex items-end pb-8 relative z-10">
      <div class="flex items-end space-x-6 w-full">
        <UiAppSkeleton :loading="loading" type="avatar" theme="dark" width="8rem" height="8rem" radius="0.5rem" class="-mb-16">
          <div class="w-32 h-32 bg-white rounded-lg shadow-xl p-1 flex items-center justify-center -mb-16">
            <div
              class="w-full h-full bg-slate-100 rounded flex items-center justify-center text-4xl font-bold text-slate-700 uppercase">
              {{ profile?.firstname?.[0] }}{{ profile?.lastname?.[0] }}
            </div>
          </div>
        </UiAppSkeleton>
        <div class="flex-1 pb-4">
          <UiAppSkeleton :loading="loading" type="heading" theme="dark" class="h-8 w-48 mb-2">
            <h1 class="text-3xl font-bold text-white mb-1">{{ profile?.firstname }} {{ profile?.lastname }}</h1>
          </UiAppSkeleton>
          <UiAppSkeleton :loading="loading" type="text" theme="dark" class="h-4 w-36">
            <p class="text-slate-300 flex items-center">
              <IconBuildingSkyscraper class="w-4 h-4 mr-1" />
              Compte Expéditeur
              <span class="mx-2">•</span>
              <span v-if="profile?.status === 'active'" class="text-green-400 flex items-center text-sm font-medium">
                <IconDiscountCheckFilled class="w-4 h-4 mr-1" />
                Vérifié
              </span>
              <span v-else class="text-yellow-400 text-sm font-medium">
                En attente
              </span>
            </p>
          </UiAppSkeleton>
        </div>
        <div class="pb-4 flex space-x-3">
          <UiAppSkeleton :loading="loading" type="text" theme="dark" class="h-10 w-12 rounded-lg">
            <button @click="$emit('open-security')"
              class="btn bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm">
              <IconLock class="w-5 h-5" />
            </button>
          </UiAppSkeleton>
          <UiAppSkeleton :loading="loading" type="text" theme="dark" class="h-10 w-36 rounded-lg">
            <button @click="$emit('open-edit')"
              class="btn bg-primary-600 hover:bg-primary-700 text-white border-0 shadow-lg shadow-primary-900/20">
              Modifier le profil
            </button>
          </UiAppSkeleton>
        </div>
      </div>
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
