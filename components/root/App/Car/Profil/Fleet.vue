<template>
  <section>
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center">
        <IconTruck class="w-5 h-5 mr-2 text-secondary-600" />
        Ma Flotte
      </h3>
      <button v-if="!loading && vehicles.length > 0" @click="$emit('add-vehicle')"
        class="btn btn-secondary btn-xs flex items-center">
        <IconPlus class="w-3 h-3 mr-1" />
        Ajouter
      </button>
    </div>

    <UiAppSkeleton :loading="loading" type="card" :count="2" gap="4">
      <div v-if="vehicles.length === 0"
        class="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
        <IconTruck class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p class="text-gray-500 dark:text-gray-400 mb-4">Aucun véhicule enregistré</p>
        <button @click="$emit('add-vehicle')" class="mx-auto flex items-center btn btn-secondary btn-sm">
          <IconPlus class="w-4 h-4 mr-1" />
          Ajouter un véhicule
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="vehicle in vehicles" :key="vehicle.id"
          class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h4 class="font-bold text-gray-900 dark:text-white">{{ vehicle.brand }} {{ vehicle.model }}</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 font-mono">{{ vehicle.licensePlate }}</p>
            </div>
            <div class="flex space-x-1">
              <button @click="$emit('edit-vehicle', vehicle)"
                class="p-1.5 text-gray-400 hover:text-secondary-600 transition-colors bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                title="Modifier">
                <IconPencil class="w-3.5 h-3.5" />
              </button>
              <button @click="$emit('delete-vehicle', vehicle.id)"
                class="p-1.5 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                title="Supprimer">
                <IconTrash class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div class="flex space-x-2 mb-3">
            <span class="badge badge-outline text-xs capitalize">{{ vehicle.type }}</span>
            <span class="badge text-xs" :class="vehicle.status === 'available' ? 'badge-success' : 'badge-warning'">
              {{ vehicle.status === 'available' ? 'Disponible' : vehicle.status === 'in_transit' ? 'En transit' :
                'Maintenance' }}
            </span>
          </div>
          <NuxtLink :to="`/app/uc/vehicles/${vehicle.id}`"
            class="text-xs text-secondary-600 hover:text-secondary-700 font-medium block text-right">
            Voir détails &rarr;
          </NuxtLink>
        </div>
      </div>
    </UiAppSkeleton>
  </section>
</template>

<script setup lang="ts">
import { IconTruck, IconPlus, IconPencil, IconTrash } from '@tabler/icons-vue';
import type { Vehicle } from '~/types';

defineProps<{
  vehicles: Vehicle[];
  loading?: boolean;
}>();

defineEmits<{
  (e: 'add-vehicle'): void;
  (e: 'edit-vehicle', vehicle: Vehicle): void;
  (e: 'delete-vehicle', id: string): void;
}>();
</script>
