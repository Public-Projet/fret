<template>
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
      <a href="tel:+22901XXXXXXXX" class="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
        +229 01 XX XX XX XX
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
        Zone xxx,<br />Cotonou, Bénin
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconMail, IconPhone, IconMapPin } from '@tabler/icons-vue';
</script>
