<template>
  <div class="animate-in fade-in duration-500">
    <!-- Skeleton Header -->
    <div
      class="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden mb-10 shadow-sm border border-gray-100 dark:border-gray-700/50">
      <div class="relative p-8 md:p-12">
        <div class="flex flex-wrap items-center gap-4 mb-6">
          <UiAppSkeleton class="h-8 w-24 rounded-full" />
          <UiAppSkeleton class="h-8 w-40 rounded-full" />
        </div>
        <UiAppSkeleton class="h-12 md:h-14 w-3/4 mb-6 rounded-xl" />
        <UiAppSkeleton class="h-6 w-full max-w-3xl mb-2 rounded-lg" />
        <UiAppSkeleton class="h-6 w-2/3 rounded-lg" />
      </div>
    </div>
    <!-- Skeleton Content -->
    <div
      class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-8 md:p-12 mb-10">
      <div class="space-y-4">
        <UiAppSkeleton class="h-4 w-full rounded-md" />
        <UiAppSkeleton class="h-4 w-full rounded-md" />
        <UiAppSkeleton class="h-4 w-5/6 rounded-md" />
        <br>
        <UiAppSkeleton class="h-4 w-full rounded-md" />
        <UiAppSkeleton class="h-4 w-4/5 rounded-md" />
      </div>
    </div>
  </div>
</template>
