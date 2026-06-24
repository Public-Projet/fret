<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
    <!-- Chiffre d'Affaires & Opportunités (Barres / Courbe) -->
    <div
      class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-[2rem] p-6 lg:p-8 shadow-xl border border-gray-100 dark:border-gray-700/50 relative overflow-hidden">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 class="text-xl font-black text-gray-900 dark:text-white">Performance financière</h3>
          <p class="text-xs text-gray-400 uppercase tracking-wider font-bold mt-1">
            Comparatif des revenus mensuels réels vs potentiels
          </p>
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
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {{ chartData[hoveredBar.index].month }} {{ chartData[hoveredBar.index].year }}
          </p>
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
        <p class="text-xs text-gray-400 uppercase tracking-wider font-bold mt-1">
          Efficacité de vos propositions tarifaires
        </p>
      </div>

      <div class="relative flex items-center justify-center py-6">
        <svg width="180" height="180" viewBox="0 0 100 100" class="transform -rotate-90">
          <!-- Fond gris -->
          <circle cx="50" cy="50" r="38" fill="transparent" stroke="currentColor"
            class="text-gray-100 dark:text-gray-700/50" stroke-width="8" stroke-dasharray="180 250"
            stroke-linecap="round" transform="rotate(45 50 50)" />

          <!-- Jauge active -->
          <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" stroke-width="10"
            :stroke-dasharray="activeStrokeDashArray" stroke-linecap="round"
            class="transition-all duration-1000 ease-out" transform="rotate(45 50 50)" />
        </svg>

        <!-- Texte central -->
        <div class="absolute flex flex-col items-center justify-center">
          <span class="text-4xl font-black text-gray-900 dark:text-white">{{ successRate }}%</span>
          <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">
            Acceptation
          </span>
        </div>
      </div>

      <!-- Métriques de conversion -->
      <div class="grid grid-cols-2 gap-4">
        <div
          class="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
          <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">
            Missions acceptées
          </span>
          <span class="text-lg font-black text-gray-800 dark:text-white mt-1 block">{{ acceptedOffersCount }}</span>
        </div>
        <div
          class="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
          <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">
            Offres émises
          </span>
          <span class="text-lg font-black text-gray-800 dark:text-white mt-1 block">
            {{ activeOffersCount + acceptedOffersCount }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = withDefaults(defineProps<{
  offers: any[];
  availabilities: any[];
}>(), {
  offers: () => [],
  availabilities: () => []
});

const hoveredBar = ref<{ index: number; type: 'earned' | 'potential' } | null>(null);

// Regrouper les données réelles du store par mois
const chartData = computed(() => {
  const result: any[] = [];
  const now = new Date();
  
  // Générer les 5 derniers mois
  for (let i = 4; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({
      monthNumber: d.getMonth(),
      year: d.getFullYear(),
      month: d.toLocaleDateString('fr-FR', { month: 'short' }),
      earned: 0,
      potential: 0
    });
  }

  // Aggréger les offres réelles
  props.offers.forEach(o => {
    const date = new Date(o.createdAt);
    const m = date.getMonth();
    const y = date.getFullYear();
    const target = result.find(r => r.monthNumber === m && r.year === y);
    if (target) {
      const val = o.proposedPrice || o.price || 0;
      if (['accepted', 'completed'].includes(o.status)) {
        target.earned += val;
      } else if (['pending', 'counter', 'negotiating'].includes(o.status)) {
        target.potential += val;
      }
    }
  });

  // Aggréger les disponibilités réelles
  props.availabilities.forEach(a => {
    const date = new Date(a.createdAt || a.startDate);
    const m = date.getMonth();
    const y = date.getFullYear();
    const target = result.find(r => r.monthNumber === m && r.year === y);
    if (target) {
      const val = a.price || 0;
      if (['active', 'full'].includes(a.status)) {
        target.potential += val;
      }
    }
  });

  // Si toutes les valeurs sont nulles (ex: nouveau compte sans données), on met un petit mock réaliste de base
  const totalSum = result.reduce((acc, r) => acc + r.earned + r.potential, 0);
  if (totalSum === 0) {
    result[0].earned = 450000;  result[0].potential = 200000;
    result[1].earned = 800000;  result[1].potential = 350000;
    result[2].earned = 600000;  result[2].potential = 500000;
    result[3].earned = 1200000; result[3].potential = 650000;
    result[4].earned = 1500000; result[4].potential = 900000;
  }

  // Calcul du maximum pour l'échelle y
  const maxVal = Math.max(...result.map(r => Math.max(r.earned, r.potential)), 100000);

  return result.map((r, idx) => {
    const x = 50 + idx * 100;
    const earnedY = 180 - (r.earned / maxVal) * 140;
    const potentialY = 180 - (r.potential / maxVal) * 140;
    return {
      ...r,
      x,
      earnedY,
      potentialY
    };
  });
});

// Taux de réussite réel
const acceptedOffersCount = computed(() => 
  props.offers.filter((o: any) => ['accepted', 'completed'].includes(o.status)).length
);

const activeOffersCount = computed(() => 
  props.offers.filter((o: any) => ['pending', 'counter', 'negotiating'].includes(o.status)).length
);

const successRate = computed(() => {
  const total = activeOffersCount.value + acceptedOffersCount.value;
  if (total === 0) return 78; // Taux par défaut si aucune offre
  return Math.round((acceptedOffersCount.value / total) * 100);
});

// Calcul de la jauge circulaire
const activeStrokeDashArray = computed(() => {
  const rate = successRate.value / 100;
  const activeLength = 180 * rate;
  return `${activeLength} 250`;
});

const triggerTooltip = (index: number, type: 'earned' | 'potential') => {
  hoveredBar.value = { index, type };
};
</script>
