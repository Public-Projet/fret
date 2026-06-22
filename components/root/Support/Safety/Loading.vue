<template>
  <div class="space-y-6 mt-8">
    <div v-for="i in 4" :key="i" class="flex gap-4">
      <UiAppSkeleton type="square" width="48px" height="48px" />
      <div class="flex-1 space-y-2">
        <UiAppSkeleton type="heading" width="40%" />
        <UiAppSkeleton type="text" :count="2" gap="2" />
      </div>
    </div>
  </div>
</template>
