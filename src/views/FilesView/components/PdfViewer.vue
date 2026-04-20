<template>
  <div class="pdf-viewer-container h-full flex flex-col bg-slate-100 dark:bg-[#0a0a0b]">


    <div class="flex-1 overflow-auto scrollbar-custom relative bg-slate-200 dark:bg-black">
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center z-10 bg-white/50 dark:bg-black/50">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="error" class="text-center py-16">
        <FileX class="w-16 h-16 text-red-400 mx-auto mb-4" />
        <p class="text-red-500">{{ error }}</p>
      </div>

      <div
          v-else
          ref="pdfContainer"
          class="w-full h-full transition-transform duration-200 origin-top"
          :style="{
            transform: `scale(${zoom})`,
            height: zoom > 1 ? `${100 * zoom}%` : '100%',
            width: zoom > 1 ? `${100 * zoom}%` : '100%'
          }"
      >
        <iframe
            v-if="props.pdfUrl"
            :src="props.pdfUrl"
            class="w-full h-full border-0"
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