<template>
  <div class="space-y-8">
    <!-- Back link skeleton -->
    <UiAppSkeleton :loading="true" type="text" width="130px" height="14px" />

    <div class="space-y-8">
      <!-- Main card skeleton -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <!-- Title + badge -->
        <div class="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
          <UiAppSkeleton :loading="true" type="text" width="320px" height="28px" />
          <UiAppSkeleton :loading="true" type="text" width="80px" height="22px" radius="999px" class="shrink-0" />
        </div>

        <!-- Meta row -->
        <div class="flex flex-wrap items-center gap-4 mb-6 pb-4 border-b border-gray-50 dark:border-gray-700">
          <UiAppSkeleton :loading="true" type="text" width="120px" height="14px" />
          <UiAppSkeleton :loading="true" type="text" width="80px" height="14px" />
          <UiAppSkeleton :loading="true" type="text" width="50px" height="14px" />
          <UiAppSkeleton :loading="true" type="text" width="50px" height="14px" />
        </div>

        <!-- Route skeleton -->
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mb-6">
          <div class="relative pl-8 border-l-2 border-dashed border-gray-200 dark:border-gray-600 space-y-8">
            <!-- Origin -->
            <div>
              <UiAppSkeleton :loading="true" type="text" width="80px" height="10px" class="mb-2" />
              <UiAppSkeleton :loading="true" type="text" width="180px" height="22px" class="mb-1" />
              <UiAppSkeleton :loading="true" type="text" width="240px" height="14px" />
            </div>
            <!-- Destination -->
            <div>
              <UiAppSkeleton :loading="true" type="text" width="80px" height="10px" class="mb-2" />
              <UiAppSkeleton :loading="true" type="text" width="200px" height="22px" class="mb-1" />
              <UiAppSkeleton :loading="true" type="text" width="260px" height="14px" />
            </div>
          </div>
        </div>

        <!-- Characteristics grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div v-for="i in 4" :key="i"
            class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl text-center border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-2">
            <UiAppSkeleton :loading="true" type="circle" width="24px" height="24px" />
            <UiAppSkeleton :loading="true" type="text" width="50px" height="10px" />
            <UiAppSkeleton :loading="true" type="text" width="80px" height="18px" />
          </div>
        </div>

        <!-- Description -->
        <div class="space-y-2 mb-8">
          <UiAppSkeleton :loading="true" type="text" width="100%" height="14px" />
          <UiAppSkeleton :loading="true" type="text" width="90%" height="14px" />
          <UiAppSkeleton :loading="true" type="text" width="75%" height="14px" />
        </div>

        <!-- CTA button -->
        <UiAppSkeleton :loading="true" type="rectangle" width="180px" height="40px" radius="12px" />
      </div>

      <!-- Sidebar-like card (owner info / additional info) -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <UiAppSkeleton :loading="true" type="text" width="140px" height="18px" class="mb-4" />
        <div class="flex items-center gap-3 mb-4">
          <UiAppSkeleton :loading="true" type="avatar" width="48px" height="48px" />
          <div class="space-y-2">
            <UiAppSkeleton :loading="true" type="text" width="130px" height="16px" />
            <UiAppSkeleton :loading="true" type="text" width="90px" height="12px" />
          </div>
        </div>
        <div class="space-y-2">
          <UiAppSkeleton :loading="true" type="text" width="160px" height="12px" />
          <UiAppSkeleton :loading="true" type="text" width="120px" height="12px" />
        </div>
      </div>
    </div>
  </div>
</template>
