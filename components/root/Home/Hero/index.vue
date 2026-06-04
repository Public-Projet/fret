<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Background -->
    <RootHomeHeroBackground />

    <!-- Contenu Hero -->
    <div class="container-custom relative z-10 py-12 lg:py-20">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
        <RootHomeHeroContent />
        <RootHomeHeroImage />
      </div>
    </div>

    <!-- Wave & Scroll indicator -->
    <RootHomeHeroWave />
  </section>
</template>
