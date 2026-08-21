<template>
  <div class="space-y-8 max-w-7xl mx-auto">
    <!-- Back Link Skeleton -->
    <div class="flex items-center gap-3">
      <UiAppSkeleton :loading="true" type="circle" width="36px" height="36px" radius="12px" />
      <UiAppSkeleton :loading="true" type="text" width="150px" height="18px" radius="6px" />
    </div>

    <!-- Main Content Layout Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left / Main Column (2 cols) -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Main Hero Card Skeleton -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-md shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700/60 space-y-6">
          <!-- Title + Status Badge -->
          <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div class="space-y-2 flex-1 w-full">
              <UiAppSkeleton :loading="true" type="heading" width="85%" height="32px" radius="12px" />
              <UiAppSkeleton :loading="true" type="text" width="35%" height="16px" radius="6px" />
            </div>
            <UiAppSkeleton :loading="true" type="text" width="95px" height="32px" radius="9999px" class="shrink-0" />
          </div>

          <!-- Meta Info Badges Row -->
          <div class="flex flex-wrap items-center gap-4 pt-2 pb-4 border-b border-gray-100 dark:border-gray-700/60">
            <UiAppSkeleton :loading="true" type="text" width="140px" height="16px" radius="6px" />
            <UiAppSkeleton :loading="true" type="text" width="90px" height="16px" radius="6px" />
            <UiAppSkeleton :loading="true" type="text" width="70px" height="16px" radius="6px" />
            <UiAppSkeleton :loading="true" type="text" width="70px" height="16px" radius="6px" />
          </div>

          <!-- Route Box Skeleton -->
          <div class="bg-gradient-to-br from-gray-50/90 to-gray-100/40 dark:from-gray-900/50 dark:to-gray-800/30 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50">
            <div class="relative pl-8 border-l-2 border-dashed border-gray-200 dark:border-gray-700 space-y-8">
              <div class="space-y-2">
                <UiAppSkeleton :loading="true" type="text" width="90px" height="12px" radius="4px" />
                <UiAppSkeleton :loading="true" type="text" width="220px" height="22px" radius="8px" />
                <UiAppSkeleton :loading="true" type="text" width="160px" height="14px" radius="6px" />
              </div>
              <div class="space-y-2">
                <UiAppSkeleton :loading="true" type="text" width="90px" height="12px" radius="4px" />
                <UiAppSkeleton :loading="true" type="text" width="240px" height="22px" radius="8px" />
                <UiAppSkeleton :loading="true" type="text" width="180px" height="14px" radius="6px" />
              </div>
            </div>
          </div>

          <!-- Characteristics Grid (4 Cards) -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div v-for="i in 4" :key="i" class="p-4 bg-gray-50/80 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-700/50 flex flex-col items-center gap-2">
              <UiAppSkeleton :loading="true" type="circle" width="36px" height="36px" />
              <UiAppSkeleton :loading="true" type="text" width="50px" height="10px" radius="4px" />
              <UiAppSkeleton :loading="true" type="text" width="75px" height="18px" radius="6px" />
            </div>
          </div>

          <!-- Description Section Skeleton -->
          <div class="space-y-3 pt-2">
            <UiAppSkeleton :loading="true" type="text" width="130px" height="20px" radius="6px" />
            <UiAppSkeleton :loading="true" type="text" width="100%" height="14px" radius="6px" />
            <UiAppSkeleton :loading="true" type="text" width="94%" height="14px" radius="6px" />
            <UiAppSkeleton :loading="true" type="text" width="70%" height="14px" radius="6px" />
          </div>
        </div>
      </div>

      <!-- Right Column Sidebar Skeleton -->
      <div class="space-y-6">
        <!-- Profile Info Card -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-gray-700/60 shadow-md shadow-gray-200/50 dark:shadow-none space-y-6">
          <UiAppSkeleton :loading="true" type="text" width="170px" height="20px" radius="6px" />
          <div class="flex items-center gap-4">
            <UiAppSkeleton :loading="true" type="avatar" width="56px" height="56px" radius="18px" />
            <div class="space-y-2 flex-1">
              <UiAppSkeleton :loading="true" type="text" width="140px" height="18px" radius="6px" />
              <UiAppSkeleton :loading="true" type="text" width="110px" height="14px" radius="6px" />
            </div>
          </div>
          <UiAppSkeleton :loading="true" type="rectangle" width="100%" height="42px" radius="14px" />
        </div>

        <!-- Action CTA Card -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-gray-700/60 shadow-md shadow-gray-200/50 dark:shadow-none space-y-4">
          <UiAppSkeleton :loading="true" type="text" width="140px" height="20px" radius="6px" />
          <UiAppSkeleton :loading="true" type="text" width="100%" height="14px" radius="6px" />
          <UiAppSkeleton :loading="true" type="rectangle" width="100%" height="52px" radius="16px" />
        </div>
      </div>
    </div>
  </div>
</template>

