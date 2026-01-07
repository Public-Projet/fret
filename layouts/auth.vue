<template>
  <div class="min-h-screen flex w-full bg-white dark:bg-gray-900">
    <!-- Dynamic Column (2/3) - Hidden on mobile, visible on lg and up -->
    <div class="hidden lg:flex w-2/3 relative overflow-hidden bg-gray-900">
      <!-- Background Image -->
      <img :src="bgImage" class="absolute inset-0 w-full h-full object-cover opacity-60" alt="Auth Background" />

      <!-- Overlay Gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary-900/80 to-black/40 mix-blend-multiply"></div>

      <!-- Content -->
      <div class="relative z-10 w-full flex flex-col justify-between p-12 text-white">
        <!-- Logo or Brand -->
        <div class="flex items-center gap-3">
          <!-- Placeholder for logo if needed -->
          <h1 class="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <span class="p-2 bg-primary-600 rounded-lg">BF</span>
            BourseFret
          </h1>
        </div>

        <!-- Dynamic Text -->
        <div class="mb-12 max-w-2xl">
          <blockquote class="text-3xl font-medium leading-relaxed mb-6">
            "{{ quote }}"
          </blockquote>
          <div class="flex items-center gap-4">
            <div class="h-1 w-12 bg-primary-500 rounded-full"></div>
            <p class="text-lg text-gray-300 font-medium">{{ author }}</p>
          </div>
        </div>

        <!-- Footer/Links -->
        <div class="flex gap-6 text-sm text-gray-400">
          <span>&copy; {{ new Date().getFullYear() }} BourseFret. All rights reserved.</span>
        </div>
      </div>
    </div>

    <!-- Form Column (1/3) -->
    <div class="w-full lg:w-1/3 flex flex-col justify-center items-center p-6 sm:p-12 relative">
      <!-- Mobile Header (Logo) -->
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
</script>
