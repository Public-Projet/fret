<template>
  <section class="bg-gray-50 dark:bg-gray-900 py-12 overflow-hidden">
    <div class="container-custom">
      <p class="text-center text-gray-600 dark:text-gray-400 text-sm font-semibold mb-8 uppercase tracking-wider">
        Nos Partenaires de Confiance
      </p>

      <!-- Squelettes de chargement via AppSkeleton avec défilement infini -->
      <div v-if="contentStore.loading.partners" class="relative w-full overflow-hidden mask-gradient py-4">
        <div class="marquee-track flex w-max items-center gap-16 opacity-60">
          <UiAppSkeleton v-for="i in 24" :key="i" :loading="true" type="rectangle" width="110px" height="40px" radius="8px"
            animation-type="shimmer" class="shrink-0" />
        </div>
      </div>

      <!-- Partenaires chargés avec défilement infini -->
      <div v-else-if="contentStore.partners.length > 0" class="relative w-full overflow-hidden mask-gradient py-4">
        <div class="marquee-track flex w-max items-center gap-16 opacity-60 hover:pause-marquee">
          <!-- Un seul groupe d'éléments contenant la liste doublée via le JS -->
          <div v-for="partner in displayPartners" :key="partner.uniqueId"
            class="transition-all duration-300 hover:opacity-100 grayscale hover:grayscale-0 shrink-0">
            <template v-if="partner.logo">
              <img :src="partner.logo" :alt="partner.name" class="h-10 w-auto object-contain max-w-[150px]" />
            </template>
            <div v-else class="text-2xl md:text-3xl font-black text-gray-400 uppercase tracking-tighter">
              {{ partner.name }}
            </div>
          </div>
        </div>
      </div>

      <!-- Aucun partenaire après chargement : masquer la section -->
      <template v-else></template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { usePbcSiteContentStore } from '~/stores/pbcSiteContent';

const contentStore = usePbcSiteContentStore();

// Si on a peu de partenaires, on répète la liste pour remplir l'écran, et on la double pour l'effet infini
const displayPartners = computed(() => {
  const list = contentStore.partners;
  if (!list || list.length === 0) return [];

  const minItems = 10;
  const repetitions = Math.max(1, Math.ceil(minItems / list.length));

  // 1. Répéter la liste de base pour avoir assez d'éléments
  const baseList = [];
  for (let i = 0; i < repetitions; i++) {
    for (const partner of list) {
      baseList.push(partner);
    }
  }

  // 2. Dupliquer la liste complète (baseList) pour faire la boucle infinie de 50%
  const result = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < baseList.length; j++) {
      const partner = baseList[j];
      result.push({
        ...partner,
        uniqueId: `${partner.id}-${i}-${j}`
      });
    }
  }
  return result;
});

onMounted(() => {
  contentStore.fetchPartners();
});
</script>

<style scoped>
.mask-gradient {
  mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
}

.marquee-track {
  display: flex;
  /* La durée de l'animation */
  animation: marquee 60s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }

  100% {
    /* Traduction de la moitié exacte du conteneur (qui contient les 2 groupes) */
    transform: translateX(calc(-50% - 2rem));
  }
}

.hover\:pause-marquee:hover {
  animation-play-state: paused;
}
</style>
