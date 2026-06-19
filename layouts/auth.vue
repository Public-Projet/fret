<template>
  <div class="min-h-screen flex w-full bg-white dark:bg-gray-900">
    <!-- Dynamic Column (2/3) -->
    <div class="hidden lg:flex w-2/3 relative overflow-hidden bg-gray-900">
      <img :src="resolvedBgImage" class="absolute inset-0 w-full h-full object-cover opacity-60" alt="Auth Background" />
      <div class="absolute inset-0 bg-gradient-to-br from-primary-900/80 to-black/40 mix-blend-multiply"></div>

      <!-- Content -->
      <div class="relative z-10 w-full flex flex-col justify-between p-12 text-white">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <img src="/img/Logo.png" alt="BourseFret Logo" class="h-10 w-auto bg-white rounded-lg p-1" />
          <span class="text-3xl font-bold tracking-tight text-white">BourseFret</span>
        </NuxtLink>

        <div class="mb-12 max-w-2xl">
          <blockquote class="text-3xl font-medium leading-relaxed mb-6">
            "{{ resolvedQuote }}"
          </blockquote>
          <div class="flex items-center gap-4">
            <div class="h-1 w-12 bg-primary-500 rounded-full"></div>
            <p class="text-lg text-gray-300 font-medium">{{ resolvedAuthor }}</p>
          </div>
        </div>

        <!-- Footer/Links -->
        <div class="flex gap-6 text-sm text-gray-400">
          <span>&copy; {{ new Date().getFullYear() }} BourseFret. All rights reserved.</span>
        </div>
      </div>
    </div>

    <!-- Form Column (1/3) -->
    <div
      class="w-full lg:w-1/3 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-white dark:bg-gray-900 transition-colors duration-300">

      <div class="absolute top-4 right-4 flex items-center gap-3">
        <UiThemeToggle />

        <NuxtLink to="/"
          class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
          <IconHome class="w-4 h-4" />
          <span class="hidden sm:inline">Accueil</span>
        </NuxtLink>
      </div>

      <div class="lg:hidden w-full mb-8">
        <div class="mb-8 text-center sm:text-left">
          <NuxtLink to="/" class="inline-block relative z-10">
            <img src="/img/Logo.png" alt="BourseFret" class="h-12 w-auto" />
          </NuxtLink>
        </div>
      </div>

      <div class="w-full max-w-md space-y-8">
        <slot />
      </div>

      <!-- Footer Links Mobile -->
      <div class="mt-8 lg:hidden text-center text-sm text-gray-500">
        &copy; {{ new Date().getFullYear() }} BourseFret
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { IconHome } from '@tabler/icons-vue';

interface Props {
  bgImage?: string;
  quote?: string;
  author?: string;
}

const props = withDefaults(defineProps<Props>(), {
  bgImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // Warehouse/Trucking default
  quote: 'Connectez-vous pour accéder à la meilleure bourse de fret en temps réel.',
  author: 'L\'équipe BourseFret'
});

const route = useRoute();
const resolvedBgImage = computed(() => (route.meta.bgImage as string) || props.bgImage);
const resolvedQuote = computed(() => (route.meta.quote as string) || props.quote);
const resolvedAuthor = computed(() => (route.meta.author as string) || props.author);
</script>
