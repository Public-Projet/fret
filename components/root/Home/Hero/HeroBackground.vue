<template>
  <div>
    <!-- Background animé avec gradient moderne -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 dark:from-slate-900 dark:via-gray-900 dark:to-slate-950">
      <div class="absolute inset-0 opacity-20">
        <div
          class="absolute top-20 left-10 w-72 h-72 bg-white dark:bg-blue-500/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob">
        </div>
        <div
          class="absolute top-40 right-10 w-72 h-72 bg-green-400 dark:bg-emerald-500/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000">
        </div>
        <div
          class="absolute -bottom-8 left-20 w-72 h-72 bg-blue-400 dark:bg-purple-500/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000">
        </div>
      </div>
    </div>

    <!-- Image AP -->
    <div class="absolute inset-0">
      <img src="https://transportsgranger.com/wp-content/uploads/2025/06/Transport-de-fret-par-conteneur.jpg"
        alt="background transport" class="w-full h-full object-cover opacity-20 mix-blend-overlay" />
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

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
