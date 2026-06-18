<template>
  <div class="py-24 bg-white dark:bg-gray-800/50 transition-colors duration-300">
    <div class="container-custom max-w-4xl">
      <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Questions fréquentes</h2>

      <!-- Loading State -->
      <div v-if="store.loading.faqs" class="space-y-6">
        <div v-for="i in 4" :key="i" class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
          <UiAppSkeleton type="heading" class="w-3/4 mb-4" />
          <UiAppSkeleton type="text" class="w-full" />
        </div>
      </div>

      <!-- FAQ List -->
      <div v-else-if="filteredFaqs.length > 0" class="space-y-6">
        <div v-for="faq in filteredFaqs" :key="faq.id"
          class="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          @click="toggleFaq(faq.id)">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white pr-4">{{ faq.question }}</h3>
            <div
              class="w-8 h-8 rounded-full bg-white dark:bg-gray-600 flex items-center justify-center transition-transform duration-300"
              :class="openFaqId === faq.id ? 'rotate-180' : ''">
              <IconChevronDown class="w-5 h-5 text-gray-500 dark:text-gray-300" />
            </div>
          </div>
          <div class="grid transition-all duration-300 ease-in-out"
            :class="openFaqId === faq.id ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'">
            <div class="overflow-hidden">
              <p class="text-gray-600 dark:text-gray-300">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400">Aucune question fréquente disponible pour le moment.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { IconChevronDown } from '@tabler/icons-vue';
import { usePbcSiteContentStore } from '~/stores/pbcSiteContent';

const store = usePbcSiteContentStore();
const openFaqId = ref<string | null>(null);

onMounted(() => {
  store.fetchFaqs();
});

const filteredFaqs = computed(() => {
  return store.faqs.filter(faq => {
    let cat = '';
    if (typeof faq.category === 'string') {
      cat = faq.category.toLowerCase();
    } else if (faq.category && typeof faq.category === 'object') {
      cat = (faq.category.title || faq.category.slug || '').toLowerCase();
    }

    return cat.includes('paiement') ||
      cat.includes('prix') ||
      cat.includes('abonnement');
  });
});

const toggleFaq = (id: string) => {
  openFaqId.value = openFaqId.value === id ? null : id;
};
</script>
