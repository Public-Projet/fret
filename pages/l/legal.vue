<template>
  <div class="container-custom py-12 max-w-4xl">
    <div class="card p-8 md:p-12">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Mentions Légales</h1>

      <div class="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Éditeur du site</h2>
          <p>
            Le site <strong>Bourse de Fret Bénin</strong> est édité par :
          </p>
          <ul class="list-none pl-0 space-y-1 mt-2">
            <li><strong>Raison sociale :</strong> Bourse Fret SARL</li>
            <li><strong>Siège social :</strong> Cotonou, Bénin</li>
            <li><strong>Email :</strong> contact@boursefret.bj</li>
            <li><strong>Téléphone :</strong> +229 01 00 00 00</li>
            <li><strong>Numéro IFU :</strong> 0000000000000</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. Hébergement</h2>
          <p>
            Le site est hébergé par :
          </p>
          <ul class="list-none pl-0 space-y-1 mt-2">
            <li><strong>Hébergeur :</strong> Vercel Inc.</li>
            <li><strong>Adresse :</strong> 340 S Lemon Ave #4133 Walnut, CA 91789, USA</li>
            <li><strong>Site web :</strong> https://vercel.com</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Propriété intellectuelle</h2>
          <p>
            L'ensemble de ce site relève de la législation béninoise et internationale sur le droit d'auteur et la
            propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents
            téléchargeables et les représentations iconographiques et photographiques.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Responsabilité</h2>
          <p>
            Les informations communiquées sur le site sont fournies à titre indicatif, elles sont non contractuelles et
            ne sauraient engager la responsabilité de l'éditeur. L'éditeur se réserve le droit de modifier le contenu du
            site à tout moment et sans préavis.
          </p>
        </section>
      </div>

      <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-500 dark:text-gray-400">Dernière mise à jour : 12 janvier 2026</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Mentions légales'
});

definePageMeta({
  layout: 'guest'
});
</script>
