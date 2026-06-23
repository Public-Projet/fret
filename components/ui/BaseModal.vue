<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="$emit('close')">
        <!-- Conteneur de la Modal -->
        <div
          :class="['bg-WtB rounded-2xl shadow-2xl w-full p-6 space-y-4 border border-ash transition-all', maxWidthClass]">
          <div v-if="title || $slots.header" class="flex justify-between items-center">
            <slot name="header">
              <h3 class="text-xl font-bold text-BtW">{{ title }}</h3>
            </slot>

            <button @click="$emit('close')" class="top-3 right-3 p-1 hover:bg-WtBAct rounded-full">
              <IconX
                class="h-5 w-5 sm:h-6 sm:w-6 transform transition duration-300 ease-in-out hover:rotate-90 hover:text-danger" />
            </button>
          </div>

          <!-- Corps de la Modal -->
          <div class="relative max-h-[70vh] overflow-y-auto px-1 -mx-1 no-scrollbar">
            <slot />
          </div>

          <!-- Pied de page de la Modal -->
          <div v-if="$slots.footer" class="pt-4 border-t border-ash/30 flex justify-end gap-3">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue'
import { IconX } from '@tabler/icons-vue'

// Propriétés de la modal
const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  maxWidth: {
    type: String,
    default: 'md'
  }
})

const emit = defineEmits(['close'])

// Gestion de la touche Échap
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.show) {
    emit('close')
  }
}

// Surveillance de la visibilité pour attacher l'écouteur clavier
watch(() => props.show, (isVisible) => {
  if (import.meta.client) {
    if (isVisible) {
      window.addEventListener('keydown', handleKeydown)
    } else {
      window.removeEventListener('keydown', handleKeydown)
    }
  }
}, { immediate: true })

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', handleKeydown)
  }
})

// Définition de la largeur maximale de la modal
const maxWidthClass = computed(() => {
  switch (props.maxWidth) {
    case 'xs': return 'max-w-xs'
    case 'sm': return 'max-w-sm'
    case 'md': return 'max-w-md'
    case 'lg': return 'max-w-lg'
    case 'xl': return 'max-w-xl'
    case '2xl': return 'max-w-2xl'
    default: return 'max-w-md'
  }
})
</script>
