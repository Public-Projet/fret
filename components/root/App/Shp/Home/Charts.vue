<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
    <!-- Dépenses logistiques (Courbe interactive) -->
    <div
      class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-[2rem] p-6 lg:p-8 shadow-xl border border-gray-100 dark:border-gray-700/50 relative overflow-hidden">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 class="text-xl font-black text-gray-900 dark:text-white">Analyse des coûts</h3>
          <p class="text-xs text-gray-400 uppercase tracking-wider font-bold mt-1">Évolution mensuelle du budget de fret
          </p>
        </div>
        <div
          class="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 p-1.5 rounded-xl border border-gray-100 dark:border-gray-800">
          <button v-for="tab in ['Trimestre', 'Année']" :key="tab" @click="activePeriod = tab" :class="[
            'px-3 py-1.5 text-xs font-black rounded-lg transition-all',
            activePeriod === tab
              ? 'bg-primary-600 text-white shadow-md'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          ]">
            {{ tab }}
          </button>
        </div>
      </div>

      <!-- Graphique SVG Courbe + Barres -->
      <div class="relative w-full h-64 mt-6">
        <svg viewBox="0 0 500 200" class="w-full h-full overflow-visible">
          <defs>
            <!-- Gradients -->
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgb(59, 130, 246)" stop-opacity="0.25" />
              <stop offset="100%" stop-color="rgb(59, 130, 246)" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#3b82f6" />
              <stop offset="50%" stop-color="#6366f1" />
              <stop offset="100%" stop-color="#10b981" />
            </linearGradient>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(99, 102, 241, 0.4)" />
              <stop offset="100%" stop-color="rgba(99, 102, 241, 0.05)" />
            </linearGradient>
          </defs>

          <!-- Lignes horizontales de repère -->
          <line x1="0" y1="40" x2="500" y2="40" stroke="currentColor" class="text-gray-100 dark:text-gray-700/50"
            stroke-dasharray="4,4" />
          <line x1="0" y1="90" x2="500" y2="90" stroke="currentColor" class="text-gray-100 dark:text-gray-700/50"
            stroke-dasharray="4,4" />
          <line x1="0" y1="140" x2="500" y2="140" stroke="currentColor" class="text-gray-100 dark:text-gray-700/50"
            stroke-dasharray="4,4" />

          <!-- Barres de fond de volume (simulé) -->
          <g>
            <rect v-for="(pt, idx) in chartData" :key="'bar-' + idx" :x="pt.x - 12" :y="pt.barY" width="24"
              :height="180 - pt.barY" rx="4" fill="url(#barGrad)" class="transition-all duration-700" />
          </g>

          <!-- Zone remplie sous la courbe -->
          <path :d="areaPath" fill="url(#areaGrad)" class="transition-all duration-700" />

          <!-- Courbe de budget principal -->
          <path :d="linePath" fill="none" stroke="url(#lineGrad)" stroke-width="4" stroke-linecap="round"
            class="transition-all duration-700" />

          <!-- Points interactifs -->
          <g>
            <circle v-for="(pt, idx) in chartData" :key="'dot-' + idx" :cx="pt.x" :cy="pt.y" r="6" fill="#3b82f6"
              stroke="#ffffff" stroke-width="2.5"
              class="cursor-pointer hover:r-8 transition-all shadow-md dark:stroke-gray-800"
              @mouseenter="hoveredIndex = idx" @mouseleave="hoveredIndex = null" />
          </g>
        </svg>

        <!-- Tooltip dynamique -->
        <div v-if="hoveredIndex !== null"
          class="absolute bg-slate-900/90 dark:bg-slate-900 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl text-white pointer-events-none transition-all duration-150"
          :style="{
            left: `${(chartData[hoveredIndex].x / 500) * 100}%`,
            top: `${(chartData[hoveredIndex].y / 200) * 100 - 30}%`,
            transform: 'translate(-50%, -100%)'
          }">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ chartData[hoveredIndex].month }}
          </p>
          <p class="text-sm font-black text-emerald-400 mt-0.5">{{ (chartData[hoveredIndex].budget).toLocaleString() }}
            FCFA</p>
          <p class="text-[10px] font-medium text-blue-300">{{ chartData[hoveredIndex].volume }} tonnes acheminées</p>
        </div>
      </div>

      <!-- Labels X -->
      <div
        class="flex justify-between px-2 mt-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
        <span v-for="pt in chartData" :key="pt.month">{{ pt.month }}</span>
      </div>
    </div>

    <!-- Répartition des Chargements (Donut Interactif) -->
    <div
      class="bg-white dark:bg-gray-800 rounded-[2rem] p-6 lg:p-8 shadow-xl border border-gray-100 dark:border-gray-700/50 flex flex-col justify-between">
      <div>
        <h3 class="text-xl font-black text-gray-900 dark:text-white">Statut des frets</h3>
        <p class="text-xs text-gray-400 uppercase tracking-wider font-bold mt-1">Avancement des livraisons</p>
      </div>

      <div class="relative flex items-center justify-center py-6">
        <svg width="180" height="180" viewBox="0 0 100 100" class="transform -rotate-90">
          <!-- Fond gris -->
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor"
            class="text-gray-100 dark:text-gray-700/50" stroke-width="12" />

          <!-- Terminés (Vert) -->
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" stroke-width="12" :stroke-dasharray="251.2"
            :stroke-dashoffset="dashOffsets.completed" stroke-linecap="round" class="transition-all duration-1000" />

          <!-- En cours (Orange) -->
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" stroke-width="12" :stroke-dasharray="251.2"
            :stroke-dashoffset="dashOffsets.negotiating" :transform="`rotate(${angles.negotiating} 50 50)`"
            stroke-linecap="round" class="transition-all duration-1000" />

          <!-- En attente (Bleu) -->
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" stroke-width="12" :stroke-dasharray="251.2"
            :stroke-dashoffset="dashOffsets.pending" :transform="`rotate(${angles.pending} 50 50)`"
            stroke-linecap="round" class="transition-all duration-1000" />
        </svg>

        <!-- Texte central -->
        <div class="absolute flex flex-col items-center justify-center">
          <span class="text-3xl font-black text-gray-900 dark:text-white">{{ totalLoads }}</span>
          <span
            class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Marchandises</span>
        </div>
      </div>

      <!-- Légende stylisée -->
      <div class="grid grid-cols-3 gap-2 mt-2">
        <div
          class="flex flex-col items-center p-2.5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 mb-1"></span>
          <span class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Livrés</span>
          <span class="text-sm font-black text-gray-800 dark:text-white mt-0.5">{{ completedCount }}</span>
        </div>
        <div
          class="flex flex-col items-center p-2.5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500 mb-1"></span>
          <span class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Négocs</span>
          <span class="text-sm font-black text-gray-800 dark:text-white mt-0.5">{{ negotiatingCount }}</span>
        </div>
        <div
          class="flex flex-col items-center p-2.5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-500 mb-1"></span>
          <span class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">En
            attente</span>
          <span class="text-sm font-black text-gray-800 dark:text-white mt-0.5">{{ activeAnnouncementsCount -
            negotiatingCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = withDefaults(defineProps<{
  activeAnnouncementsCount: number;
  negotiatingCount: number;
  completedCount: number;
  totalBudget: number;
}>(), {
  activeAnnouncementsCount: 0,
  negotiatingCount: 0,
  completedCount: 0,
  totalBudget: 0
});

const activePeriod = ref('Trimestre');
const hoveredIndex = ref<number | null>(null);

// Simuler des données mensuelles basées sur le budget total
const chartData = computed(() => {
  const baseBudget = props.totalBudget || 4200000;
  const isYear = activePeriod.value === 'Année';

  if (isYear) {
    return [
      { month: 'Jan', x: 25, y: 130, barY: 150, budget: baseBudget * 0.4, volume: 45 },
      { month: 'Mar', x: 100, y: 110, barY: 130, budget: baseBudget * 0.6, volume: 72 },
      { month: 'Mai', x: 175, y: 140, barY: 160, budget: baseBudget * 0.5, volume: 55 },
      { month: 'Jul', x: 250, y: 80, barY: 100, budget: baseBudget * 0.9, volume: 110 },
      { month: 'Sep', x: 325, y: 90, barY: 110, budget: baseBudget * 0.8, volume: 95 },
      { month: 'Nov', x: 400, y: 60, barY: 70, budget: baseBudget * 1.2, volume: 140 },
      { month: 'Déc', x: 475, y: 50, barY: 60, budget: baseBudget * 1.4, volume: 165 },
    ];
  } else {
    // Trimestre
    return [
      { month: 'Avril', x: 50, y: 130, barY: 140, budget: baseBudget * 0.7, volume: 68 },
      { month: 'Mai', x: 162.5, y: 90, barY: 105, budget: baseBudget * 1.1, volume: 105 },
      { month: 'Juin', x: 275, y: 60, barY: 80, budget: baseBudget * 1.4, volume: 145 },
      { month: 'Juillet', x: 387.5, y: 85, barY: 90, budget: baseBudget * 1.2, volume: 120 },
      { month: 'Août', x: 450, y: 50, barY: 55, budget: baseBudget * 1.6, volume: 180 },
    ];
  }
});

// Générer le tracé SVG
const linePath = computed(() => {
  const pts = chartData.value;
  if (pts.length === 0) return '';
  return `M ${pts[0].x} ${pts[0].y} ` + pts.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
});

const areaPath = computed(() => {
  const pts = chartData.value;
  if (pts.length === 0) return '';
  const first = pts[0];
  const last = pts[pts.length - 1];
  return `M ${first.x} 180 L ${first.x} ${first.y} ` +
    pts.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') +
    ` L ${last.x} 180 Z`;
});

// Donut math
const totalLoads = computed(() => {
  const pending = Math.max(0, props.activeAnnouncementsCount - props.negotiatingCount);
  return props.completedCount + props.negotiatingCount + pending;
});

const dashOffsets = computed(() => {
  const total = totalLoads.value || 1;
  const pending = Math.max(0, props.activeAnnouncementsCount - props.negotiatingCount);

  const compShare = props.completedCount / total;
  const negShare = props.negotiatingCount / total;
  const pendShare = pending / total;

  return {
    completed: 251.2 * (1 - compShare),
    negotiating: 251.2 * (1 - negShare),
    pending: 251.2 * (1 - pendShare)
  };
});

const angles = computed(() => {
  const total = totalLoads.value || 1;
  const pending = Math.max(0, props.activeAnnouncementsCount - props.negotiatingCount);

  const compShare = props.completedCount / total;
  const negShare = props.negotiatingCount / total;

  const compAngle = compShare * 360;
  const negAngle = negShare * 360;

  return {
    completed: 0,
    negotiating: compAngle,
    pending: compAngle + negAngle
  };
});
</script>
