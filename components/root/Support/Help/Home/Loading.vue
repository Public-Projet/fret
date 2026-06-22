<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 mt-8">
    <div v-for="i in 4" :key="i"
      class="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
      <UiAppSkeleton type="square" width="48px" height="48px" />
      <UiAppSkeleton type="heading" width="60%" />
      <UiAppSkeleton type="text" :count="2" gap="2" />
    </div>
  </div>
</template>
