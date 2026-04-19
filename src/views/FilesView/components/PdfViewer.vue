<template>
  <div class="pdf-viewer-container h-full flex flex-col bg-slate-100 dark:bg-[#0a0a0b]">
    <!-- 顶部工具栏 -->
    <div class="px-4 py-2 border-b border-slate-200/60 dark:border-[#27272a] bg-white dark:bg-[#1a1a1b] flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button
            @click="goBack"
            class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#27272a] transition-colors"
            title="返回"
        >
          <ArrowLeft class="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <span class="text-sm font-medium text-slate-700 dark:text-slate-200 truncate max-w-md">
          {{ currentFile?.displayName || currentFile?.name || 'PDF 查看器' }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button
            @click="zoomOut"
            class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#27272a] transition-colors"
            title="缩小"
            :disabled="zoom <= 0.5"
        >
          <Minus class="w-4 h-4 text-slate-600 dark:text-slate-300" />
        </button>
        <span class="text-xs text-slate-500 dark:text-slate-400 w-12 text-center">
          {{ Math.round(zoom * 100) }}%
        </span>
        <button
            @click="zoomIn"
            class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#27272a] transition-colors"
            title="放大"
            :disabled="zoom >= 2"
        >
          <Plus class="w-4 h-4 text-slate-600 dark:text-slate-300" />
        </button>
        <button
            @click="resetZoom"
            class="px-2 py-1 text-xs rounded hover:bg-slate-100 dark:hover:bg-[#27272a] transition-colors text-slate-600 dark:text-slate-300"
        >
          重置
        </button>
      </div>
    </div>

    <!-- PDF 内容区域 -->
    <div class="flex-1 overflow-auto scrollbar-custom flex items-start justify-center p-4">
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="error" class="text-center py-16">
        <FileX class="w-16 h-16 text-red-400 mx-auto mb-4" />
        <p class="text-red-500">{{ error }}</p>
      </div>

      <div
          v-else
          ref="pdfContainer"
          class="bg-white shadow-lg transition-transform duration-200"
          :style="{ transform: `scale(${zoom})`, transformOrigin: 'top center' }"
      >
        <iframe
            v-if="props.pdfUrl"
            :src="props.pdfUrl"
            class="w-[800px] h-[1000px] border-0"
            @load="handleLoad"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowLeft, Minus, Plus, FileX } from 'lucide-vue-next'

const props = defineProps({
  pdfUrl: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['back'])

const loading = ref(true)
const error = ref('')
const zoom = ref(1)
const pdfContainer = ref(null)

const handleLoad = () => {
  loading.value = false
}

const loadPdf = () => {
  loading.value = true
  error.value = ''
  // iframe 加载时由 handleLoad 处理
  // 设置超时，防止 onload 不触发
  setTimeout(() => {
    if (loading.value) {
      loading.value = false
    }
  }, 3000)
}

const goBack = () => {
  emit('back')
}

const zoomIn = () => {
  zoom.value = Math.min(zoom.value + 0.25, 2)
}

const zoomOut = () => {
  zoom.value = Math.max(zoom.value - 0.25, 0.5)
}

const resetZoom = () => {
  zoom.value = 1
}

// 键盘快捷键
const handleKeydown = (e) => {
  if (e.key === '+' || e.key === '=') {
    zoomIn()
  } else if (e.key === '-') {
    zoomOut()
  } else if (e.key === '0') {
    resetZoom()
  } else if (e.key === 'Escape') {
    goBack()
  }
}

onMounted(() => {
  loadPdf()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.scrollbar-custom {
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.5) transparent;
}

.scrollbar-custom::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  background-color: rgba(148, 163, 184, 0.5);
  border-radius: 3px;
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background-color: rgba(148, 163, 184, 0.7);
}
</style>