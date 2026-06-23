<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <div
      v-for="i in 8"
      :key="i"
      class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 text-center block"
    >
      <!-- Profile image skeleton -->
      <div class="w-20 h-20 mx-auto mb-4">
        <UiAppSkeleton :loading="true" type="avatar" width="80px" height="80px" />
      </div>

      <!-- Title / Name skeleton -->
      <div class="flex justify-center mb-2">
        <UiAppSkeleton :loading="true" type="heading" width="70%" height="20px" />
      </div>

      <!-- Subtitle skeleton -->
      <div class="flex justify-center mb-4">
        <UiAppSkeleton :loading="true" type="text" width="40%" height="12px" />
      </div>

      <!-- Rating/Stars skeleton -->
      <div class="flex justify-center items-center space-x-1 mb-5">
        <UiAppSkeleton :loading="true" type="text" width="50%" height="16px" />
      </div>

      <!-- Badges/Tags skeleton -->
      <div class="flex justify-center gap-2 mb-6">
        <UiAppSkeleton :loading="true" type="text" width="30%" height="22px" />
        <UiAppSkeleton :loading="true" type="text" width="30%" height="22px" />
      </div>

      <!-- Button skeleton -->
      <UiAppSkeleton :loading="true" type="rectangle" height="38px" class="rounded-xl" />
    </div>
  </div>
</template>
