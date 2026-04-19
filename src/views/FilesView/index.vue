<template>
  <div class="h-screen flex flex-col bg-surface-container-low dark:bg-background transition-colors duration-300">
    <div class="flex-1 flex overflow-hidden">
      <div class="w-80 shrink-0 h-full border-r border-slate-200/60 dark:border-[#27272a]">
        <PdfTreeView @file-select="handleFileSelect" />
      </div>

      <div class="flex-1 h-full overflow-hidden relative">
        <PdfViewer
            v-if="currentViewingFile"
            :pdf-url="currentViewingFile"
            @back="handleBack"
        />

        <div
            v-else
            class="flex h-full items-center justify-center bg-slate-50 dark:bg-[#0a0a0b]"
        >
          <div class="text-center">
            <FolderOpen class="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p class="text-slate-400 dark:text-slate-500">
              请从左侧选择要查看的 PDF 文件
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { FolderOpen } from 'lucide-vue-next'
import PdfTreeView from './components/PdfTreeView.vue'
import PdfViewer from './components/PdfViewer.vue'

const currentViewingFile = ref(null)

// 处理文件选择
const handleFileSelect = (file) => {
  currentViewingFile.value = file.path
}

// 处理返回
const handleBack = () => {
  currentViewingFile.value = null
}
</script>

<style scoped>

</style>