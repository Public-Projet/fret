<template>
  <div class="container-custom py-8">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Paramètres</h1>

    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="flex -mb-px">
          <button v-for="tab in tabs" :key="tab.id" @click="currentTab = tab.id" :class="[
            'px-6 py-4 text-sm font-medium border-b-2 transition-colors',
            currentTab === tab.id
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          ]">
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <div class="p-6">
        <!-- Profile Settings -->
        <div v-if="currentTab === 'profile'" class="space-y-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Informations personnelles</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="label">Prénom</label>
              <input type="text" :value="currentUser?.firstName" class="input" disabled />
            </div>
            <div>
              <label class="label">Nom</label>
              <input type="text" :value="currentUser?.lastName" class="input" disabled />
            </div>
            <div>
              <label class="label">Email</label>
              <input type="email" :value="currentUser?.email" class="input" disabled />
            </div>
            <div>
              <label class="label">Téléphone</label>
              <input type="tel" :value="currentUser?.phone" class="input" disabled />
            </div>
          </div>
        </div>

        <!-- Notification Settings -->
        <div v-if="currentTab === 'notifications'" class="space-y-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Préférences de notification</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Notifications par email</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Recevoir des emails pour les nouvelles offres</p>
              </div>
              <input type="checkbox" checked
                class="h-6 w-11 rounded-full border-gray-300 text-primary-600 focus:ring-primary-500" />
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Notifications push</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Recevoir des notifications sur le navigateur</p>
              </div>
              <input type="checkbox" checked
                class="h-6 w-11 rounded-full border-gray-300 text-primary-600 focus:ring-primary-500" />
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <div v-if="currentTab === 'security'" class="space-y-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Sécurité</h2>
          <div class="space-y-4">
            <button class="btn btn-outline">Changer le mot de passe</button>
            <button class="btn btn-outline text-red-600 hover:bg-red-50 border-red-200">Supprimer mon compte</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const currentUser = computed(() => authStore.currentUser);

const tabs = [
  { id: 'profile', name: 'Profil' },
  { id: 'notifications', name: 'Notifications' },
  { id: 'security', name: 'Sécurité' }
];

const currentTab = ref('profile');
</script>
