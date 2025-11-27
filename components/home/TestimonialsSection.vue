<template>
  <section class="section bg-white dark:bg-gray-800">
    <div class="container-custom">
      <div class="text-center mb-16">
        <GradientBadge text="Témoignages" />
        <h2 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          Ils nous font confiance
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <TestimonialCard
          quote="FreightConnect a révolutionné notre logistique. Nous avons réduit nos coûts de 35% tout en améliorant nos délais de livraison."
          name="Marie Dupont" role="Directrice Logistique, IKEA" initials="MD" avatar-color="blue" />

        <TestimonialCard
          quote="Interface intuitive et transporteurs professionnels. J'ai trouvé mon transporteur en moins de 20 minutes!"
          name="Jean Martin" role="PDG, Decathlon" initials="JM" avatar-color="green" />

        <TestimonialCard
          quote="Grâce à FreightConnect, j'ai multiplié mes contrats par 3. La plateforme est parfaite pour nous, transporteurs."
          name="Pierre Leroy" role="Transporteur indépendant" initials="PL" avatar-color="blue" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import TestimonialCard from './TestimonialCard.vue';
import GradientBadge from '../common/GradientBadge.vue';
</script>
