<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-1 ml-1" v-if="label">
      <label class="block text-xs font-bold text-gray-500">{{ label }}</label>
      <button type="button" @click="openMapModal" class="text-xs text-primary-600 hover:text-primary-700 font-bold flex items-center transition-colors px-2 py-1 bg-primary-50 rounded-lg hover:bg-primary-100">
        <IconMapPin class="w-4 h-4 mr-1" />
        Choisir sur la carte
      </button>
    </div>

    <!-- Country / City -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Pays</label>
        <div class="relative group">
          <select v-model="localValue.country" @change="onCountryChange" class="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none appearance-none">
            <option value="" disabled>Sélectionner un pays</option>
            <option v-for="c in countries" :key="c.isoCode" :value="c.name">{{ c.name }}</option>
          </select>
          <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-primary-600 transition-colors" />
        </div>
      </div>
      <div>
        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Ville</label>
        <div class="relative group">
          <input type="text" v-model="localValue.city" :list="`cities-list-${uid}`" 
             placeholder="Ex: Cotonou"
             class="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none" 
            />
          <datalist :id="`cities-list-${uid}`">
             <option v-for="city in availableCities" :key="city.name" :value="city.name"></option>
          </datalist>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="md:col-span-2">
         <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Adresse précise (Optionnel)</label>
         <input v-model="localValue.address" type="text" placeholder="Avenue, Quartier, etc."
           class="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none" />
      </div>
      <div>
         <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Code Postal (Optionnel)</label>
         <input v-model="localValue.postalCode" type="text" placeholder="Ex: 00229"
           class="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none" />
      </div>
    </div>

    <!-- Map Modal -->
    <div v-if="showMap" class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
      <div class="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-[85vh] animate-fade-in-up">
        <!-- Modal Header -->
        <div class="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 z-10 relative">
           <div>
              <h3 class="font-black text-gray-900 dark:text-white text-xl">Sélectionnez le lieu</h3>
              <p class="text-sm font-medium text-gray-500 mt-1">Cliquez sur la carte pour définir l'emplacement exact et générer l'adresse.</p>
           </div>
           <button type="button" @click="closeMap" class="p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-2xl transition-colors shrink-0 outline-none focus:ring-2 focus:ring-gray-200">
              <IconX class="w-6 h-6 text-gray-500 dark:text-gray-300" />
           </button>
        </div>
        <!-- Modal Body (Leaflet map) -->
        <div class="flex-1 relative bg-gray-100 dark:bg-gray-900">
           <ClientOnly>
               <div :id="`leaflet-map-${uid}`" class="absolute inset-0 z-0"></div>
               <div v-if="mapLoading" class="absolute inset-0 z-10 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm flex flex-col items-center justify-center">
                 <IconLoader2 class="w-10 h-10 animate-spin text-primary-600 mb-4" />
                 <span class="text-sm font-bold text-gray-700 dark:text-gray-300">Chargement...</span>
               </div>
           </ClientOnly>
        </div>
        <!-- Modal Footer -->
        <div class="p-5 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 relative">
           <div class="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1 w-full">
             <div v-if="selectedFromMap.city" class="flex flex-col">
               <span class="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1">Lieu sélectionné</span>
               <span class="text-primary-700 dark:text-primary-300 font-bold text-base truncate">
                 {{ selectedFromMap.city }}, {{ selectedFromMap.country }}
               </span>
               <span v-if="selectedFromMap.address" class="text-xs text-gray-500 mt-1 truncate">{{ selectedFromMap.address }}</span>
             </div>
             <div v-else class="text-gray-400 italic">Aucun lieu sélectionné. Veuillez cliquer sur la carte.</div>
           </div>
           <div class="flex gap-3 w-full sm:w-auto shrink-0">
             <button type="button" @click="closeMap" class="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl font-bold text-gray-700 dark:text-gray-200 transition-colors w-full sm:w-auto">Annuler</button>
             <button type="button" @click="confirmMapSelection" :disabled="!selectedFromMap.city" class="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/30 w-full sm:w-auto">Confirmer le lieu</button>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';
import { Country, City } from 'country-state-city';
import { IconMapPin, IconChevronDown, IconX, IconLoader2 } from '@tabler/icons-vue';
import 'leaflet/dist/leaflet.css';

const uid = Math.random().toString(36).substr(2, 9);

