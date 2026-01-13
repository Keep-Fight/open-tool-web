<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <h2 class="text-2xl font-black mb-2 md:mb-0">JSON 格式化 / 校验</h2>

      <div class="flex flex-wrap gap-2">
        <button @click="formatJson"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20">
          美化 JSON
        </button>
        <button @click="minifyJson"
                class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl text-sm font-bold transition-all">
          压缩
        </button>
        <button @click="copyToClipboard"
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all">
          {{ copied ? '已复制!' : '复制结果' }}
        </button>
        <button @click="clearAll"
                class="px-4 py-2 border border-gray-200 dark:border-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl text-sm font-bold transition-all">
          清空
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="text-xs font-bold text-gray-400 uppercase tracking-wider">输入原始 JSON</label>
        <textarea
            v-model="inputJson"
            @input="handleInput"
            placeholder="在此粘贴 JSON 字符串..."
            class="w-full h-[500px] p-4 font-mono text-sm dark:bg-gray-900 bg-gray-50  border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-colors"
        ></textarea>
      </div>

      <div class="space-y-2">
        <label class="text-xs font-bold text-gray-400 uppercase tracking-wider">格式化结果</label>
        <div class="relative group">
          <div v-if="error" class="absolute inset-x-0 top-0 p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-4">
            <p class="text-red-500 text-xs font-mono">{{ error }}</p>
          </div>

          <pre
              class="w-full h-[500px] p-4 font-mono text-sm overflow-auto rounded-2xl transition-colors whitespace-pre-wrap break-all dark:bg-gray-900 bg-gray-50"
              :class="{'text-red-400': error, 'text-blue-600 dark:text-blue-400': !error }"
          >{{ outputJson || '等待输入...' }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'

const inputJson = ref('')
const outputJson = ref('')
const error = ref('')
const copied = ref(false)

// 核心功能：格式化
const formatJson = () => {
  error.value = ''
  if (!inputJson.value.trim()) {
    outputJson.value = ''
    return
  }
  try {
    const parsed = JSON.parse(inputJson.value)
    outputJson.value = JSON.stringify(parsed, null, 4) // 4格缩进
  } catch (e) {
    error.value = '无效的 JSON 格式: ' + e.message
    outputJson.value = inputJson.value // 报错时保持原样
  }
}

// 核心功能：压缩
const minifyJson = () => {
  error.value = ''
  try {
    const parsed = JSON.parse(inputJson.value)
    outputJson.value = JSON.stringify(parsed)
  } catch (e) {
    error.value = '解析失败，无法压缩'
  }
}

// 实时校验
const handleInput = () => {
  if (error.value) formatJson() // 如果之前有错，输入时尝试重新校验
}

// 清空
const clearAll = () => {
  inputJson.value = ''
  outputJson.value = ''
  error.value = ''
}

// 复制到剪贴板
const copyToClipboard = async () => {
  if (!outputJson.value) return
  try {
    await navigator.clipboard.writeText(outputJson.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    alert('复制失败')
  }
}
</script>

<style scoped>
/* 隐藏滚动条样式（可选） */
pre::-webkit-scrollbar {
  width: 8px;
}

pre::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.dark pre::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}
</style>
