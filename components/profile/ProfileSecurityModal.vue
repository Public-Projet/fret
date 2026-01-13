<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
        <div class="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 space-y-4">
          <button @click="$emit('close')"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <IconX class="w-5 h-5" />
          </button>
          <div class="text-center mb-4">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Paramètres de sécurité</h3>
          </div>
          <button @click="$emit('close'); $emit('open-password')"
            :class="['w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors flex items-center justify-between group', hoverBorderClass]">
            <div class="flex items-center">
              <IconKey :class="['w-6 h-6 text-gray-400 mr-4', hoverIconClass]" />
              <div class="text-left">
                <p class="font-medium text-gray-900 dark:text-white">Mot de passe</p>
                <p class="text-xs text-gray-500">Modifier votre mot de passe</p>
              </div>
            </div>
            <IconChevronRight class="w-5 h-5 text-gray-400" />
          </button>
          <button @click="$emit('close'); $emit('open-email')"
            :class="['w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors flex items-center justify-between group', hoverBorderClass]">
            <div class="flex items-center">
              <IconMail :class="['w-6 h-6 text-gray-400 mr-4', hoverIconClass]" />
              <div class="text-left">
                <p class="font-medium text-gray-900 dark:text-white">Adresse email</p>
                <p class="text-xs text-gray-500">{{ email }}</p>
              </div>
            </div>
            <IconChevronRight class="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconX, IconKey, IconMail, IconChevronRight } from '@tabler/icons-vue';

const props = defineProps<{
  show: boolean;
  email?: string;
  accentColor?: 'primary' | 'secondary';
}>();

defineEmits<{
  close: [];
  'open-password': [];
  'open-email': [];
}>();

const hoverBorderClass = computed(() => {
  return props.accentColor === 'secondary'
    ? 'hover:border-secondary-500'
    : 'hover:border-primary-500';
});

const hoverIconClass = computed(() => {
  return props.accentColor === 'secondary'
    ? 'group-hover:text-secondary-600'
    : 'group-hover:text-primary-600';
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
