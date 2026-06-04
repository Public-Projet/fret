<template>
  <div :class="['step-loading-container w-full font-sans', sizeClasses[size]]">
    <!-- MODE: REPLACE (Un seul texte avec transition, idéal pour boutons) -->
    <div v-if="mode === 'replace'" class="relative flex items-center justify-center overflow-hidden h-8">
      <Transition name="step-replace-fade" mode="out-in">
        <div :key="currentIndex" class="flex items-center space-x-2">
          <!-- Spinner de chargement -->
          <svg v-if="currentIndex < processedSteps.length - 1" :class="['animate-spin w-4 h-4', textColors[color]]"
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          <!-- Coche de succès pour la finalisation -->
          <svg v-else class="w-4 h-4 text-emerald-500 animate-bounce-slow" fill="none" stroke="currentColor"
            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="font-bold tracking-wide transition-colors duration-200">
            {{ currentStepLabel }}
          </span>
        </div>
      </Transition>
    </div>

    <!-- MODE: CASCADE (Les étapes s'empilent joliment l'une après l'autre) -->
    <div v-else-if="mode === 'cascade'" class="space-y-3.5 py-2">
      <TransitionGroup name="step-cascade-list" tag="div" class="space-y-3">
        <div v-for="(step, index) in visibleCascadeSteps" :key="step.label"
          class="flex items-center space-x-4 p-3.5 rounded-2xl border transition-all duration-300" :class="[
            index === currentIndex
              ? 'bg-white dark:bg-gray-800/80 shadow-md border-gray-100 dark:border-gray-700/80 scale-[1.02] translate-x-1'
              : index < currentIndex
                ? 'bg-gray-50/50 dark:bg-gray-900/20 border-transparent opacity-60'
                : 'border-transparent opacity-0'
          ]">
          <!-- Indicateur d'état de l'étape -->
          <div class="flex-shrink-0">
            <!-- Étape complétée -->
            <div v-if="index < currentIndex"
              class="w-6 h-6 rounded-full bg-emerald-500/15 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <!-- Étape en cours -->
            <div v-else-if="index === currentIndex"
              :class="['w-6 h-6 rounded-full flex items-center justify-center relative', bgColors[color]]">
              <!-- Effet pulse d'arrière-plan -->
              <span class="absolute inline-flex h-full w-full rounded-full animate-ping opacity-30"
                :class="bgColors[color]"></span>
              <svg class="animate-spin w-3 h-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
            </div>
          </div>

          <!-- Libellé de l'étape -->
          <div class="flex-grow">
            <p class="font-bold text-sm tracking-wide" :class="[
              index === currentIndex ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
            ]">
              {{ step.label }}
            </p>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- MODE: INLINE (Stepper progressif horizontal) -->
    <div v-else-if="mode === 'inline'" class="py-4">
      <div class="relative flex items-center justify-between w-full">
        <!-- Barre de progression en arrière-plan -->
        <div class="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 dark:bg-gray-800 rounded-full z-0">
          <div class="h-full rounded-full transition-all duration-500 ease-out" :class="bgColors[color]"
            :style="{ width: `${progressPercentage}%` }"></div>
        </div>

        <!-- Étapes individuelles -->
        <div v-for="(step, index) in processedSteps" :key="step.label"
          class="relative z-10 flex flex-col items-center group cursor-default"
          :style="{ width: `${100 / processedSteps.length}%` }">
          <!-- Pastille de l'étape -->
          <div class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300"
            :class="[
              index < currentIndex
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : index === currentIndex
                  ? 'bg-white dark:bg-gray-900 border-2 text-white shadow-xl scale-110 z-20'
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600'
            ]" :style="index === currentIndex ? { borderColor: colorHexCodes[color] || '#3b82f6' } : {}">
            <!-- Bulle active avec un point animé à l'intérieur -->
            <div v-if="index === currentIndex"
              class="w-3.5 h-3.5 rounded-full relative flex items-center justify-center" :class="bgColors[color]">
              <span class="absolute inline-flex h-full w-full rounded-full animate-ping opacity-75"
                :class="bgColors[color]"></span>
            </div>

            <!-- Étape complétée (Coche) -->
            <svg v-else-if="index < currentIndex" class="w-5 h-5 text-white" fill="none" stroke="currentColor"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5" d="M5 13l4 4L19 7"></path>
            </svg>

            <!-- Étape à venir (Index) -->
            <span v-else class="text-xs font-black">{{ index + 1 }}</span>
          </div>

          <!-- Libellé de l'étape -->
          <span
            class="mt-3 text-[11px] font-black uppercase tracking-widest text-center px-1 max-w-[120px] transition-colors duration-300"
            :class="[
              index === currentIndex
                ? 'text-gray-900 dark:text-white'
                : index < currentIndex
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-gray-400 dark:text-gray-600'
            ]">
            {{ step.label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

// Types pour les étapes
type StepObject = { label: string; duration?: string | number }
type StepInput = string | StepObject

interface Props {
  steps: StepInput[]
  activeStep?: number
  autoPlay?: boolean
  duration?: string | number
  mode?: 'replace' | 'cascade' | 'inline'
  includeBoundaries?: boolean
  loop?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'success' | 'white' | 'gray'
}

const props = withDefaults(defineProps<Props>(), {
  autoPlay: true,
  duration: '1s',
  mode: 'replace',
  includeBoundaries: true,
  loop: false,
  size: 'md',
  color: 'primary'
})

const emit = defineEmits<{
  (e: 'complete'): void
  (e: 'step-change', index: number, label: string): void
}>()

// État local de l'index actif
const localIndex = ref(0)
let timerId: ReturnType<typeof setTimeout> | null = null

// Traiter la durée passée (convertit en millisecondes)
const parseDuration = (val: string | number): number => {
  if (typeof val === 'number') return val
  const clean = val.toLowerCase().trim()
  if (clean.endsWith('ms')) return parseFloat(clean)
  if (clean.endsWith('s')) return parseFloat(clean) * 1000
  if (clean.endsWith('min') || clean.endsWith('m')) return parseFloat(clean) * 60 * 1000
  return parseFloat(clean) || 1000
}

// Nettoyage et structuration des étapes
const processedSteps = computed<Required<StepObject>[]>(() => {
  const inputSteps = props.steps.map((step) => {
    if (typeof step === 'string') {
      return { label: step }
    }
    return step
  })

  // Ajouter automatiquement Initialisation et Finalisation si configuré
  const hasInit = inputSteps.length > 0 && inputSteps[0].label.toLowerCase().includes('initialis')
  const hasFinal = inputSteps.length > 0 && inputSteps[inputSteps.length - 1].label.toLowerCase().includes('finalis')

  const list: StepObject[] = []
  if (props.includeBoundaries && !hasInit) {
    list.push({ label: 'Initialisation' })
  }

  list.push(...inputSteps)

  if (props.includeBoundaries && !hasFinal) {
    list.push({ label: 'Finalisation' })
  }

  // Compléter les durées manquantes
  return list.map((step) => ({
    label: step.label,
    duration: step.duration !== undefined ? parseDuration(step.duration) : parseDuration(props.duration)
  }))
})

// Détermination de l'index en cours (local ou prop externe)
const currentIndex = computed(() => {
  if (props.activeStep !== undefined) {
    return Math.max(0, Math.min(props.activeStep, processedSteps.value.length - 1))
  }
  return localIndex.value
})

const currentStepLabel = computed(() => {
  if (processedSteps.value.length === 0) return ''
  return processedSteps.value[currentIndex.value]?.label || ''
})

// Détermination des étapes visibles en mode Cascade
const visibleCascadeSteps = computed(() => {
  // En mode cascade, on n'affiche que les étapes jusqu'à l'étape actuelle
  return processedSteps.value.slice(0, currentIndex.value + 1)
})

// Pourcentage d'avancement pour le mode Inline (de 0 à 100)
const progressPercentage = computed(() => {
  if (processedSteps.value.length <= 1) return 0
  return (currentIndex.value / (processedSteps.value.length - 1)) * 100
})

// Émission de l'événement de changement
watch(currentIndex, (newVal) => {
  const label = processedSteps.value[newVal]?.label || ''
  emit('step-change', newVal, label)

  if (newVal === processedSteps.value.length - 1) {
    emit('complete')
  }
})

// Gestion de la temporisation automatique
const startTimer = () => {
  clearTimer()
  if (!props.autoPlay || props.activeStep !== undefined) return

  const currentStepInfo = processedSteps.value[localIndex.value]
  if (!currentStepInfo) return

  const durationMs = typeof currentStepInfo.duration === 'number'
    ? currentStepInfo.duration
    : parseDuration(currentStepInfo.duration)

  timerId = setTimeout(() => {
    if (localIndex.value < processedSteps.value.length - 1) {
      localIndex.value++
      startTimer()
    } else if (props.loop) {
      localIndex.value = 0
      startTimer()
    }
  }, durationMs)
}

const clearTimer = () => {
  if (timerId) {
    clearTimeout(timerId)
    timerId = null
  }
}

// Écouter les modifications des étapes pour réinitialiser
watch(() => props.steps, () => {
  if (props.activeStep === undefined) {
    localIndex.value = 0
    startTimer()
  }
}, { deep: true })

// Écouter autoPlay pour démarrer/arrêter
watch(() => props.autoPlay, (newVal) => {
  if (newVal) {
    startTimer()
  } else {
    clearTimer()
  }
})

// Synchroniser localIndex avec activeStep s'il est utilisé en mode contrôlé externe
watch(() => props.activeStep, (newVal) => {
  if (newVal !== undefined) {
    clearTimer()
  }
})

onMounted(() => {
  startTimer()
})

onBeforeUnmount(() => {
  clearTimer()
})

// Configuration des styles Tailwind
const sizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base'
}

const textColors = {
  primary: 'text-primary-600 dark:text-primary-400',
  secondary: 'text-secondary-600 dark:text-secondary-400',
  success: 'text-emerald-500 dark:text-emerald-400',
  white: 'text-white',
  gray: 'text-gray-500 dark:text-gray-400'
}

const bgColors = {
  primary: 'bg-primary-600',
  secondary: 'bg-secondary-600',
  success: 'bg-emerald-500',
  white: 'bg-white',
  gray: 'bg-gray-500'
}

const colorHexCodes = {
  primary: '#3b82f6', // primary-500
  secondary: '#22c55e', // secondary-500 (emerald/green)
  success: '#10b981',
  white: '#ffffff',
  gray: '#6b7280'
}
</script>

<style scoped>
/* Transition Replace: Entrée par le bas, Sortie par le haut */
.step-replace-fade-enter-active,
.step-replace-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.step-replace-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.step-replace-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* Transition Cascade: Entrée fluide avec zoom/glissement */
.step-cascade-list-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.step-cascade-list-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.95);
}

/* Micro-animations */
.animate-bounce-slow {
  animation: bounceSlow 2s infinite;
}

@keyframes bounceSlow {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }
}
</style>
