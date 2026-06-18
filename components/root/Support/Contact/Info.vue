<template>
  <div class="space-y-6 lg:col-span-1">
    <div v-for="item in CONTACT_ITEMS" :key="item.label"
      class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
      <div :class="['w-12 h-12 rounded-xl flex items-center justify-center mb-6', item.iconBg, item.iconColor]">
        <component :is="item.icon" class="w-6 h-6" />
      </div>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ item.label }}</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">{{ item.description }}</p>
      <a v-if="item.href" :href="item.href" :class="['font-semibold hover:underline', item.linkColor]">
        {{ item.value }}
      </a>
      <p v-else class="text-gray-900 dark:text-white font-medium" v-html="item.value"></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconMail, IconPhone, IconMapPin } from '@tabler/icons-vue';

const CONTACT_ITEMS = [
  {
    label: 'Email',
    description: 'Notre équipe vous répond sous 24h.',
    icon: IconMail,
    iconBg: 'bg-primary-100 dark:bg-primary-900/30',
    iconColor: 'text-primary-600 dark:text-primary-400',
    linkColor: 'text-primary-600 dark:text-primary-400',
    href: 'mailto:contact@boursefret.bj',
    value: 'contact@boursefret.bj'
  },
  {
    label: 'Téléphone',
    description: 'Du Lundi au Vendredi, 8h-18h.',
    icon: IconPhone,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    linkColor: 'text-blue-600 dark:text-blue-400',
    href: 'tel:+22901XXXXXXXX',
    value: '+229 01 XX XX XX XX'
  },
  {
    label: 'Bureau',
    description: 'Venez nous rencontrer.',
    icon: IconMapPin,
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
    linkColor: '',
    href: null,
    value: 'Zone xxx,<br />Cotonou, Bénin'
  }
];
</script>
