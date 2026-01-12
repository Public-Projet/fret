<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
    <!-- Hero Section -->
    <div class="relative bg-gray-900 py-24 sm:py-32 overflow-hidden">
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Contact Support" class="w-full h-full object-cover opacity-20" />
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
      </div>
      <div class="relative container-custom text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-6">Contactez notre équipe</h1>
        <p class="text-lg text-gray-300 max-w-2xl mx-auto">
          Une question sur nos services ? Besoin d'aide pour une expédition ?
          Nous sommes là pour vous accompagner 24/7.
        </p>
      </div>
    </div>

    <!-- Contact Content -->
    <div class="container-custom -mt-20 pb-20 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Contact Info Cards -->
        <div class="space-y-6 lg:col-span-1">
          <!-- Card 1 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <div
              class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6">
              <IconMail class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Email</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Notre équipe vous répond sous 24h.</p>
            <a href="mailto:contact@boursefret.bj"
              class="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              contact@boursefret.bj
            </a>
          </div>

          <!-- Card 2 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <div
              class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
              <IconPhone class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Téléphone</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Du Lundi au Vendredi, 8h-18h.</p>
            <a href="tel:+22901000000" class="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              +229 01 00 00 00
            </a>
          </div>

          <!-- Card 3 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <div
              class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 mb-6">
              <IconMapPin class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Bureau</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Venez nous rencontrer.</p>
            <p class="text-gray-900 dark:text-white font-medium">
              Zone Commerciale Ganhi,<br />Cotonou, Bénin
            </p>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="lg:col-span-2">
          <div
            class="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-700 h-full">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Envoyez-nous un message</h2>
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label for="firstName"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prénom</label>
                  <input type="text" id="firstName" v-model="form.firstName" required
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                    placeholder="Jean" />
                </div>
                <div>
                  <label for="lastName"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom</label>
                  <input type="text" id="lastName" v-model="form.lastName" required
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                    placeholder="Dossou" />
                </div>
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input type="email" id="email" v-model="form.email" required
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                  placeholder="jean.dossou@exemple.com" />
              </div>

              <div>
                <label for="subject"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sujet</label>
                <select id="subject" v-model="form.subject" required
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all">
                  <option value="" disabled>Sélectionnez un sujet</option>
                  <option value="support">Support Technique</option>
                  <option value="sales">Commercial / Devis</option>
                  <option value="partnership">Partenariat</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label for="message"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                <textarea id="message" v-model="form.message" rows="5" required
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder-gray-400 resize-none"
                  placeholder="Comment pouvons-nous vous aider ?"></textarea>
              </div>

              <div class="flex items-center">
                <input id="privacy" type="checkbox" required
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer">
                <label for="privacy" class="ml-2 block text-sm text-gray-600 dark:text-gray-400">
                  J'accepte la <NuxtLink to="/l/privacy" class="text-primary-600 hover:underline">politique de
                    confidentialité</NuxtLink>.
                </label>
              </div>

              <button type="submit" :disabled="isLoading"
                class="w-full btn btn-primary py-4 rounded-xl font-bold flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed">
                <span v-if="!isLoading">Envoyer le message</span>
                <span v-else class="flex items-center gap-2">
                  <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Envoi...
                </span>
                <IconSend v-if="!isLoading" class="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { IconMail, IconPhone, IconMapPin, IconSend } from '@tabler/icons-vue';

useHead({
  title: 'Contact'
});

definePageMeta({
  layout: 'guest'
});

const isLoading = ref(false);

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: ''
});

const handleSubmit = async () => {
  isLoading.value = true;

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Reset form
  form.firstName = '';
  form.lastName = '';
  form.email = '';
  form.subject = '';
  form.message = '';

  isLoading.value = false;
  alert('Votre message a été envoyé avec succès ! Nous vous recontacterons très bientôt.');
};
</script>
