<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-8 space-y-6">
    <div class="flex gap-6">
      <UiAppSkeleton :loading="true" type="avatar" width="5rem" height="5rem" radius="1rem" />
      <div class="flex-1 space-y-3">
        <UiAppSkeleton :loading="true" type="heading" width="60%" height="2rem" />
        <UiAppSkeleton :loading="true" type="text" width="30%" height="1rem" />
      </div>
    </div>
    <div class="space-y-3 pt-6 border-t border-gray-100 dark:border-gray-700">
      <UiAppSkeleton :loading="true" type="text" :count="4" gap="3" />
    </div>
  </div>
</template>
