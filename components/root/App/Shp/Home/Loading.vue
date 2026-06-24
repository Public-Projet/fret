<template>
  <div class="space-y-10">
    <!-- Hero Skeleton -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
      <div class="space-y-3 w-full lg:w-1/3">
        <UiAppSkeleton :loading="true" type="heading" width="80%" height="32px" />
        <UiAppSkeleton :loading="true" type="text" width="50%" height="16px" />
      </div>
      <div class="flex gap-3 w-full lg:w-auto">
        <UiAppSkeleton :loading="true" type="rectangle" width="120px" height="44px" radius="16px" />
        <UiAppSkeleton :loading="true" type="rectangle" width="120px" height="44px" radius="16px" />
        <UiAppSkeleton :loading="true" type="rectangle" width="150px" height="44px" radius="16px" />
      </div>
    </div>

    <!-- Stats Skeleton -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <UiAppSkeleton v-for="i in 4" :key="i" :loading="true" type="card" height="130px" class="rounded-[2rem]" />
    </div>

    <!-- Charts Skeleton -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <UiAppSkeleton :loading="true" type="card" height="320px" class="lg:col-span-2 rounded-[2rem]" />
      <UiAppSkeleton :loading="true" type="card" height="320px" class="rounded-[2rem]" />
    </div>

    <!-- Activity Skeleton -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-4">
        <UiAppSkeleton :loading="true" type="heading" width="30%" height="24px" />
        <UiAppSkeleton v-for="i in 3" :key="i" :loading="true" type="table-row" height="70px" class="rounded-2xl" />
      </div>
      <div class="space-y-4">
        <UiAppSkeleton :loading="true" type="heading" width="40%" height="24px" />
        <UiAppSkeleton :loading="true" type="card" height="180px" class="rounded-[2rem]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// loading component using AppSkeleton
</script>
