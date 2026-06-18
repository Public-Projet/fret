<template>
  <div class="py-20">
    <div class="container-custom">
      <div
        class="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary-600 to-blue-600 dark:from-slate-800 dark:to-gray-900 shadow-2xl dark:shadow-black/30">
        <div class="absolute inset-0 bg-[url('/img/pattern.png')] opacity-10"></div>
        <!-- Dark mode decorative blobs -->
        <div class="absolute inset-0 opacity-0 dark:opacity-100 overflow-hidden">
          <div class="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 right-0 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl"></div>
        </div>
        <div class="relative px-8 py-16 md:py-20 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">Prêt à optimiser votre logistique ?</h2>
          <p class="text-blue-100 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-10">
            Rejoignez des milliers de transporteurs et d'expéditeurs qui font confiance à Bourse de Fret Bénin.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink to="/auth/register"
              class="btn bg-white dark:bg-emerald-500 text-primary-600 dark:text-white hover:bg-gray-50 dark:hover:bg-emerald-600 border-none font-bold py-3 px-8 rounded-xl shadow-lg dark:shadow-emerald-500/20">
              Commencer gratuitement
            </NuxtLink>
            <NuxtLink to="/support/contact"
              class="btn bg-transparent border-2 border-white dark:border-gray-500 text-white dark:text-gray-200 hover:bg-white/10 dark:hover:bg-white/5 font-bold py-3 px-8 rounded-xl">
              Parler à un expert
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
