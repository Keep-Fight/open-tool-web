<script setup>
import { ref, reactive, computed, onMounted } from 'vue';

// --- 状态定义 ---
const config = reactive({
  count: 10,
  type: 'UUID (v4)',
  includeHyphen: true,
  uppercase: false,
  noDuplicate: true,
  prefix: '',
  suffix: ''
});

const results = ref([]);
const stats = reactive({
  time: 0,
  total: 0
});

// --- 核心逻辑 ---

// 生成 UUID v4
const generateUUID = () => {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });

  let finalId = uuid;
  if (!config.includeHyphen) finalId = finalId.replace(/-/g, '');
  if (config.uppercase) finalId = finalId.toUpperCase();

  return `${config.prefix}${finalId}${config.suffix}`;
};

// 执行生成动作
const handleGenerate = () => {
  const start = performance.now();
  const newResults = [];
  const count = Math.min(Math.max(config.count, 1), 100); // 限制在 1-100 之间

  for (let i = 0; i < count; i++) {
    newResults.push({
      id: generateUUID(),
      copied: false
    });
  }

  results.value = newResults;
  stats.total = newResults.length;
  stats.time = Math.round(performance.now() - start);
};

// 复制单个 ID
const copyToClipboard = async (item) => {
  try {
    await navigator.clipboard.writeText(item.id);
    item.copied = true;
    setTimeout(() => {
      item.copied = false;
    }, 2000);
  } catch (err) {
    console.error('复制失败', err);
  }
};

// 复制全部结果
const copyAll = async () => {
  const allIds = results.value.map(r => r.id).join('\n');
  try {
    await navigator.clipboard.writeText(allIds);
    alert('全部 ID 已复制到剪贴板');
  } catch (err) {
    console.error('复制失败', err);
  }
};

// 清空结果
const clearResults = () => {
  results.value = [];
  stats.total = 0;
  stats.time = 0;
};

