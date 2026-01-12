<template>
  <div class="container-custom py-12 max-w-4xl">
    <div class="card p-8 md:p-12">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Politique de Confidentialité</h1>

      <div class="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Collecte des informations</h2>
          <p>
            Nous recueillons des informations lorsque vous vous inscrivez sur notre site, lorsque vous vous connectez à
            votre compte, faites une demande de transport, et / ou lorsque vous vous déconnectez. Les informations
            recueillies incluent votre nom, votre adresse e-mail, numéro de téléphone, et les informations relatives à
            votre entreprise (si applicable).
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. Utilisation des informations</h2>
          <p>
            Toute les informations que nous recueillons auprès de vous peuvent être utilisées pour :
          </p>
          <ul class="list-disc pl-5 space-y-1">
            <li>Personnaliser votre expérience et répondre à vos besoins individuels</li>
            <li>Fournir un contenu publicitaire personnalisé</li>
            <li>Améliorer notre site Web</li>
            <li>Améliorer le service client et vos besoins de prise en charge</li>
            <li>Vous contacter par e-mail</li>
            <li>Administrer un concours, une promotion, ou une enquête</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Confidentialité du commerce en ligne
          </h2>
          <p>
            Nous sommes les seuls propriétaires des informations recueillies sur ce site. Vos informations personnelles
            ne seront pas vendues, échangées, transférées, ou données à une autre société pour n'importe quelle raison,
            sans votre consentement, en dehors de ce qui est nécessaire pour répondre à une demande et / ou une
            transaction, comme par exemple pour expédier une commande.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Divulgation à des tiers</h2>
          <p>
            Nous ne vendons, n'échangeons et ne transférons pas vos informations personnelles identifiables à des tiers.
            Cela ne comprend pas les tierce parties de confiance qui nous aident à exploiter notre site Web ou à mener
            nos affaires, tant que ces parties conviennent de garder ces informations confidentielles.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">5. Protection des informations</h2>
          <p>
            Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations
            personnelles. Nous utilisons un cryptage à la pointe de la technologie pour protéger les informations
            sensibles transmises en ligne. Nous protégeons également vos informations hors ligne. Seuls les employés qui
            ont besoin d'effectuer un travail spécifique (par exemple, la facturation ou le service client) ont accès
            aux informations personnelles identifiables.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">6. Consentement</h2>
          <p>
            En utilisant notre site, vous consentez à notre politique de confidentialité.
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
  title: 'Politique de confidentialité'
});

definePageMeta({
  layout: 'guest'
});
</script>
