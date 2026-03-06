<template>
  <div class="min-h-screen flex flex-col transition-colors duration-200 dark:bg-slate-900 dark:text-gray-100 bg-gray-50 text-gray-800">
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component"/>
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
</script>

<style>
/* 重置过渡动画，避免样式卡顿 */
.page-enter-active, .page-leave-active {
  transition: opacity 0.2s ease;
}

.page-enter-from, .page-leave-to {
  opacity: 0;
}
</style>
