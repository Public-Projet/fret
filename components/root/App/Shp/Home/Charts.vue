<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
    <!-- Dépenses logistiques (Courbe interactive) -->
    <div
      class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-[2rem] p-6 lg:p-8 shadow-xl border border-gray-100 dark:border-gray-700/50 relative overflow-hidden">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 class="text-xl font-black text-gray-900 dark:text-white">Analyse des coûts</h3>
          <p class="text-xs text-gray-400 uppercase tracking-wider font-bold mt-1">
            Évolution mensuelle du budget de fret
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

          <!-- Barres de fond de volume -->
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
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {{ chartData[hoveredIndex].month }} {{ chartData[hoveredIndex].year }}
          </p>
          <p class="text-sm font-black text-emerald-400 mt-0.5">
            {{ (chartData[hoveredIndex].budget).toLocaleString() }} FCFA
          </p>
          <p class="text-[10px] font-medium text-blue-300">
            {{ chartData[hoveredIndex].volume.toFixed(1) }} tonnes acheminées
          </p>
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
  announcements: any[];
  enrollments: any[];
}>(), {
  announcements: () => [],
  enrollments: () => []
});

const activePeriod = ref('Trimestre');
const hoveredIndex = ref<number | null>(null);

// Regrouper les données réelles du store par mois
const chartData = computed(() => {
  const result: any[] = [];
  const now = new Date();
  const isYear = activePeriod.value === 'Année';
  const steps = isYear ? 7 : 5;

  for (let i = steps - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({
      monthNumber: d.getMonth(),
      year: d.getFullYear(),
      month: d.toLocaleDateString('fr-FR', { month: isYear ? 'short' : 'long' }),
      budget: 0,
      volume: 0
    });
  }

  // Aggréger les annonces réelles
  props.announcements.forEach(a => {
    const date = new Date(a.createdAt);
    const m = date.getMonth();
    const y = date.getFullYear();
    const target = result.find(r => r.monthNumber === m && r.year === y);
    if (target) {
      let val = a.budget || 0;
      if (a.offers && a.offers.length > 0) {
        const acceptedOffer = a.offers.find((o: any) => ['accepted', 'confirmed'].includes(o.status));
        if (acceptedOffer) {
          val = acceptedOffer.proposedPrice || acceptedOffer.price || val;
        }
      }
      target.budget += val;
      target.volume += a.weight ? a.weight / 1000 : 0.5; // volume en tonnes
    }
  });

  // Aggréger les inscriptions réelles (souscriptions)
  props.enrollments.forEach(e => {
    const date = new Date(e.createdAt);
    const m = date.getMonth();
    const y = date.getFullYear();
    const target = result.find(r => r.monthNumber === m && r.year === y);
    if (target) {
      const val = e.proposedPrice || e.price || e.availability?.price || 0;
      target.budget += val;
      target.volume += 1.2;
    }
  });

  // Fallback si pas de données réelles
  const totalSum = result.reduce((acc, r) => acc + r.budget, 0);
  if (totalSum === 0) {
    if (isYear) {
      result[0].budget = 800000;  result[0].volume = 4.5;
      result[1].budget = 1200000; result[1].volume = 7.2;
      result[2].budget = 900000;  result[2].volume = 5.5;
      result[3].budget = 1800000; result[3].volume = 11.0;
      result[4].budget = 1500000; result[4].volume = 9.5;
      result[5].budget = 2400000; result[5].volume = 14.0;
      result[6].budget = 2800000; result[6].volume = 16.5;
    } else {
      result[0].budget = 1400000; result[0].volume = 6.8;
      result[1].budget = 2200000; result[1].volume = 10.5;
      result[2].budget = 2800000; result[2].volume = 14.5;
      result[3].budget = 2400000; result[3].volume = 12.0;
      result[4].budget = 3200000; result[4].volume = 18.0;
    }
  }

  const maxBudget = Math.max(...result.map(r => r.budget), 200000);
  const maxVolume = Math.max(...result.map(r => r.volume), 5);

  return result.map((r, idx) => {
    const totalSteps = result.length;
    const x = 30 + (idx / (totalSteps - 1)) * 440;
    const y = 170 - (r.budget / maxBudget) * 120;
    const barY = 170 - (r.volume / maxVolume) * 90;
    return {
      ...r,
      x,
      y,
      barY
    };
  });
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

// Calcul de la répartition des chargements
const activeAnnouncementsCount = computed(() => {
  const activeOffers = props.announcements.filter(a => ['pending', 'negotiating'].includes(a.status)).length;
  const activeEnrollments = props.enrollments.filter((e: any) => ['pending', 'negotiating', 'countered'].includes(e.status)).length;
  return activeOffers + activeEnrollments;
});

const negotiatingCount = computed(() => {
  const negOffers = props.announcements.filter(a => a.status === 'negotiating').length;
  const negEnrollments = props.enrollments.filter((e: any) => ['negotiating', 'countered'].includes(e.status)).length;
  return negOffers + negEnrollments;
});

const completedCount = computed(() => {
  const compOffers = props.announcements.filter(a => a.status === 'completed').length;
  const compEnrollments = props.enrollments.filter((e: any) => ['completed', 'accepted'].includes(e.status)).length;
  return compOffers + compEnrollments;
});

const totalLoads = computed(() => {
  const pending = Math.max(0, activeAnnouncementsCount.value - negotiatingCount.value);
  return completedCount.value + negotiatingCount.value + pending;
});

const dashOffsets = computed(() => {
  const total = totalLoads.value || 1;
  const pending = Math.max(0, activeAnnouncementsCount.value - negotiatingCount.value);

  const compShare = completedCount.value / total;
  const negShare = negotiatingCount.value / total;
  const pendShare = pending / total;

  return {
    completed: 251.2 * (1 - compShare),
    negotiating: 251.2 * (1 - negShare),
    pending: 251.2 * (1 - pendShare)
  };
});

const angles = computed(() => {
  const total = totalLoads.value || 1;
  const pending = Math.max(0, activeAnnouncementsCount.value - negotiatingCount.value);

  const compShare = completedCount.value / total;
  const negShare = negotiatingCount.value / total;

  const compAngle = compShare * 360;
  const negAngle = negShare * 360;

  return {
    completed: 0,
    negotiating: compAngle,
    pending: compAngle + negAngle
  };
});
</script>
