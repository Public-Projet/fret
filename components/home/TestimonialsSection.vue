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
          quote="Bourse de Fret Bénin a révolutionné notre logistique. Nous avons réduit nos coûts de 35% tout en améliorant nos délais de livraison."
          name="Isaac Agossou" role="Directeur Logistique, IKEA" initials="IA" avatar-color="blue" />

        <TestimonialCard
          quote="Interface intuitive et transporteurs professionnels. J'ai trouvé mon transporteur en moins de 20 minutes!"
          name="Jean Tossou" role="PDG, Azonnagbò" initials="JT" avatar-color="green" />

        <TestimonialCard
          quote="Grâce à Bourse de Fret, j'ai multiplié mes contrats par 3. La plateforme est parfaite pour nous, transporteurs."
          name="Pierre Cossou" role="Transporteur indépendant" initials="PC" avatar-color="yellow" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { TestimonialCard } from "@/components/home";
import { GradientBadge } from "@/components/common";
</script>
