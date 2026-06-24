<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
    <div
      class="group bg-gradient-to-br from-blue-500 to-indigo-700 p-6 rounded-[2rem] shadow-xl shadow-blue-500/20 relative overflow-hidden transition-all hover:scale-[1.02]">
      <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
        <IconTruck class="w-24 h-24" />
      </div>
      <IconTruck class="w-8 h-8 text-white/90 mb-4" />
      <div>
        <p class="text-xs lg:text-sm font-bold text-blue-100 uppercase tracking-wider mb-1">Disponibilités</p>
        <p class="text-3xl lg:text-4xl font-black text-white">{{ activeAvailabilitiesCount }}</p>
      </div>
    </div>

    <div
      class="group bg-gradient-to-br from-amber-500 to-orange-700 p-6 rounded-[2rem] shadow-xl shadow-amber-500/20 relative overflow-hidden transition-all hover:scale-[1.02]">
      <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
        <IconSend class="w-24 h-24" />
      </div>
      <IconSend class="w-8 h-8 text-white/90 mb-4" />
      <div>
        <p class="text-xs lg:text-sm font-bold text-amber-50/90 uppercase tracking-wider mb-1">Offres en cours</p>
        <p class="text-3xl lg:text-4xl font-black text-white">{{ activeOffersCount }}</p>
      </div>
    </div>

    <div
      class="group bg-gradient-to-br from-emerald-500 to-teal-700 p-6 rounded-[2rem] shadow-xl shadow-emerald-500/20 relative overflow-hidden transition-all hover:scale-[1.02]">
      <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
        <IconCircleCheck class="w-24 h-24" />
      </div>
      <IconCircleCheck class="w-8 h-8 text-white/90 mb-4" />
      <div>
        <p class="text-xs lg:text-sm font-bold text-emerald-50/90 uppercase tracking-wider mb-1">Missions</p>
        <p class="text-3xl lg:text-4xl font-black text-white">{{ acceptedOffersCount }}</p>
      </div>
    </div>

    <div
      class="group bg-gradient-to-br from-purple-500 to-indigo-800 p-6 rounded-[2rem] shadow-xl shadow-purple-500/20 relative overflow-hidden transition-all hover:scale-[1.02]">
      <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
        <IconCurrencyEuro class="w-24 h-24" />
      </div>
      <IconCurrencyEuro class="w-8 h-8 text-white/90 mb-4" />
      <div>
        <p class="text-xs lg:text-sm font-bold text-purple-50/90 uppercase tracking-wider mb-1">CA Potentiel</p>
        <p class="text-2xl lg:text-3xl font-black text-white leading-tight">{{ potentialRevenue.toLocaleString() }}
          <span class="text-sm">FCFA</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconTruck, IconSend, IconCircleCheck, IconCurrencyEuro } from '@tabler/icons-vue';

defineProps<{
  activeAvailabilitiesCount: number;
  activeOffersCount: number;
  acceptedOffersCount: number;
  potentialRevenue: number;
}>();
</script>
