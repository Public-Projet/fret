<template>
  <div
    class="bg-gradient-to-br from-gray-900 to-slate-800 dark:from-slate-900 dark:to-black rounded-[2rem] p-8 text-center relative overflow-hidden shadow-2xl">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent)]"></div>
    <div class="relative z-10 flex flex-col items-center">
      <div
        class="w-20 h-20 bg-primary-500/20 rounded-[2rem] flex items-center justify-center mb-6 rotate-12 group-hover:rotate-0 transition-transform">
        <IconRocket class="w-10 h-10 text-primary-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
      </div>
      <h3 class="text-2xl font-black text-white mb-3">Boostez vos transports</h3>
      <p class="text-slate-400 dark:text-gray-400 mb-8 leading-relaxed">
        Trouvez instantanément le transporteur idéal pour vos marchandises à travers tout le Bénin.
      </p>
      <NuxtLink to="/app/us/offers/create"
        class="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black shadow-xl shadow-primary-900/20 active:scale-95 transition-all flex items-center justify-center gap-2">
        <IconPlus class="w-6 h-6" />
        CRÉER UNE ANNONCE
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconRocket, IconPlus } from '@tabler/icons-vue';
</script>
