<script setup>
import DocsSidebar from './components/DocsSidebar.vue'
import DocsContent from './components/DocsContent.vue'
import DocsOnPage from './components/DocsOnPage.vue'
</script>

<template>
  <div class="h-screen flex flex-col bg-surface-container-low dark:bg-background transition-colors duration-300">
    <div class="flex-1 flex overflow-hidden">
      <DocsSidebar class="shrink-0 h-full border-r border-slate-200/60 dark:border-[#27272a]" />
      <!-- 新增 scrollbar-custom 类 -->
      <div class="scrollbar-custom flex-1 overflow-y-auto bg-white dark:bg-[#0a0a0b]">
        <DocsContent />
      </div>
      <DocsOnPage class="shrink-0 h-full border-l border-slate-200/60 dark:border-[#27272a]" />
    </div>
  </div>
</template>

<style scoped>
:deep(.scrollbar-custom::-webkit-scrollbar) {
  width: 0;
}
:deep(.scrollbar-custom) {
  scrollbar-width: none; /* 火狐 */
}
</style>