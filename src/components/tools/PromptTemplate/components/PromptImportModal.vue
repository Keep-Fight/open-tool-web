<template>
  <!-- 遮罩层，添加了细微的背景模糊效果 -->
  <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity"
      @click.self="handleClose"
  >
    <!-- 弹框主体 -->
    <div class="bg-white dark:bg-[#121214] rounded-xl border border-slate-200 dark:border-[#27272a] shadow-xl w-full max-w-md overflow-hidden">

      <!-- 头部 -->
      <div class="flex justify-between items-center px-5 py-4 border-b border-slate-100 dark:border-[#27272a]">
        <h3 class="font-semibold text-[15px] text-slate-800 dark:text-[#f1f1f1]">导入模板</h3>
        <button
            @click="handleClose"
            class="text-slate-400 hover:text-slate-600 dark:text-[#a1a1aa] dark:hover:text-white transition-colors cursor-pointer p-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 内容区：拖拽/点击上传 -->
      <div class="p-5">
        <label
            class="border-2 border-dashed border-slate-300 dark:border-[#3f3f46] rounded-lg p-8 flex flex-col items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-[#1c1c1f] transition-colors cursor-pointer group"
        >
          <input type="file" class="hidden" accept=".json" @change="handleFileChange">

          <!-- 上传图标 -->
          <div class="w-10 h-10 rounded-full bg-blue-50 dark:bg-[#0066ff]/10 text-blue-500 dark:text-[#0066ff] flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
          </div>

          <div class="text-[13px] text-slate-600 dark:text-[#a1a1aa] text-center mt-2">
            将文件拖拽至此处，或 <span class="text-blue-500 dark:text-[#0066ff] group-hover:underline">点击上传</span>
          </div>
          <div class="text-[11px] text-slate-400 dark:text-[#52525b]">
            仅支持 .json 格式的模板文件
          </div>
        </label>

        <!-- 选中文件后的提示（如果有文件） -->
        <div v-if="selectedFile" class="mt-4 p-3 bg-slate-50 dark:bg-[#1c1c1f] border border-slate-200 dark:border-[#27272a] rounded-md flex items-center justify-between">
          <div class="flex items-center gap-2 overflow-hidden">
            <svg class="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span class="text-[13px] text-slate-700 dark:text-[#f1f1f1] truncate">{{ selectedFile.name }}</span>
          </div>
          <button @click="removeFile" class="text-slate-400 hover:text-red-500 transition-colors p-1 cursor-pointer">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>

      <!-- 底部操作区 -->
      <div class="px-5 py-3.5 bg-slate-50 dark:bg-[#1c1c1f] border-t border-slate-100 dark:border-[#27272a] flex justify-end gap-3">
        <button
            @click="handleClose"
            class="px-4 py-2 rounded-md text-[13px] font-medium text-slate-600 dark:text-[#a1a1aa] border border-slate-200 dark:border-[#3f3f46] hover:bg-slate-100 dark:hover:bg-[#252529] transition-colors cursor-pointer"
        >
          取消
        </button>
        <button
            @click="submitImport"
            :disabled="!selectedFile"
            :class="[
            'px-4 py-2 rounded-md text-[13px] font-medium transition-colors flex items-center gap-1.5',
            selectedFile
              ? 'bg-blue-500 dark:bg-[#0066ff] text-white hover:bg-blue-600 dark:hover:brightness-110 cursor-pointer'
              : 'bg-slate-200 dark:bg-[#27272a] text-slate-400 dark:text-[#52525b] cursor-not-allowed'
          ]"
        >
          确认导入
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 控制弹窗显示隐藏的 Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

// 定义发出的事件
const emit = defineEmits(['close', 'import'])

const selectedFile = ref(null)

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
  }
}

const removeFile = () => {
  selectedFile.value = null
}

const handleClose = () => {
  selectedFile.value = null // 关闭时清空已选文件
  emit('close')
}

const submitImport = () => {
  if (selectedFile.value) {
    emit('import', selectedFile.value)
    handleClose()
  }
}
</script>