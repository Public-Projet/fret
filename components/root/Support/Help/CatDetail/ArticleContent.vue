<template>
  <div class="prose dark:prose-invert max-w-none" v-html="renderedContent"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  content: string;
}>();

const renderedContent = computed(() => {
  if (!props.content) return '';

  let html = props.content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">$1</h2>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
    // Lists
    .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4 list-decimal">$2</li>')
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary-500 pl-4 py-2 my-4 bg-primary-50 dark:bg-primary-900/20 rounded-r-lg text-gray-700 dark:text-gray-300">$1</blockquote>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="text-gray-600 dark:text-gray-300 mb-4">')
    // Line breaks
    .replace(/\n/g, '<br>');

  return `<p class="text-gray-600 dark:text-gray-300 mb-4">${html}</p>`;
});
</script>
