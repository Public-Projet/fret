<template>
  <div class="container-custom py-10 min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center space-x-4 mb-8">
        <button @click="$router.back()"
          class="p-2 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:text-primary-600 transition-colors">
          <IconChevronLeft class="w-6 h-6" />
        </button>
        <div>
          <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Nouvelle annonce</h1>
          <p class="text-gray-500 font-medium mt-1">Publiez votre demande de transport sur le réseau</p>
        </div>
      </div>

      <div
        class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-white dark:border-gray-700 overflow-hidden">
        <form @submit.prevent="handleSubmit">
          <!-- Informations générales -->
          <div class="p-8 lg:p-10">
            <div class="flex items-center space-x-3 mb-8">
              <div class="p-2.5 bg-primary-50 dark:bg-primary-900/30 rounded-xl text-primary-600">
                <IconInfoCircle class="w-6 h-6" />
              </div>
              <h2 class="text-xl font-black text-gray-900 dark:text-white">Informations générales</h2>
            </div>

            <div class="space-y-6">
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Titre de l'annonce</label>
                <input v-model="form.title" type="text" required
                  class="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none text-gray-900 dark:text-white placeholder-gray-400 font-medium"
                  placeholder="Ex: Transport de marchandise frigorifique Cotonou - Parakou" />
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description
                  détaillée</label>
                <textarea v-model="form.description" rows="4" required
                  class="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none text-gray-900 dark:text-white placeholder-gray-400 font-medium resize-none"
                  placeholder="Détails sur la marchandise, exigences particulières..."></textarea>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Type de
                    marchandise</label>
                  <div class="relative">
                    <select v-model="form.cargoType" required
                      class="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none text-gray-900 dark:text-white font-medium appearance-none">
                      <option value="palettes">📦 Palettes</option>
                      <option value="vrac">🌾 Vrac</option>
                      <option value="conteneur">🚢 Conteneur</option>
                      <option value="frigorifique">❄️ Frigorifique</option>
                      <option value="dangereux">⚠️ Dangereux</option>
                      <option value="autre">➕ Autre</option>
                    </select>
                    <IconChevronDown
                      class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Budget (FCFA)</label>
                  <div class="relative">
                    <input v-model.number="form.budget" type="number" required
                      class="w-full pl-5 pr-12 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none text-gray-900 dark:text-white placeholder-gray-400 font-bold"
                      placeholder="0" />
                    <span
                      class="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 tracking-tighter">FCFA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="px-8 lg:px-10 py-8 bg-gray-50/50 dark:bg-gray-900/20 border-y border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-3 mb-8">
              <div class="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600">
                <IconMapPin class="w-6 h-6" />
              </div>
              <h2 class="text-xl font-black text-gray-900 dark:text-white">Trajet & Dates</h2>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <!-- Départ -->
              <div class="space-y-6">
                <div class="flex items-center space-x-2 pb-2 border-b border-emerald-100 dark:border-emerald-900/30">
                  <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
                  <h3 class="text-sm font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Départ
                  </h3>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 mb-1 ml-1">Adresse précise</label>
                  <input v-model="form.origin.address" type="text" required
                    class="w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-sm font-medium" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1 ml-1">Ville</label>
                    <input v-model="form.origin.city" type="text" required
                      class="w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-sm font-medium" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1 ml-1">CP (Optionnel)</label>
                    <input v-model="form.origin.postalCode" type="text"
                      class="w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-sm font-medium" />
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 mb-1 ml-1">Date d'enlèvement</label>
                  <div class="relative">
                    <input v-model="form.pickupDate" type="datetime-local" required
                      class="w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-sm font-bold" />
                    <IconCalendar
                      class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <!-- Arrivée -->
              <div class="space-y-6">
                <div class="flex items-center space-x-2 pb-2 border-b border-primary-100 dark:border-primary-900/30">
                  <div class="w-2 h-2 rounded-full bg-primary-500 shadow-lg shadow-primary-500/50"></div>
                  <h3 class="text-sm font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest">
                    Arrivée</h3>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 mb-1 ml-1">Adresse précise</label>
                  <input v-model="form.destination.address" type="text" required
                    class="w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none text-sm font-medium" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1 ml-1">Ville</label>
                    <input v-model="form.destination.city" type="text" required
                      class="w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none text-sm font-medium" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1 ml-1">CP (Optionnel)</label>
                    <input v-model="form.destination.postalCode" type="text"
                      class="w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none text-sm font-medium" />
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 mb-1 ml-1">Date de livraison souhaitée</label>
                  <div class="relative">
                    <input v-model="form.deliveryDate" type="datetime-local" required
                      class="w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none text-sm font-bold" />
                    <IconCalendar
                      class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Dimensions -->
          <div class="p-8 lg:p-10">
            <div class="flex items-center space-x-3 mb-8">
              <div class="p-2.5 bg-amber-50 dark:bg-amber-900/30 rounded-xl text-amber-600">
                <IconScale class="w-6 h-6" />
              </div>
              <h2 class="text-xl font-black text-gray-900 dark:text-white">Dimensions & Poids</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="relative">
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Poids total</label>
                <div class="relative">
                  <input v-model.number="form.weight" type="number" required
                    class="w-full pl-5 pr-14 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none text-gray-900 dark:text-white font-bold" />
                  <span class="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400">KG</span>
                </div>
              </div>
              <div class="relative">
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Volume estimé</label>
                <div class="relative">
                  <input v-model.number="form.volume" type="number" required
                    class="w-full pl-5 pr-14 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none text-gray-900 dark:text-white font-bold" />
                  <span class="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400">m³</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="p-8 lg:p-10 bg-gray-50/80 dark:bg-gray-900/40 flex flex-col sm:flex-row justify-end gap-4">
            <button type="button" @click="$router.back()"
              class="px-8 py-4 rounded-2xl font-bold text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors">
              Annuler
            </button>
            <button type="submit"
              class="px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black transition-all hover:shadow-xl hover:shadow-primary-500/30 flex items-center justify-center min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
              :disabled="loading">
              <IconLoader2 v-if="loading" class="w-5 h-5 mr-2 animate-spin" />
              <IconRocket v-else
                class="w-5 h-5 mr-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              <span v-if="loading">Publication...</span>
              <span v-else>Publier l'annonce</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useShpAnnouncementStore } from '~/stores/shpAnnouncement';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { IconChevronLeft, IconInfoCircle, IconMapPin, IconCalendar, IconScale, IconRocket, IconLoader2, IconChevronDown } from '@tabler/icons-vue';
import type { CargoType } from '~/types';

const router = useRouter();
const shpAnnouncementStore = useShpAnnouncementStore();
const authStore = useCmnAuthStore();

const loading = ref(false);

const form = reactive({
  title: '',
  description: '',
  cargoType: 'palettes' as CargoType,
  budget: undefined as number | undefined,
  weight: undefined as number | undefined,
  volume: undefined as number | undefined,
  origin: {
    address: '',
    city: '',
    postalCode: '',
    country: 'Bénin',
  },
  destination: {
    address: '',
    city: '',
    postalCode: '',
    country: 'Bénin',
  },
  pickupDate: '',
  deliveryDate: '',
});

const handleSubmit = async () => {
  if (!authStore.currentUser) return;

  loading.value = true;
  try {
    const result = await shpAnnouncementStore.shpCreateAnnouncement({
      ...form,
      userId: authStore.currentUser.id,
      user: authStore.currentUser,
      budget: form.budget || 0,
      weight: form.weight || 0,
      volume: form.volume || 0,
    });

    if (result.success) {
      router.push('/app/us/offers');
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
useHead({
  title: 'Publier une offre de fret',
  meta: [
    { name: 'description', content: 'Créez une nouvelle annonce de fret pour vos expéditions.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
