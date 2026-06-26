<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
    <h4 class="font-bold text-gray-900 dark:text-white mb-4">Coordonnées</h4>

    <!-- Chargement -->
    <div v-if="loading" class="space-y-4">
      <UiAppSkeleton :loading="true" type="text" />
      <UiAppSkeleton :loading="true" type="text" />
      <UiAppSkeleton :loading="true" type="text" />
    </div>

    <!-- Contenu -->
    <ul v-else class="space-y-4 text-sm">
      <li class="flex items-start">
        <IconUser class="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
        <div>
          <span class="font-medium text-gray-900 dark:text-white">@{{ profile?.username }}</span>
        </div>
      </li>
      <li class="flex items-start">
        <IconPhone class="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
        <div>
          <span class="font-medium text-gray-900 dark:text-white">{{ profile?.phone || 'Non renseigné' }}</span>
        </div>
      </li>
      <li class="flex items-center justify-between">
        <div class="flex items-start">
          <IconMail class="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
          <span class="font-medium text-gray-900 dark:text-white">{{ profile?.email }}</span>
        </div>
        <button @click="$emit('edit-email')" :class="['text-xs hover:underline', linkColorClass]">Modifier</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconUser, IconPhone, IconMail } from '@tabler/icons-vue';
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
