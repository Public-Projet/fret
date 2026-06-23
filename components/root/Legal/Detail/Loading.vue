<template>
  <div class="space-y-8">
    <div v-for="i in 5" :key="i" class="space-y-3">
      <UiAppSkeleton :loading="true" type="heading" width="45%" height="22px" />
      <UiAppSkeleton :loading="true" type="text" :count="3" gap="2" />
    </div>
  </div>
</template>
