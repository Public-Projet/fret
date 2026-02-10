<template>
  <div class="py-24 bg-white dark:bg-gray-800/50">
    <div class="container-custom max-w-4xl">
      <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Questions fréquentes</h2>

      <div class="space-y-6">
        <div v-for="(faq, index) in faqs" :key="index"
          class="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          @click="toggleFaq(index)">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white pr-4">{{ faq.question }}</h3>
            <div
              class="w-8 h-8 rounded-full bg-white dark:bg-gray-600 flex items-center justify-center transition-transform duration-300"
              :class="faq.isOpen ? 'rotate-180' : ''">
              <IconChevronDown class="w-5 h-5 text-gray-500 dark:text-gray-300" />
            </div>
          </div>
          <div class="grid transition-all duration-300 ease-in-out"
            :class="faq.isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'">
            <div class="overflow-hidden">
              <p class="text-gray-600 dark:text-gray-300">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IconChevronDown } from '@tabler/icons-vue';

const faqs = ref([
  {
    question: "Puis-je changer de forfait à tout moment ?",
    answer: "Oui, absolument. Vous pouvez passer d'un forfait mensuel à annuel, ou changer de niveau de service à tout moment depuis vos paramètres de compte. Les changements prennent effet immédiatement.",
    isOpen: true
  },
  {
    question: "Y a-t-il des frais cachés ?",
    answer: "Non, aucun frais caché. Les prix affichés sont transparents. Aucune commission n'est prise sur les transactions entre expéditeurs et transporteurs pour les abonnés Pro.",
    isOpen: false
  },
  {
    question: "Comment fonctionne la période d'essai ?",
    answer: "Le plan Découverte est gratuit à vie avec des fonctionnalités limitées.",
    isOpen: false
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer: "Nous utilisons l'agragteur de paiements béninois Fedapay. Les moyens de paiement sont ceux définis par celui-ci. Pour le plan Entreprise, nous acceptons les virements bancaires.",
    isOpen: false
  }
]);

const toggleFaq = (index: number) => {
  faqs.value[index].isOpen = !faqs.value[index].isOpen;
};
</script>
