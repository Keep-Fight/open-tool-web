<template>
  <div class="h-screen flex flex-col bg-surface-container-low dark:bg-background transition-colors duration-300">
    <div class="flex-1 flex overflow-hidden">
      <NotesSidebar class="shrink-0 h-full border-r border-slate-200/60 dark:border-[#27272a]" />
      <div class="scrollbar-custom flex-1 overflow-y-auto bg-white dark:bg-[#0a0a0b]">
        <NotesContent />
      </div>
      <TocSidebar class="shrink-0 h-full border-l border-slate-200/60 dark:border-[#27272a]" />
    </div>
  </div>
</template>

<script setup>
import NotesSidebar from './components/NotesSidebar.vue'
import NotesContent from './components/NotesContent.vue'
import TocSidebar from './components/TocSidebar.vue'
</script>

<style scoped>
:deep(.scrollbar-custom::-webkit-scrollbar) {
  width: 0;
}
:deep(.scrollbar-custom) {
  /* 火狐 */
  scrollbar-width: none;
}
</style>