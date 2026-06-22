<template>
  <div>
    <UiAppSkeleton class="h-10 w-1/3 mb-4 rounded-xl" />
    <UiAppSkeleton class="h-6 w-2/3 mb-8 rounded-xl" />
    <div class="space-y-4">
      <UiAppSkeleton class="h-24 w-full rounded-2xl" v-for="i in 3" :key="i" />
    </div>
  </div>
</template>
