<template>
  <section class="bg-gray-50 dark:bg-gray-900 py-12 overflow-hidden">
    <div class="container-custom">
      <p class="text-center text-gray-600 dark:text-gray-400 text-sm font-semibold mb-8 uppercase tracking-wider">
        Nos Partenaires de Confiance
      </p>

      <!-- Squelettes de chargement via AppSkeleton -->
      <div v-if="contentStore.loading.partners" class="flex flex-wrap justify-center items-center gap-10">
        <UiAppSkeleton v-for="i in 5" :key="i" :loading="true" type="rectangle" width="110px" height="40px" radius="8px"
          animation-type="shimmer" />
      </div>

      <!-- Partenaires chargés avec défilement infini -->
      <div v-else-if="contentStore.partners.length > 0" class="relative w-full overflow-hidden mask-gradient py-4">
        <div class="marquee-track flex w-max items-center gap-16 opacity-60 hover:pause-marquee">
          <!-- Premier groupe de partenaires -->
          <div class="flex items-center gap-16 shrink-0">
            <div v-for="partner in contentStore.partners" :key="partner.id"
              class="transition-all duration-300 hover:opacity-100 grayscale hover:grayscale-0 shrink-0">
              <template v-if="partner.logo">
                <img :src="partner.logo" :alt="partner.name" class="h-10 w-auto object-contain max-w-[150px]" />
              </template>
              <div v-else class="text-2xl md:text-3xl font-black text-gray-400 uppercase tracking-tighter">
                {{ partner.name }}
              </div>
            </div>
          </div>
          <!-- Second groupe identique pour la boucle infinie -->
          <div class="flex items-center gap-16 shrink-0" aria-hidden="true">
            <div v-for="partner in contentStore.partners" :key="`dup-${partner.id}`"
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
      </div>

      <!-- Aucun partenaire après chargement : masquer la section -->
      <template v-else></template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { usePbcSiteContentStore } from '~/stores/pbcSiteContent';

const contentStore = usePbcSiteContentStore();

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
  /* La durée de l'animation peut être ajustée selon le nombre de partenaires */
  animation: marquee 25s linear infinite;
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
