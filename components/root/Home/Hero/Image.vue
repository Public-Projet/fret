<template>
  <div class="hidden lg:flex lg:col-span-1 justify-center">
    <div class="relative max-w-md w-full animate-slide-right">
      <img src="https://developers.google.com/static/maps/solutions/images/store_locator.png"
        alt="Transport Logistics" class="w-full h-auto" />

      <!-- Décorations -->
      <div
        class="absolute -top-6 -right-6 w-32 h-32 bg-white/10 dark:bg-blue-400/10 rounded-full blur-3xl animate-pulse">
      </div>
      <div
        class="absolute -bottom-8 -left-8 w-40 h-40 bg-green-400/20 dark:bg-emerald-500/15 rounded-full blur-3xl animate-pulse animation-delay-2000">
      </div>
    </div>
  </div>
</template>

<style scoped>
.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