// 初始生成
onMounted(() => {
  handleGenerate();
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-zinc-950 p-6 md:p-10 transition-colors duration-300">
    <div class="max-w-6xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden transition-all">

      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-slate-50 dark:border-zinc-800 gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl border border-indigo-100 dark:border-indigo-800">
            ID
          </div>
          <div>
            <h1 class="text-xl font-bold text-slate-800 dark:text-zinc-100">ID 生成器</h1>
            <p class="text-sm text-slate-400 dark:text-zinc-500">快速生成各种类型的唯一 ID，满足不同场景的需求。</p>
          </div>
        </div>
        <div class="flex gap-3 w-full sm:w-auto">
          <button
              @click="clearResults"
              class="flex-1 sm:flex-none px-4 py-2 text-sm text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            清空结果
          </button>
          <button
              @click="handleGenerate"
              class="flex-1 sm:flex-none px-6 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            生成 ID
          </button>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3">
        <aside class="p-8 border-r border-slate-50 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-900/50">
          <div class="space-y-6">
            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-700 dark:text-zinc-300">生成数量</label>
              <div class="flex border border-slate-200 dark:border-zinc-700 rounded-lg overflow-hidden bg-white dark:bg-zinc-800 shadow-sm">
                <input v-model.number="config.count" type="number" class="flex-1 px-4 py-2 text-sm outline-none dark:text-zinc-100 bg-transparent">
                <button @click="config.count--" class="px-3 border-l border-slate-200 dark:border-zinc-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-700">—</button>
                <button @click="config.count++" class="px-3 border-l border-slate-200 dark:border-zinc-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-700">+</button>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-700 dark:text-zinc-300">ID 类型</label>
              <div class="relative">
                <select v-model="config.type" class="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-zinc-700 rounded-lg appearance-none bg-white dark:bg-zinc-800 dark:text-zinc-100 outline-none shadow-sm">
                  <option>UUID (v4)</option>
                  <option>NanoID</option>
                  <option>Snowflake</option>
                </select>
                <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <label class="text-sm font-bold text-slate-700 dark:text-zinc-300">选项</label>
              <div class="space-y-2">
                <label v-for="(val, key) in { 'includeHyphen': '包含连字符', 'uppercase': '大写输出', 'noDuplicate': '无重复保证' }" :key="key" class="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" v-model="config[key]" class="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-zinc-600 focus:ring-blue-500 bg-white dark:bg-zinc-800">
                  <span class="text-sm text-slate-600 dark:text-zinc-400 group-hover:text-slate-800 dark:group-hover:text-zinc-200">{{ val }}</span>
                </label>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-bold text-slate-700 dark:text-zinc-300">前缀</label>
                <input v-model="config.prefix" type="text" placeholder="例如：user_" class="w-full px-4 py-2 text-sm border border-slate-200 dark:border-zinc-700 rounded-lg outline-none bg-white dark:bg-zinc-800 dark:text-zinc-100 shadow-sm">
              </div>
              <div class="space-y-2">
                <label class="text-sm font-bold text-slate-700 dark:text-zinc-300">后缀</label>
                <input v-model="config.suffix" type="text" placeholder="例如：_2024" class="w-full px-4 py-2 text-sm border border-slate-200 dark:border-zinc-700 rounded-lg outline-none bg-white dark:bg-zinc-800 dark:text-zinc-100 shadow-sm">
              </div>
            </div>

            <button class="w-full flex justify-between items-center px-4 py-3 border border-slate-100 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-800 text-sm text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors mt-4">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
                高级选项
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
        </aside>

        <main class="lg:col-span-2 p-8 bg-white dark:bg-zinc-900">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-slate-800 dark:text-zinc-100 font-bold">生成结果 <span class="text-slate-400 dark:text-zinc-500 font-normal ml-1">({{ stats.total }} 个)</span></h3>
            <button
                v-if="results.length > 0"
                @click="copyAll"
                class="text-blue-600 dark:text-blue-400 text-sm flex items-center gap-1 hover:underline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              复制全部
            </button>
          </div>

          <div class="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            <div v-if="results.length === 0" class="py-20 text-center text-slate-400 dark:text-zinc-600">
              暂无生成结果，点击“生成 ID”开始
            </div>

            <transition-group name="list">
              <div
                  v-for="(item, index) in results"
                  :key="item.id"
                  class="flex items-center justify-between p-3.5 border rounded-xl transition-all group"
                  :class="item.copied ? 'border-green-200 bg-green-50/30 dark:border-green-900/30 dark:bg-green-900/10' : 'border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50'"
              >
                <div class="flex items-center gap-4 truncate">
                  <span class="text-xs text-slate-300 dark:text-zinc-600 font-mono w-6">{{ index + 1 }}</span>
                  <span
                      class="text-sm font-mono truncate"
                      :class="item.copied ? 'text-green-600 dark:text-green-400' : 'text-slate-700 dark:text-zinc-300'"
                  >
                    {{ item.id }}
                  </span>
                </div>
                <button
                    @click="copyToClipboard(item)"
                    class="shrink-0 text-xs flex items-center gap-1 transition-colors"
                    :class="item.copied ? 'text-green-600 dark:text-green-400' : 'text-blue-500 dark:text-blue-400 md:opacity-0 md:group-hover:opacity-100'"
                >
                  <template v-if="item.copied">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    已复制
                  </template>
                  <template v-else>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    复制
                  </template>
                </button>
              </div>
            </transition-group>
          </div>
        </main>
      </div>

      <footer class="p-4 px-8 border-t border-slate-50 dark:border-zinc-800 bg-slate-50/10 dark:bg-zinc-900/10 flex justify-between items-center text-[11px] text-slate-400 dark:text-zinc-500">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          已生成 {{ stats.total }} 个唯一 ID
        </div>
        <div class="flex items-center gap-1 font-mono uppercase tracking-tighter">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          耗时 {{ stats.time }}ms
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* 列表动画 */
.list-enter-active, .list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

/* 自定义滚动条样式 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.05);
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.05);
}
</style>
