<template>
  <div class="container-custom py-12 max-w-4xl">
    <div class="card p-8 md:p-12">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Politique de Cookies</h1>

      <div class="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Qu'est-ce qu'un cookie ?</h2>
          <p>
            Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de
            votre visite sur notre site. Il permet de stocker des informations relatives à votre navigation et de vous
            reconnaître lors de vos visites ultérieures.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. Types de cookies utilisés</h2>
          <p>Nous utilisons différents types de cookies sur notre plateforme :</p>
          <ul class="list-disc pl-5 space-y-2 mt-3">
            <li>
              <strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site. Ils vous permettent de
              naviguer et d'utiliser les fonctionnalités de base (authentification, sécurité).
            </li>
            <li>
              <strong>Cookies de performance :</strong> Nous aident à comprendre comment les visiteurs interagissent
              avec notre site en collectant des informations anonymes.
            </li>
            <li>
              <strong>Cookies de fonctionnalité :</strong> Permettent de mémoriser vos préférences (langue, thème
              sombre/clair, région).
            </li>
            <li>
              <strong>Cookies analytiques :</strong> Utilisés pour analyser l'utilisation du site et améliorer nos
              services (Google Analytics, par exemple).
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Durée de conservation</h2>
          <p>Les cookies que nous utilisons ont différentes durées de vie :</p>
          <ul class="list-disc pl-5 space-y-1 mt-3">
            <li><strong>Cookies de session :</strong> Supprimés à la fermeture de votre navigateur</li>
            <li><strong>Cookies persistants :</strong> Conservés jusqu'à 13 mois maximum</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Gestion des cookies</h2>
          <p>
            Vous pouvez à tout moment choisir de désactiver ces cookies. Votre navigateur peut également être
            paramétré pour vous signaler les cookies qui sont déposés dans votre terminal et vous demander de les
            accepter ou non.
          </p>
          <p class="mt-3">
            Pour gérer vos préférences de cookies, vous pouvez :
          </p>
          <ul class="list-disc pl-5 space-y-1 mt-3">
            <li>Configurer les paramètres de votre navigateur</li>
            <li>Utiliser notre bandeau de gestion des cookies (si disponible)</li>
            <li>Supprimer les cookies existants via les paramètres de votre navigateur</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">5. Cookies tiers</h2>
          <p>
            Certains cookies peuvent être déposés par des services tiers pour permettre le fonctionnement de certaines
            fonctionnalités (boutons de partage sur les réseaux sociaux, lecteurs vidéo, etc.). Ces cookies sont
            soumis aux politiques de confidentialité de ces tiers.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">6. Consentement</h2>
          <p>
            En poursuivant votre navigation sur notre site, vous acceptez l'utilisation des cookies conformément à la
            présente politique. Vous pouvez retirer votre consentement à tout moment en supprimant les cookies de
            votre navigateur.
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
  title: 'Politique de cookies'
});

definePageMeta({
  layout: 'guest'
});
</script>
