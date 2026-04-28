<template>
    <main class="bg-surface-container-lowest border border-slate-100 shadow-sm p-8 relative">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">

        <div class="space-y-8">
          <h2 class="text-sm font-bold text-slate-800">输入配置</h2>

          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-500">输入类型</label>
            <select
                v-model="inputMode"
                class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
            >
              <option value="current">当前时间 (实时)</option>
              <option value="ms">时间戳 (毫秒 ms)</option>
              <option value="s">时间戳 (秒 s)</option>
              <option value="datetime">日期字符串 (yyyy-MM-dd HH:mm:ss)</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-500">输入值</label>
            <div v-if="inputMode === 'current'" class="bg-indigo-50/50 rounded-2xl p-6 flex justify-between items-center border border-indigo-50/50">
              <div>
                <div class="text-2xl font-bold text-slate-800 tracking-tight">{{ liveTimeFormatted }}</div>
                <div class="text-xs text-indigo-400 mt-1 uppercase tracking-wider">北京时间 (UTC+8)</div>
              </div>
              <div class="flex items-center gap-2">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span class="text-[10px] font-bold text-green-600">LIVE</span>
              </div>
            </div>

            <input
                v-else
                v-model="manualInput"
                type="text"
                :placeholder="placeholderText"
                class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div class="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div class="bg-white border border-blue-100 shadow-sm rounded-full p-2.5 text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-sm font-bold text-slate-800">转换结果</h2>
            <button @click="copyAll" class="text-xs text-indigo-500 hover:underline font-medium">复制全部</button>
          </div>

          <div class="space-y-4">
            <div v-for="(val, label) in results" :key="label" class="grid grid-cols-3 items-center">
              <span class="text-xs text-slate-400">{{ label }}</span>
              <div class="col-span-2 relative group">
                <input
                    type="text"
                    :value="val"
                    readonly
                    class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none font-mono"
                >
                <button
                    @click="copyToClipboard(val)"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

// --- 状态定义 ---
const inputMode = ref('current'); // current, ms, s, datetime
const manualInput = ref('');
const now = ref(new Date());
let timer = null;

// --- 实时时间处理 ---
onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const liveTimeFormatted = computed(() => formatDate(now.value));

// --- 核心逻辑：解析输入 ---
const targetDate = computed(() => {
  if (inputMode.value === 'current') return now.value;

  if (!manualInput.value) return null;

  try {
    if (inputMode.value === 'ms') {
      return new Date(parseInt(manualInput.value));
    } else if (inputMode.value === 's') {
      return new Date(parseInt(manualInput.value) * 1000);
    } else if (inputMode.value === 'datetime') {
      const d = new Date(manualInput.value.replace(/-/g, '/'));
      return isNaN(d.getTime()) ? null : d;
    }
  } catch (e) {
    return null;
  }
  return null;
});

// --- 格式化结果列表 ---
const results = computed(() => {
  const d = targetDate.value;
  if (!d || isNaN(d.getTime())) return {
    '毫秒时间戳 (ms)': "",
    '秒级时间戳 (s)': "",
    '日期时间 (标准)': "",
    '日期时间 (毫秒)': "",
    'ISO 8601': "",
    '本地日期': "",
    '本地时间': ""
  };

  return {
    '毫秒时间戳 (ms)': d.getTime().toString(),
    '秒级时间戳 (s)': Math.floor(d.getTime() / 1000).toString(),
    '日期时间 (标准)': formatDate(d),
    '日期时间 (毫秒)': formatDate(d, true),
    'ISO 8601': d.toISOString(),
    '本地日期': d.toLocaleDateString(),
    '本地时间': d.toLocaleTimeString()
  };
});

const placeholderText = computed(() => {
  if (inputMode.value === 'ms') return '例如: 1716197445000';
  if (inputMode.value === 's') return '例如: 1716197445';
  if (inputMode.value === 'datetime') return '例如: 2024-05-20 15:30:45';
  return '';
});

// --- 工具函数 ---
function formatDate(date, includeMs = false) {
  const Y = date.getFullYear();
  const M = String(date.getMonth() + 1).padStart(2, '0');
  const D = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  let base = `${Y}-${M}-${D} ${h}:${m}:${s}`;
  if (includeMs) {
    const ms = String(date.getMilliseconds()).padStart(3, '0');
    base += `.${ms}`;
  }
  return base;
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    // 这里可以集成你项目中的 Toast 组件
    console.log('已复制:', text);
  } catch (err) {
    console.error('复制失败', err);
  }
}

function copyAll() {
  const allText = Object.entries(results.value)
      .map(([label, val]) => `${label}: ${val}`)
      .join('\n');
  copyToClipboard(allText);
}
</script>

<style scoped>
/* 针对 Tailwind 4 的深度阴影优化 */
main {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.02), 0 4px 6px -2px rgba(0, 0, 0, 0.01);
}
</style>
