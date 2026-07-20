<template>
  <div class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 space-y-4">
    <UiAppSkeleton v-for="i in 4" :key="i" :loading="true" type="rectangle" height="7.5rem" radius="1.5rem" />
  </div>
</template>
