<template>
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
            <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom</label>
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
          <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Téléphone
            (Facultatif)</label>
          <input type="tel" id="phone" v-model="form.phone"
            class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
            placeholder="+229 01 23 45 67" />
        </div>

        <div>
          <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sujet</label>
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
          <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
          <textarea id="message" v-model="form.message" rows="5" required
            class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder-gray-400 resize-none"
            placeholder="Comment pouvons-nous vous aider ?"></textarea>
        </div>

        <div class="flex items-center">
          <input id="privacy" type="checkbox" v-model="form.privacy" required
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

    <!-- Success Modal -->
    <div v-if="showSuccess"
      class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all">
        <div class="text-center mb-6">
          <div
            class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-400">
            <IconCheck class="w-8 h-8" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message envoyé !</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Merci de nous avoir contactés. Votre numéro de ticket est :
          </p>
        </div>

        <div
          class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6 flex items-center justify-between border border-gray-200 dark:border-gray-600">
          <code class="font-mono text-lg font-bold text-primary-600 dark:text-primary-400">{{ ticketNumber }}</code>
          <button @click="copyTicket"
            class="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
            title="Copier">
            <IconCopy v-if="!copied" class="w-5 h-5" />
            <IconCheck v-else class="w-5 h-5 text-green-500" />
          </button>
        </div>

        <button @click="closeSuccess" class="w-full btn btn-primary py-3 rounded-xl font-bold">
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { IconSend, IconCheck, IconCopy } from '@tabler/icons-vue';
import { useAPI } from '~/composables/useAPI';

const isLoading = ref(false);
const showSuccess = ref(false);
const ticketNumber = ref('');
const copied = ref(false);
const api = useAPI();

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  privacy: false
});

const handleSubmit = async () => {
  if (!form.privacy) {
    alert('Veuillez accepter la politique de confidentialité.');
    return;
  }

  isLoading.value = true;

  try {
    const response = await api.post<{ ticketNumber: string }>('/public/contact/submit', form);

    if (response.success && response.data) {
      ticketNumber.value = response.data.ticketNumber;
      showSuccess.value = true;

      // Reset form
      form.firstName = '';
      form.lastName = '';
      form.email = '';
      form.phone = '';
      form.subject = '';
      form.message = '';
      form.privacy = false;
    } else {
      alert('Erreur lors de l\'envoi : ' + (response.error || 'Une erreur est survenue.'));
    }
  } catch (err) {
    console.error(err);
    alert('Une erreur technique est survenue.');
  } finally {
    isLoading.value = false;
  }
};

const copyTicket = () => {
  navigator.clipboard.writeText(ticketNumber.value);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
};

const closeSuccess = () => {
  showSuccess.value = false;
  ticketNumber.value = '';
};
</script>
