<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
    <div
      class="group bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-[2rem] shadow-xl shadow-blue-500/20 relative overflow-hidden transition-all hover:scale-[1.02]">
      <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
        <IconFileText class="w-24 h-24" />
      </div>
      <IconFileText class="w-8 h-8 text-white/90 mb-4" />
      <div>
        <p class="text-xs lg:text-sm font-bold text-blue-100 uppercase tracking-wider mb-1">Annonces actives</p>
        <p class="text-3xl lg:text-4xl font-black text-white">{{ activeAnnouncementsCount }}</p>
      </div>
    </div>

    <div
      class="group bg-gradient-to-br from-amber-400 to-orange-600 p-6 rounded-[2rem] shadow-xl shadow-amber-500/20 relative overflow-hidden transition-all hover:scale-[1.02]">
      <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
        <IconMessage class="w-24 h-24" />
      </div>
      <IconMessage class="w-8 h-8 text-white/90 mb-4" />
      <div>
        <p class="text-xs lg:text-sm font-bold text-amber-50/90 uppercase tracking-wider mb-1">Négociations</p>
        <p class="text-3xl lg:text-4xl font-black text-white">{{ negotiatingCount }}</p>
      </div>
    </div>

    <div
      class="group bg-gradient-to-br from-emerald-500 to-teal-700 p-6 rounded-[2rem] shadow-xl shadow-green-500/20 relative overflow-hidden transition-all hover:scale-[1.02]">
      <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
        <IconCircleCheck class="w-24 h-24" />
      </div>
      <IconCircleCheck class="w-8 h-8 text-white/90 mb-4" />
      <div>
        <p class="text-xs lg:text-sm font-bold text-emerald-50/90 uppercase tracking-wider mb-1">Chargements</p>
        <p class="text-3xl lg:text-4xl font-black text-white">{{ completedCount }}</p>
      </div>
    </div>

    <div
      class="group bg-gradient-to-br from-indigo-500 to-purple-700 p-6 rounded-[2rem] shadow-xl shadow-indigo-500/20 relative overflow-hidden transition-all hover:scale-[1.02]">
      <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
        <IconCurrencyEuro class="w-24 h-24" />
      </div>
      <IconCurrencyEuro class="w-8 h-8 text-white/90 mb-4" />
      <div>
        <p class="text-xs lg:text-sm font-bold text-indigo-50/90 uppercase tracking-wider mb-1">Budget total</p>
        <p class="text-2xl lg:text-3xl font-black text-white leading-tight">
          {{ totalBudget.toLocaleString() }} <span class="text-sm">FCFA</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconFileText, IconMessage, IconCircleCheck, IconCurrencyEuro } from '@tabler/icons-vue';

defineProps<{
  activeAnnouncementsCount: number;
  negotiatingCount: number;
  completedCount: number;
  totalBudget: number;
}>();
</script>
