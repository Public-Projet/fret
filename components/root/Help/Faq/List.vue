<template>
  <div class="space-y-4">
    <div v-for="(faq, index) in faqs" :key="index"
      class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button @click="toggleFaq(index)"
        class="w-full flex items-center justify-between p-5 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
        <span class="font-semibold text-gray-900 dark:text-white pr-4">{{ faq.question }}</span>
        <IconChevronDown
          :class="['w-5 h-5 text-gray-500 transition-transform duration-300', openIndex === index ? 'rotate-180' : '']" />
      </button>
      <div class="grid transition-all duration-300 ease-in-out"
        :class="openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
        <div class="overflow-hidden">
          <div class="p-5 pt-0 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800">
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </div>

    <!-- No Results -->
    <div v-if="faqs.length === 0" class="text-center py-12">
      <IconHelpCircle class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-500 dark:text-gray-400">Aucune question trouvée dans cette catégorie.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { IconChevronDown, IconHelpCircle } from '@tabler/icons-vue';

const props = defineProps<{
  faqs: Array<{ question: string; answer: string }>;
}>();

const openIndex = ref<number | null>(null);

const toggleFaq = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

// Reset open index when FAQs change (e.g., category change)
watch(() => props.faqs, () => {
  openIndex.value = null;
});
</script>
