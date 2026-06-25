<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
    <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">A propos</h3>
    <UiAppSkeleton :loading="loading" type="text" :count="4" gap="4">
      <div class="space-y-4">
        <div>
          <label class="text-xs text-gray-500 block mb-1">Nom d'utilisateur</label>
          <p class="font-medium text-gray-900 dark:text-white flex items-center">
            <IconAt class="w-4 h-4 mr-2 text-gray-400" />
            {{ profile?.username }}
          </p>
        </div>
        <div>
          <label class="text-xs text-gray-500 block mb-1">Email</label>
          <div class="flex items-center justify-between">
            <p class="font-medium text-gray-900 dark:text-white flex items-center">
              <IconMail class="w-4 h-4 mr-2 text-gray-400" />
              {{ profile?.email }}
            </p>
            <button @click="$emit('edit-email')" :class="['text-xs hover:underline', linkColorClass]">Modifier</button>
          </div>
        </div>
        <div>
          <label class="text-xs text-gray-500 block mb-1">Téléphone</label>
          <p class="font-medium text-gray-900 dark:text-white flex items-center">
            <IconPhone class="w-4 h-4 mr-2 text-gray-400" />
            {{ profile?.phone || 'Non renseigné' }}
          </p>
        </div>
        <div v-if="profile?.bio">
          <label class="text-xs text-gray-500 block mb-1">Biographie</label>
          <p class="text-gray-600 dark:text-gray-400 text-sm">{{ profile.bio }}</p>
        </div>
      </div>
    </UiAppSkeleton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconAt, IconMail, IconPhone } from '@tabler/icons-vue';
import type { UserProfile } from '~/types';

const props = defineProps<{
  profile: UserProfile | null;
  accentColor?: 'primary' | 'secondary';
  loading?: boolean;
}>();

defineEmits<{
  'edit-email': [];
}>();

const linkColorClass = computed(() => {
  return props.accentColor === 'secondary'
    ? 'text-secondary-600'
    : 'text-primary-600';
});
</script>
