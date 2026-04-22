<script setup>
import { ref, reactive } from 'vue'
import { IdGenerator } from './js/idGenerator.js'

const generator = new IdGenerator()
const settings = reactive({
  type: 'snowflake',
  count: 20
})

const results = ref([])

const handleGenerate = () => {
  const newIds = generator.generateBatch(settings.type, settings.count)
  // 生成带状态的对象列表
  results.value = newIds.map(id => ({
    val: id,
    copied: false,
    time: new Date().toLocaleTimeString()
  }))
}

const copyId = async (item) => {
  try {
    await navigator.clipboard.writeText(item.val)
    item.copied = true
  } catch (err) {
    console.error('复制失败')
  }
}

const clearAll = () => {
  results.value = []
}
</script>

<template>
  <div class="flex flex-col h-full w-full bg-white dark:bg-slate-950 transition-colors text-slate-900 dark:text-slate-100 flex">

    <header class="flex-none h-16 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md">
      <div class="flex items-center gap-4">
        <span class="font-bold text-lg tracking-tight text-indigo-600 dark:text-indigo-400">ID Generator</span>

        <div class="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>

        <div class="flex items-center gap-3">
          <select v-model="settings.type"
                  class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="uuid">UUID v4</option>
            <option value="snowflake">Snowflake ID</option>
            <option value="snowflake-uuid">Snowflake UUID</option>
          </select>

          <input v-model.number="settings.count" type="number"
                 class="w-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button @click="clearAll" class="text-sm text-slate-500 hover:text-red-500 transition-colors px-3">清空列表</button>
        <button @click="handleGenerate"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-1.5 rounded text-sm font-semibold shadow-sm transition-all active:scale-95">
          立即生成
        </button>
      </div>
    </header>

    <div class="flex-none grid grid-cols-[80px_1fr_120px_100px] gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
      <div># Index</div>
      <div>ID Value</div>
      <div class="text-center">Status</div>
      <div class="text-right">Action</div>
    </div>

    <main class="flex-1 overflow-y-auto custom-scrollbar">
      <div v-if="results.length > 0">
        <div v-for="(item, index) in results" :key="index"
             class="grid grid-cols-[80px_1fr_120px_100px] gap-4 px-6 py-4 items-center border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">

          <div class="text-sm font-mono text-slate-400">{{ String(index + 1).padStart(3, '0') }}</div>

          <div class="text-sm font-mono font-medium text-slate-700 dark:text-slate-300 break-all">
            {{ item.val }}
          </div>

          <div class="flex justify-center">
            <transition name="fade">
              <span v-if="item.copied" class="flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                COPIED
              </span>
            </transition>
          </div>

          <div class="flex justify-end">
            <button @click="copyId(item)"
                    class="opacity-0 group-hover:opacity-100 p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded transition-all"
                    title="复制 ID">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div v-else class="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
        <svg class="w-20 h-20 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-sm">当前没有生成的 ID 记录</p>
      </div>
    </main>

    <footer class="flex-none h-10 border-t border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between bg-slate-50 dark:bg-slate-950 text-[10px] uppercase font-bold text-slate-400">
      <div>Total: {{ results.length }} items</div>
      <div>Copied: {{ results.filter(i => i.copied).length }}</div>
    </footer>
  </div>
</template>

<style scoped>
@reference "@/style.css";

/* 列表进入动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 滚动条美化 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-slate-200 dark:bg-slate-800 rounded-full;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  @apply bg-slate-300 dark:bg-slate-700;
}
</style>
