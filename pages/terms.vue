<template>
  <div class="container-custom py-12 max-w-4xl">
    <div class="card p-8 md:p-12">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Conditions Générales d'Utilisation</h1>

      <div class="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Objet</h2>
          <p>
            Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités de mise à
            disposition des services du site Bourse de Fret Bénin et les conditions d'utilisation par l'Utilisateur.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. Accès au service</h2>
          <p>
            Le Service est accessible gratuitement à tout Utilisateur disposant d'un accès à internet. Tous les coûts
            afférents à l'accès au Service, que ce soient les frais matériels, logiciels ou d'accès à internet sont
            exclusivement à la charge de l'utilisateur. Il est seul responsable du bon fonctionnement de son équipement
            informatique ainsi que de son accès à internet.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Propriété intellectuelle</h2>
          <p>
            Les marques, logos, signes ainsi que tout le contenu du site (textes, images, son...) font l'objet d'une
            protection par le Code de la propriété intellectuelle et plus particulièrement par le droit d'auteur.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Données personnelles</h2>
          <p>
            Les informations demandées à l'inscription au site sont nécessaires et obligatoires pour la création du
            compte de l'Utilisateur. En particulier, l'adresse électronique pourra être utilisée par le site pour
            l'administration, la gestion et l'animation du service.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">5. Responsabilité</h2>
          <p>
            Les sources des informations diffusées sur le site sont réputées fiables mais le site ne garantit pas qu'il
            soit exempt de défauts, d'erreurs ou d'omissions.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Conditions d\'Utilisation | Bourse de Fret Bénin'
});

definePageMeta({
  layout: 'guest'
});
</script>
