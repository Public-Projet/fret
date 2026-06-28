<template>
  <noscript>
    <div class="fixed inset-0 z-[10000] bg-slate-950 flex items-center justify-center p-6 text-center">
      <div class="max-w-md space-y-6 animate-fade-in text-center">
        <div
          class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20">
          <IconPower class="w-10 h-10 text-primary" />
        </div>
        <div class="space-y-2 text-center">
          <h1 class="text-2xl font-black text-WtB tracking-tight">JavaScript requis</h1>
          <p class="text-ash font-medium">CYPASS nécessite l'activation de JavaScript pour fonctionner. Merci de
            l'activer dans les réglages de votre navigateur.</p>
        </div>
        <a href="/"
          class="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-WtB font-bold hover:bg-primary/90 transition-all">
          Réessayer
        </a>
      </div>
    </div>
  </noscript>
</template>

<script setup lang="ts">
import { IconPower } from '@tabler/icons-vue'
</script>
