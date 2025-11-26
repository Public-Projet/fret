<template>
  <div>
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0"
          style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');">
        </div>
      </div>

      <div class="container-custom relative z-10">
        <div class="py-20 md:py-32">
          <div class="max-w-4xl mx-auto text-center">
            <h1 class="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Connectez chargeurs et transporteurs
              <span class="block mt-2 text-secondary-400">en toute simplicité</span>
            </h1>
            <p class="text-xl md:text-2xl text-primary-100 mb-8 animate-slide-up">
              La plateforme moderne qui révolutionne le transport de marchandises
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <NuxtLink to="/register?role=shipper"
                class="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4">
                <TruckIcon class="w-6 h-6 mr-2" />
                Je suis chargeur
              </NuxtLink>
              <NuxtLink to="/register?role=carrier"
                class="btn bg-secondary-600 text-white hover:bg-secondary-700 text-lg px-8 py-4">
                <UserGroupIcon class="w-6 h-6 mr-2" />
                Je suis transporteur
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Wave separator -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="currentColor" class="text-gray-50 dark:text-gray-900" />
        </svg>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="section bg-gray-50 dark:bg-gray-900">
      <div class="container-custom">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Comment ça marche ?
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-400">
            Une plateforme simple et efficace pour tous vos besoins de transport
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="card p-8 text-center group hover:border-primary-500 transition-all">
            <div
              class="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <DocumentTextIcon class="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Publiez votre annonce
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Décrivez votre besoin de transport en quelques clics : origine, destination, type de marchandise et
              budget.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="card p-8 text-center group hover:border-primary-500 transition-all">
            <div
              class="w-16 h-16 bg-secondary-100 dark:bg-secondary-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <MagnifyingGlassIcon class="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Recevez des offres
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Les transporteurs consultent votre annonce et vous proposent leurs meilleurs tarifs.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="card p-8 text-center group hover:border-primary-500 transition-all">
            <div
              class="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <CheckCircleIcon class="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              3. Choisissez et validez
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Comparez les offres, négociez si besoin, et validez le transporteur de votre choix.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Advantages Section -->
    <section class="section bg-white dark:bg-gray-800">
      <div class="container-custom">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Pourquoi choisir FreightConnect ?
            </h2>
            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <div
                  class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShieldCheckIcon class="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Sécurité garantie
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    Tous nos transporteurs sont vérifiés. Vos marchandises sont entre de bonnes mains.
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div
                  class="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CurrencyEuroIcon class="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Meilleurs prix
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    Comparez les offres et négociez pour obtenir le meilleur rapport qualité-prix.
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div
                  class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ClockIcon class="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Gain de temps
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    Trouvez un transporteur en quelques minutes au lieu de plusieurs jours.
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div
                  class="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ChatBubbleLeftRightIcon class="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Communication directe
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    Messagerie intégrée pour échanger facilement avec les transporteurs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="relative">
            <div
              class="aspect-square bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl opacity-20 absolute inset-0 blur-3xl">
            </div>
            <div class="relative bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-2xl">
              <div class="space-y-6">
                <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                      <TruckIcon class="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900 dark:text-white">Transport Express</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Paris → Lyon</p>
                    </div>
                  </div>
                  <span class="badge badge-success">Accepté</span>
                </div>

                <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-secondary-600 rounded-full flex items-center justify-center">
                      <CubeIcon class="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900 dark:text-white">Palettes fragiles</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Marseille → Bordeaux</p>
                    </div>
                  </div>
                  <span class="badge badge-warning">En cours</span>
                </div>

                <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                      <TruckIcon class="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900 dark:text-white">Vrac matériaux</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Lille → Strasbourg</p>
                    </div>
                  </div>
                  <span class="badge badge-info">Nouveau</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
      <div class="container-custom text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          Prêt à démarrer ?
        </h2>
        <p class="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          Rejoignez des milliers d'utilisateurs qui font confiance à FreightConnect pour leurs transports
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/register" class="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4">
            Créer un compte gratuit
          </NuxtLink>
          <NuxtLink to="/announcements"
            class="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-4">
            Voir les annonces
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  TruckIcon,
  UserGroupIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  CurrencyEuroIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  CubeIcon
} from '@heroicons/vue/24/outline';

useHead({
  title: 'FreightConnect - Plateforme de mise en relation',
  meta: [
    {
      name: 'description',
      content: 'Connectez chargeurs et transporteurs en toute simplicité. La plateforme moderne qui révolutionne le transport de marchandises.'
    }
  ]
});
</script>