const props = defineProps<{
  modelValue: {
    country: string;
    city: string;
    address?: string;
    postalCode?: string;
  };
  label?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();

// Local State
const localValue = ref({ ...props.modelValue });
if (!localValue.value.country) {
  localValue.value.country = 'Bénin';
}

const countries = ref<{ name: string; isoCode: string }[]>([]);
const availableCities = ref<{ name: string }[]>([]);

const showMap = ref(false);
const mapLoading = ref(false);
const selectedFromMap = ref({ city: '', country: '', address: '', postalCode: '' });

let mapInstance: any = null;
let markerInstance: any = null;

onMounted(() => {
  countries.value = Country.getAllCountries().map(c => ({ name: c.name, isoCode: c.isoCode }));
  initCitiesForCurrentCountry();
});

watch(() => props.modelValue, (newVal) => {
  localValue.value = { ...newVal, country: newVal.country || 'Bénin' };
  initCitiesForCurrentCountry();
}, { deep: true });

watch(localValue, (newVal) => {
  emit('update:modelValue', newVal);
}, { deep: true });

const onCountryChange = () => {
    localValue.value.city = '';
    initCitiesForCurrentCountry();
}

const initCitiesForCurrentCountry = () => {
  const country = countries.value.find(c => c.name === localValue.value.country);
  if (country) {
    availableCities.value = City.getCitiesOfCountry(country.isoCode) || [];
  } else {
    availableCities.value = [];
  }
};

const openMapModal = async () => {
  showMap.value = true;
  selectedFromMap.value = { city: localValue.value.city, country: localValue.value.country, address: localValue.value.address || '', postalCode: localValue.value.postalCode || '' };
  
  await nextTick();
  setTimeout(() => {
    if (process.client) {
      initLeaflet();
    }
  }, 100);
};

const closeMap = () => {
  showMap.value = false;
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
    markerInstance = null;
  }
};

const confirmMapSelection = () => {
  localValue.value.city = selectedFromMap.value.city;
  localValue.value.country = selectedFromMap.value.country;
  if (selectedFromMap.value.address) localValue.value.address = selectedFromMap.value.address;
  if (selectedFromMap.value.postalCode) localValue.value.postalCode = selectedFromMap.value.postalCode;
  
  initCitiesForCurrentCountry();
  closeMap();
};

const initLeaflet = async () => {
  try {
    mapLoading.value = true;
    const L = await import('leaflet');
    
    // Default config: Center on Benin (or the selected country)
    let lat = 9.3077;
    let lng = 2.3158;
    let zoomLevel = 6;

    const el = document.getElementById(`leaflet-map-${uid}`);
    if (!el) return;

    // Fix marker icons globally for Nuxt bounds
    const iconRetinaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png';
    const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
    const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';
    
    const DefaultIcon = L.icon({
        iconUrl,
        iconRetinaUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    mapInstance = L.map(el).setView([lat, lng], zoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(mapInstance);

    // If geolocation is available, recenter
    if (navigator.geolocation && !localValue.value.city) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
          zoomLevel = 13;
          if (mapInstance) mapInstance.setView([lat, lng], zoomLevel);
        },
        () => { /* ignore */ },
        { timeout: 5000 }
      );
    }

    mapInstance.on('click', async (e: any) => {
      const { lat, lng } = e.latlng;
      if (markerInstance) {
        markerInstance.setLatLng(e.latlng);
      } else {
        markerInstance = L.marker([lat, lng]).addTo(mapInstance);
      }
      
      await reverseGeocode(lat, lng);
    });

  } catch (err) {
    console.error('Error loading map', err);
  } finally {
    mapLoading.value = false;
  }
};

const reverseGeocode = async (lat: number, lon: number) => {
  mapLoading.value = true;
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
    const data = await res.json();
    if (data && data.address) {
      const addr = data.address;
      selectedFromMap.value.country = addr.country || '';
      selectedFromMap.value.city = addr.city || addr.town || addr.village || addr.county || '';
      selectedFromMap.value.postalCode = addr.postcode || '';
      selectedFromMap.value.address = addr.road ? `${addr.road}${addr.house_number ? ' ' + addr.house_number : ''}` : (addr.suburb || '');
    }
  } catch (err) {
    console.error('Geocoding error', err);
  } finally {
    mapLoading.value = false;
  }
};
</script>
<style>
/* Smooth map fade in */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out forwards;
}
</style>
