<template>
  <div class="space-y-8 animate-pulse">
    <!-- Profile Banner & Main Info skeleton -->
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
      <!-- Banner skeleton -->
      <div class="h-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 relative"></div>

      <!-- Main Info skeleton -->
      <div class="px-8 pb-8 -mt-16 bg-white dark:bg-transparent relative">
        <div class="flex flex-col md:flex-row items-end gap-6 mb-6">
          <!-- Avatar skeleton -->
          <div class="w-32 h-32 rounded-3xl bg-white dark:bg-gray-800 p-1 shadow-lg shrink-0">
            <UiAppSkeleton :loading="true" type="avatar" width="100%" height="100%" radius="1.5rem" />
          </div>

          <!-- Titles skeleton -->
          <div class="flex-1 pb-2 space-y-2 w-full">
            <UiAppSkeleton :loading="true" type="heading" width="50%" height="28px" />
            <UiAppSkeleton :loading="true" type="text" width="30%" height="16px" />
            <div class="flex gap-4 mt-2">
              <UiAppSkeleton :loading="true" type="text" width="20%" height="14px" />
              <UiAppSkeleton :loading="true" type="text" width="15%" height="14px" />
              <UiAppSkeleton :loading="true" type="text" width="25%" height="14px" />
            </div>
          </div>

          <!-- Buttons skeleton -->
          <div class="flex flex-col gap-3 w-full md:w-auto shrink-0 pb-2">
            <UiAppSkeleton :loading="true" type="rectangle" width="140px" height="42px" class="rounded-xl" />
          </div>
        </div>

        <!-- Bio skeleton -->
        <div class="max-w-3xl space-y-2 mt-6">
          <UiAppSkeleton :loading="true" type="text" width="20%" height="16px" />
          <UiAppSkeleton :loading="true" type="text" :count="2" gap="2" />
        </div>
      </div>
    </div>

    <!-- Role Specific lists skeletons -->
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <UiAppSkeleton :loading="true" type="heading" width="30%" height="24px" />
        <UiAppSkeleton :loading="true" type="text" width="10%" height="16px" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="i in 2"
          :key="i"
          class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4"
        >
          <div class="flex justify-between items-start">
            <div class="space-y-3 w-2/3">
              <UiAppSkeleton :loading="true" type="heading" width="90%" height="18px" />
              <UiAppSkeleton :loading="true" type="text" width="60%" height="14px" />
            </div>
            <UiAppSkeleton :loading="true" type="text" width="60px" height="20px" />
          </div>
          <div class="flex justify-end pt-2">
            <UiAppSkeleton :loading="true" type="text" width="80px" height="16px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
