<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div v-for="i in 6" :key="i"
      class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
      <!-- Route: départ + destination -->
      <div class="flex items-start justify-between mb-6">
        <div class="space-y-4 flex-1">
          <div class="flex items-center space-x-3">
            <UiAppSkeleton :loading="true" type="circle" width="32px" height="32px" />
            <div class="flex-1">
              <UiAppSkeleton :loading="true" type="text" width="40px" height="10px" class="mb-1" />
              <UiAppSkeleton :loading="true" type="text" width="100px" height="16px" />
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <UiAppSkeleton :loading="true" type="circle" width="32px" height="32px" />
            <div class="flex-1">
              <UiAppSkeleton :loading="true" type="text" width="60px" height="10px" class="mb-1" />
              <UiAppSkeleton :loading="true" type="text" width="130px" height="16px" />
            </div>
          </div>
        </div>
        <!-- Prix + statut -->
        <div class="text-right space-y-2 ml-4">
          <UiAppSkeleton :loading="true" type="text" width="90px" height="24px" />
          <UiAppSkeleton :loading="true" type="text" width="55px" height="18px" radius="999px" />
        </div>
      </div>

      <!-- Details: date + véhicule -->
      <div class="grid grid-cols-2 gap-4 py-4 border-t border-gray-50 dark:border-gray-700">
        <div class="flex items-center space-x-2">
          <UiAppSkeleton :loading="true" type="circle" width="16px" height="16px" />
          <UiAppSkeleton :loading="true" type="text" width="80px" height="12px" />
        </div>
        <div class="flex items-center space-x-2">
          <UiAppSkeleton :loading="true" type="circle" width="16px" height="16px" />
          <UiAppSkeleton :loading="true" type="text" width="90px" height="12px" />
        </div>
      </div>

      <!-- Footer: carrier + bouton -->
      <div class="mt-6 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <UiAppSkeleton :loading="true" type="avatar" width="32px" height="32px" />
          <div>
            <UiAppSkeleton :loading="true" type="text" width="80px" height="12px" class="mb-1" />
            <UiAppSkeleton :loading="true" type="text" width="55px" height="10px" />
          </div>
        </div>
        <UiAppSkeleton :loading="true" type="rectangle" width="70px" height="32px" radius="12px" />
      </div>
    </div>
  </div>
</template>
