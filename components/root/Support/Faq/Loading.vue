<template>
  <div class="space-y-6 mt-8">
    <div v-for="i in 3" :key="i" class="space-y-3">
      <UiAppSkeleton type="heading" width="55%" />
      <UiAppSkeleton type="text" :count="2" gap="2" />
    </div>
  </div>
</template>
