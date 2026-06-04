<template>
  <template v-if="loading">
    <div :class="['flex flex-col', gapClasses[gap]]">
      <div v-for="i in count" :key="i" :class="[
        'relative overflow-hidden',
        themeClasses,
        typeClasses[type || 'rectangle'],
        animatedClass,
        customClass
      ]" :style="style">
        <!-- Effet de balayage Shimmer -->
        <div v-if="animated && animationType === 'shimmer'"
          class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 dark:via-white/20 to-transparent shimmer animate-shimmer">
        </div>

        <!-- Icône spécifique pour type image pour rendre le rendu premium -->
        <div v-if="type === 'image'"
          class="absolute inset-0 flex items-center justify-center text-gray-300 dark:text-gray-700">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
            </path>
          </svg>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <slot />
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Interface des propriétés du Skeleton
interface Props {
  loading?: boolean
  type?: 'text' | 'avatar' | 'circle' | 'square' | 'rectangle' | 'heading' | 'card' | 'table-row' | 'image'
  width?: string
  height?: string
  radius?: string
  count?: number
  animated?: boolean
  animationType?: 'shimmer' | 'pulse' | 'none'
  theme?: 'light' | 'dark' | 'auto'
  bgClass?: string
  gap?: '1' | '2' | '3' | '4' | '5' | '6' | '8'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: true,
  type: 'rectangle',
  count: 1,
  animated: true,
  animationType: 'shimmer',
  theme: 'auto',
  gap: '3',
  class: ''
})

const customClass = computed(() => props.class)

// Classes de styles prédéfinies selon le type (avec correction orthographique "rectangle")
const typeClasses: Record<string, string> = {
  text: 'h-4 w-full rounded-md',
  avatar: 'h-12 w-12 rounded-full shrink-0',
  circle: 'rounded-full shrink-0',
  square: 'rounded-2xl aspect-square',
  rectangle: 'rounded-2xl w-full h-12',
  heading: 'h-8 w-2/3 rounded-xl',
  card: 'h-36 w-full rounded-[2rem]',
  'table-row': 'h-16 w-full rounded-2xl',
  image: 'h-48 w-full rounded-[2.5rem]'
}

// Spécification de la couleur de fond par thème
const themeClasses = computed(() => {
  if (props.bgClass) return props.bgClass

  if (props.theme === 'light') {
    return 'bg-gray-200'
  } else if (props.theme === 'dark') {
    return 'bg-gray-700'
  } else {
    // Mode auto utilisant Tailwind dark mode
    return 'bg-gray-200 dark:bg-gray-700'
  }
})

// Détermination de la classe d'animation
const animatedClass = computed(() => {
  if (!props.animated || props.animationType === 'none') return ''
  if (props.animationType === 'pulse') return 'animate-pulse'
  return '' // shimmer est géré via la div interne absolue
})

// Spécification des écarts
const gapClasses = {
  '1': 'gap-1',
  '2': 'gap-2',
  '3': 'gap-3',
  '4': 'gap-4',
  '5': 'gap-5',
  '6': 'gap-6',
  '8': 'gap-8'
}

// Calcul dynamique des styles inline pour largeur, hauteur, rayon de bordure personnalisés
const style = computed(() => {
  const s: Record<string, string> = {}
  if (props.width) s.width = props.width
  if (props.height) s.height = props.height
  if (props.radius) s.borderRadius = props.radius
  return s
})
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 1.6s infinite cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
