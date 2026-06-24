<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
    <!-- Chiffre d'Affaires & Opportunités (Barres / Courbe) -->
    <div
      class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-[2rem] p-6 lg:p-8 shadow-xl border border-gray-100 dark:border-gray-700/50 relative overflow-hidden">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 class="text-xl font-black text-gray-900 dark:text-white">Performance financière</h3>
          <p class="text-xs text-gray-400 uppercase tracking-wider font-bold mt-1">Comparatif des revenus mensuels réels
            vs potentiels</p>
        </div>
        <div class="flex items-center gap-4 text-xs font-bold">
          <div class="flex items-center gap-1.5 text-emerald-500">
            <span class="w-3 h-3 rounded-md bg-emerald-500"></span>
            <span>Gagné</span>
          </div>
          <div class="flex items-center gap-1.5 text-indigo-500">
            <span class="w-3 h-3 rounded-md bg-indigo-500"></span>
            <span>Potentiel</span>
          </div>
        </div>
      </div>

      <!-- Graphique SVG Barres doubles interactif -->
      <div class="relative w-full h-64 mt-6">
        <svg viewBox="0 0 500 200" class="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="earnedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#10b981" />
              <stop offset="100%" stop-color="#059669" />
            </linearGradient>
            <linearGradient id="potentialGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#6366f1" />
              <stop offset="100%" stop-color="#4f46e5" />
            </linearGradient>
          </defs>

          <!-- Lignes horizontales de repère -->
          <line x1="0" y1="40" x2="500" y2="40" stroke="currentColor" class="text-gray-100 dark:text-gray-700/50"
            stroke-dasharray="4,4" />
          <line x1="0" y1="90" x2="500" y2="90" stroke="currentColor" class="text-gray-100 dark:text-gray-700/50"
            stroke-dasharray="4,4" />
          <line x1="0" y1="140" x2="500" y2="140" stroke="currentColor" class="text-gray-100 dark:text-gray-700/50"
            stroke-dasharray="4,4" />

          <!-- Tracé des barres -->
          <g v-for="(item, idx) in chartData" :key="idx">
            <!-- Barre Revenu Gagné (Vert) -->
            <rect :x="item.x - 14" :y="item.earnedY" width="12" :height="180 - item.earnedY" rx="4"
              fill="url(#earnedGrad)" class="cursor-pointer transition-all duration-500 hover:opacity-90"
              @mouseenter="triggerTooltip(idx, 'earned')" @mouseleave="hoveredBar = null" />
            <!-- Barre Revenu Potentiel (Bleu/Violet) -->
            <rect :x="item.x + 2" :y="item.potentialY" width="12" :height="180 - item.potentialY" rx="4"
              fill="url(#potentialGrad)" class="cursor-pointer transition-all duration-500 hover:opacity-90"
              @mouseenter="triggerTooltip(idx, 'potential')" @mouseleave="hoveredBar = null" />
          </g>
        </svg>

        <!-- Tooltip dynamique -->
        <div v-if="hoveredBar !== null"
          class="absolute bg-slate-900/90 dark:bg-slate-900 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl text-white pointer-events-none transition-all duration-150"
          :style="{
            left: `${(chartData[hoveredBar.index].x / 500) * 100}%`,
            top: `${((hoveredBar.type === 'earned' ? chartData[hoveredBar.index].earnedY : chartData[hoveredBar.index].potentialY) / 200) * 100 - 15}%`,
            transform: 'translate(-50%, -100%)'
          }">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ chartData[hoveredBar.index].month
            }}</p>
          <p class="text-xs font-semibold text-gray-300 mt-1">
            Revenu {{ hoveredBar.type === 'earned' ? 'Réel' : 'Potentiel' }} :
          </p>
          <p class="text-sm font-black mt-0.5"
            :class="hoveredBar.type === 'earned' ? 'text-emerald-400' : 'text-indigo-400'">
            {{ (hoveredBar.type === 'earned' ? chartData[hoveredBar.index].earned :
              chartData[hoveredBar.index].potential).toLocaleString() }} FCFA
          </p>
        </div>
      </div>

      <!-- Labels X -->
      <div
        class="flex justify-between px-6 mt-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
        <span v-for="item in chartData" :key="item.month">{{ item.month }}</span>
      </div>
    </div>

    <!-- Taux d'acceptation des offres (Radial Gauge) -->
    <div
      class="bg-white dark:bg-gray-800 rounded-[2rem] p-6 lg:p-8 shadow-xl border border-gray-100 dark:border-gray-700/50 flex flex-col justify-between">
      <div>
        <h3 class="text-xl font-black text-gray-900 dark:text-white">Taux d'acceptation</h3>
        <p class="text-xs text-gray-400 uppercase tracking-wider font-bold mt-1">Efficacité de vos propositions
          tarifaires</p>
      </div>

      <div class="relative flex items-center justify-center py-6">
        <svg width="180" height="180" viewBox="0 0 100 100" class="transform -rotate-90">
          <!-- Fond gris -->
          <circle cx="50" cy="50" r="38" fill="transparent" stroke="currentColor"
            class="text-gray-100 dark:text-gray-700/50" stroke-width="8" stroke-dasharray="180 250"
            stroke-linecap="round" transform="rotate(45 50 50)" />

          <!-- Jauge active (Dégradé indigo à émeraude) -->
          <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" stroke-width="10"
            :stroke-dasharray="activeStrokeDashArray" stroke-linecap="round"
            class="transition-all duration-1000 ease-out" transform="rotate(45 50 50)" />
        </svg>

        <!-- Texte central -->
        <div class="absolute flex flex-col items-center justify-center">
          <span class="text-4xl font-black text-gray-900 dark:text-white">{{ successRate }}%</span>
          <span
            class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Acceptation</span>
        </div>
      </div>

      <!-- Métriques de conversion -->
      <div class="grid grid-cols-2 gap-4">
        <div
          class="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
          <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Missions
            acceptées</span>
          <span class="text-lg font-black text-gray-800 dark:text-white mt-1 block">{{ acceptedOffersCount }}</span>
        </div>
        <div
          class="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
          <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Offres
            émises</span>
          <span class="text-lg font-black text-gray-800 dark:text-white mt-1 block">{{ activeOffersCount +
            acceptedOffersCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = withDefaults(defineProps<{
  activeOffersCount: number;
  acceptedOffersCount: number;
  potentialRevenue: number;
}>(), {
  activeOffersCount: 0,
  acceptedOffersCount: 0,
  potentialRevenue: 0
});

const hoveredBar = ref<{ index: number; type: 'earned' | 'potential' } | null>(null);

// Simuler des données mensuelles basées sur le CA potentiel du transporteur
const chartData = computed(() => {
  const baseRevenue = props.potentialRevenue || 2500000;
  return [
    { month: 'Fév', x: 50, earnedY: 140, potentialY: 110, earned: baseRevenue * 0.3, potential: baseRevenue * 0.45 },
    { month: 'Mar', x: 150, earnedY: 110, potentialY: 80, earned: baseRevenue * 0.5, potential: baseRevenue * 0.7 },
    { month: 'Avr', x: 250, earnedY: 120, potentialY: 100, earned: baseRevenue * 0.45, potential: baseRevenue * 0.55 },
    { month: 'Mai', x: 350, earnedY: 80, potentialY: 50, earned: baseRevenue * 0.75, potential: baseRevenue * 0.95 },
    { month: 'Juin', x: 450, earnedY: 50, potentialY: 40, earned: baseRevenue * 0.95, potential: baseRevenue * 1.1 }
  ];
});

// Taux de réussite (conversion)
const successRate = computed(() => {
  const total = props.activeOffersCount + props.acceptedOffersCount;
  if (total === 0) return 75; // Taux moyen par défaut
  return Math.round((props.acceptedOffersCount / total) * 100);
});

// Calcul de la jauge circulaire
const activeStrokeDashArray = computed(() => {
  // Le périmètre de la jauge arc (3/4 de cercle) est d'environ 180
  const rate = successRate.value / 100;
  const activeLength = 180 * rate;
  return `${activeLength} 250`;
});

const triggerTooltip = (index: number, type: 'earned' | 'potential') => {
  hoveredBar.value = { index, type };
};
</script>
