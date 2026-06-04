<template>
  <!-- Background animé -->
  <div
    class="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 dark:from-slate-900 dark:via-gray-900 dark:to-slate-950">
    <div class="absolute inset-0 opacity-20">
      <div
        class="absolute top-0 left-0 w-96 h-96 bg-white dark:bg-blue-500/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob">
      </div>
      <div
        class="absolute bottom-0 right-0 w-96 h-96 bg-green-400 dark:bg-emerald-500/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000">
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  25% {
    transform: translate(20px, -50px) scale(1.1);
  }

  50% {
    transform: translate(-20px, 20px) scale(0.9);
  }

  75% {
    transform: translate(50px, 50px) scale(1.05);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
