<template>
  <section id="advantages"
    class="section bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
    <div class="container-custom">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <!-- Colonne gauche - Avantages -->
        <div>
          <UiGradientBadge text="Nos Avantages" variant="green" />
          <h2 class="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
            Pourquoi choisir
            <span class="block text-gradient">Bourse de Fret Bénin ?</span>
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-400 mb-10">
            Une plateforme complète qui simplifie chaque étape de votre logistique
          </p>

          <div class="space-y-6">
            <RootHomeAdvantagesItem :icon="IconShieldCheck" title="Sécurité garantie à 100%"
              description="Tous nos transporteurs sont vérifiés, certifiés et assurés. Vos marchandises sont protégées du départ à l'arrivée."
              icon-class="from-blue-500 to-blue-700" />

            <RootHomeAdvantagesItem :icon="IconTag" title="Economisez jusqu'à 40%"
              description="Comparez les offres en temps réel et négociez pour obtenir les meilleurs tarifs du marché."
              icon-class="from-green-500 to-green-700" />

            <RootHomeAdvantagesItem :icon="IconBolt" title="Rapidité incomparable"
              description="Trouvez un transporteur qualifié en moins de 30 minutes au lieu de plusieurs jours."
              icon-class="from-blue-500 to-blue-700" />

            <RootHomeAdvantagesItem :icon="IconMessage" title="Communication simplifiée"
              description="Messagerie instantanée intégrée, suivi en temps réel et notifications automatiques."
              icon-class="from-green-500 to-green-700" />
          </div>
        </div>

        <!-- Colonne droite - Mockup animé -->
        <div class="relative">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-3xl blur-3xl"></div>

          <!-- Mockup principal -->
          <div
            class="relative bg-white dark:bg-gray-800 rounded-3xl p-6 lg:p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
            <div class="space-y-4">
              <!-- En-tête mockup -->
              <div class="flex items-center justify-between mb-6">
                <h4 class="text-lg font-bold text-gray-900 dark:text-white">Aperçu rapide</h4>
                <span class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              </div>

              <!-- Cards transport -->
              <RootHomeAdvantagesCard icon-class="from-blue-500 to-blue-700" :icon="IconTruck" title="Transport Express"
                subtitle="Cotonou → Parakou" status="LIVRÉ" status-class="bg-green-500" weight="2.5 tonnes"
                price="180.000 FCFA" price-class="text-blue-600 dark:text-blue-400" />

              <RootHomeAdvantagesCard icon-class="from-green-500 to-green-700" :icon="IconCube"
                title="sssPalettes fragiles" subtitle="Bohicon → Covè" status="EN COURS"
                status-class="bg-yellow-500 animate-pulse" weight="1.8 tonnes" price="75.000 FCFA"
                price-class="text-green-600 dark:text-green-400" />

              <RootHomeAdvantagesCard icon-class="from-gray-500 to-gray-700" :icon="IconTruckDelivery"
                title="Vrac matériaux" subtitle="Abomey-Calavi → Comè" status="NOUVEAU" status-class="bg-blue-500"
                weight="5.0 tonnes" price="225.000FCFA" price-class="text-gray-600 dark:text-gray-400" />
            </div>

            <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            </div>
          </div>

          <!-- Stats flottantes -->
          <UiFloatingStats value="98%" label="Satisfaction" :icon="IconCircleCheck"
            position-classes="-top-6 -right-6 hidden sm:flex" icon-bg-color="bg-green-100 dark:bg-green-900/30"
            icon-color="text-green-600 dark:text-green-400" />

          <UiFloatingStats value="24/7" label="Support" :icon="IconBolt"
            position-classes="-bottom-6 -left-6 animation-delay-2000 hidden sm:flex"
            icon-bg-color="bg-blue-100 dark:bg-blue-900/30" icon-color="text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconBolt, IconCircleCheck, IconCube, IconMessage, IconShieldCheck, IconTag, IconTruck, IconTruckDelivery } from '@tabler/icons-vue';
</script>
