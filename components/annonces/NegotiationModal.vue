<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
      @click.self="$emit('close')">
      <div
        class="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <!-- Header -->
        <div
          class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/20">
          <div>
            <h3 class="text-xl font-black text-gray-900 dark:text-white">Négocier & Confirmer</h3>
            <p class="text-sm text-gray-500">Proposez vos conditions pour ce trajet</p>
          </div>
          <button @click="$emit('close')"
            class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
            <IconX class="w-6 h-6" />
          </button>
        </div>

        <div class="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <!-- Price Negotiation -->
          <section class="space-y-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-primary-600">
                <IconCurrencyDollar :size="20" />
              </div>
              <h4 class="font-bold text-gray-900 dark:text-white">Le Prix</h4>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <p class="text-xs text-gray-400 uppercase font-bold mb-1">Prix suggéré</p>
                <p class="text-lg font-black text-gray-900 dark:text-white">{{ originalPrice ? originalPrice + ' FCFA' :
                  'À définir' }}</p>
              </div>
              <div class="space-y-2">
                <label class="text-xs text-gray-400 uppercase font-bold pl-1">Votre proposition (FCFA)</label>
                <input v-model="form.price" type="number" step="1000" class="input group-hover:border-primary-500"
                  placeholder="Entrez votre prix..." />
              </div>
            </div>
          </section>

          <!-- Route Negotiation -->
          <section class="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-2 mb-2">
              <div class="p-2 bg-secondary-50 dark:bg-secondary-900/30 rounded-lg text-secondary-600">
                <IconMapPinFilled :size="20" />
              </div>
              <h4 class="font-bold text-gray-900 dark:text-white">Le Trajet</h4>
            </div>

            <div
              class="p-4 bg-secondary-50/30 dark:bg-secondary-900/10 rounded-2xl border border-secondary-100 dark:border-secondary-900/20 mb-4">
              <p class="text-xs text-secondary-600 dark:text-secondary-400 font-bold mb-2">Trajet initial :</p>
              <p class="text-sm font-medium">{{ originalOrigin.city }} → {{ originalDestination?.city || 'Ouvert' }}</p>
            </div>

            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-xs text-gray-400 uppercase font-bold pl-1 font-mono">Départ négocié</label>
                  <input v-model="form.origin.city" type="text" class="input text-sm"
                    placeholder="Ville de départ..." />
                </div>
                <div class="space-y-1">
                  <label class="text-xs text-gray-400 uppercase font-bold pl-1 font-mono">Arrivée négociée</label>
                  <input v-model="form.destination.city" type="text" class="input text-sm"
                    placeholder="Ville d'arrivée..." />
                </div>
              </div>
            </div>
          </section>

          <!-- Message -->
          <section class="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-2 mb-2">
              <div class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400">
                <IconMessageDots :size="20" />
              </div>
              <h4 class="font-bold text-gray-900 dark:text-white">Message (facultatif)</h4>
            </div>
            <textarea v-model="form.message" class="input min-h-[100px] text-sm py-3"
              placeholder="Précisez vos besoins ou conditions particulières..."></textarea>
          </section>
        </div>

        <!-- Footer -->
        <div class="p-6 bg-gray-50 dark:bg-gray-900/40 border-t border-gray-100 dark:border-gray-700 flex gap-4">
          <button @click="$emit('close')" class="flex-1 btn btn-outline py-4 rounded-2xl">
            Annuler
          </button>
          <div v-if="error"
            class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 text-red-600 rounded-2xl text-sm font-bold">
            {{ error }}
          </div>

          <button @click="handleSubmit" :disabled="loading" class="flex item-center btn btn-primary py-4 rounded-2xl">
            <IconLoader2 v-if="loading" class="w-5 h-5 animate-spin mr-2" />
            {{ loading ? 'Envoi...' : 'Envoyer la proposition' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { IconX, IconCurrencyDollar, IconMapPinFilled, IconMessageDots, IconLoader2 } from '@tabler/icons-vue';
import { useCarAvailabilityStore } from '~/stores/carAvailability';
import { useShpAnnouncementStore } from '~/stores/shpAnnouncement';
import { useCmnAuthStore } from '~/stores/cmnAuth';

const props = defineProps<{
  targetId: string;
  dataType: 'avail' | 'announcement';
  originalPrice?: number | string;
  originalOrigin: any;
  originalDestination?: any;
  initialData?: any; // For counter-proposals
}>();

const emit = defineEmits<{
  close: [];
  success: [];
}>();

const availStore = useCarAvailabilityStore();
const fretStore = useShpAnnouncementStore();
const authStore = useCmnAuthStore();

const loading = ref(false);
const error = ref('');

const form = reactive({
  price: props.initialData?.proposedPrice || props.initialData?.price || props.originalPrice || undefined,
  message: props.initialData?.notes || props.initialData?.message || '',
  origin: props.initialData?.proposedOrigin ? { ...props.initialData.proposedOrigin } : { ...props.originalOrigin },
  destination: props.initialData?.proposedDestination ? { ...props.initialData.proposedDestination } : (props.originalDestination ? { ...props.originalDestination } : { city: '', country: props.originalOrigin?.country || '' }),
});

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';

  try {
    let res;

    if (props.initialData) {
      const role = authStore.isShipper ? 'shipper' : 'carrier';
      if (props.dataType === 'avail') {
        res = await availStore.counterCarBooking(props.initialData.id, role, {
          proposedPrice: form.price,
          proposedOrigin: form.origin,
          proposedDestination: form.destination,
          notes: form.message
        });
      } else {
        res = await fretStore.counterShpOffer(props.initialData.id, role, {
          price: form.price,
          proposedOrigin: form.origin,
          proposedDestination: form.destination,
          message: form.message
        });
      }
    } else {
      // New proposal/enrollment
      if (props.dataType === 'avail') {
        res = await availStore.enrollAvailability(props.targetId, form);
      } else {
        res = await fretStore.createOffer(props.targetId, form);
      }
    }

    if (res.success) {
      emit('success');
    } else {
      error.value = (res as any).error || 'Une erreur est survenue';
    }
  } catch (err: any) {
    console.error('Negotiation error:', err);
    error.value = 'Erreur technique. Veuillez réessayer.';
  } finally {
    loading.value = false;
  }
};
</script>
