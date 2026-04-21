<script setup>
import { ref, computed } from 'vue';

const jsonInput = ref('');
const indentation = ref(2);
const sortKeys = ref(false);
const strictMode = ref(true);
const status = ref('准备就绪');

// 计算行数
const lineCount = computed(() => {
  return jsonInput.value ? jsonInput.value.split('\n').length : 1;
});

// 计算字符数
const charCount = computed(() => jsonInput.value.length);

// 核心逻辑：格式化
const formatJSON = () => {
  try {
    if (!jsonInput.value.trim()) return;
    let obj = JSON.parse(jsonInput.value);

    if (sortKeys.value) {
      obj = sortObject(obj);
    }

    jsonInput.value = JSON.stringify(obj, null, parseInt(indentation.value));
    status.value = '格式化成功';
  } catch (e) {
    status.value = `错误：${e.message}`;
  }
};

// 核心逻辑：压缩
const minifyJSON = () => {
  try {
    if (!jsonInput.value.trim()) return;
    const obj = JSON.parse(jsonInput.value);
    jsonInput.value = JSON.stringify(obj);
    status.value = '压缩成功';
  } catch (e) {
    status.value = `错误：${e.message}`;
  }
};

// 核心逻辑：校验
const validateJSON = () => {
  try {
    if (!jsonInput.value.trim()) {
      status.value = '内容为空';
      return;
    }
    JSON.parse(jsonInput.value);
    status.value = 'JSON 结构有效';
  } catch (e) {
    status.value = `无效：${e.message}`;
  }
};

// 工具：对象排序
const sortObject = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sortObject);
  return Object.keys(obj).sort().reduce((result, key) => {
    result[key] = sortObject(obj[key]);
    return result;
  }, {});
};

// 清空
const clearAll = () => {
  jsonInput.value = '';
  status.value = '准备就绪';
};

// 复制
const copyToClipboard = () => {
  navigator.clipboard.writeText(jsonInput.value);
  status.value = '已复制到剪贴板！';
};
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
    <div class="lg:col-span-9 bg-surface-container-lowest dark:bg-surface-container-lowest rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden flex flex-col border border-white dark:border-black transition-all duration-300">
      <div class="flex items-center justify-between px-6 py-4 bg-surface-container-low dark:bg-surface-container-high/40 border-b border-outline-variant/10">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-primary" data-icon="code">code</span>
          <span class="font-headline font-bold text-sm tracking-widest text-on-surface-variant uppercase">源内容</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-outline">行数：{{ lineCount }}</span>
          <div class="h-4 w-px bg-outline-variant/30 mx-2"></div>
          <button @click="copyToClipboard" class="flex items-center gap-1 text-xs font-bold text-primary hover:bg-primary/5 px-2 py-1 rounded transition-colors uppercase cursor-pointer">
            <span class="material-symbols-outlined text-sm">content_copy</span>
            复制
          </button>
        </div>
      </div>

      <div class="flex h-[600px] relative">
        <div class="w-12 bg-surface-container-low/30 border-r border-outline-variant/10 flex flex-col items-center pt-6 font-mono text-[11px] text-outline/50 select-none overflow-hidden">
          <div v-for="n in lineCount" :key="n">{{ n }}</div>
        </div>
        <textarea
            v-model="jsonInput"
            class="flex-1 p-6 font-mono text-sm bg-transparent border-none focus:ring-0 focus:outline-none resize-none text-on-surface placeholder:text-outline-variant/50 leading-relaxed"
            placeholder='{ "hint": "在此粘贴您的 JSON 代码..." }'
            spellcheck="false"
        ></textarea>
      </div>

      <div class="px-6 py-4 bg-surface-container-low/50 border-t border-outline-variant/5 flex justify-between items-center text-[10px]">
        <div class="flex gap-4">
          <div class="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-lg border border-outline-variant/10">
            <span :class="['w-2 h-2 rounded-full', status.includes('错误') || status.includes('无效') ? 'bg-error' : 'bg-primary animate-pulse']"></span>
            <span class="font-medium text-on-surface-variant uppercase tracking-wider">{{ status }}</span>
          </div>
          <div class="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-lg border border-outline-variant/10">
            <span class="text-on-surface-variant font-medium">UTF-8</span>
          </div>
        </div>
        <span class="text-outline hidden sm:block">字符数：{{ charCount }}</span>
      </div>
    </div>

    <div class="lg:col-span-3 space-y-6">
      <div class="bg-surface-container-low dark:bg-surface-container-high rounded-2xl p-6 shadow-xl border border-white dark:border-black transition-all duration-300">
        <div class="flex items-center gap-3 mb-6 border-b border-outline-variant/10 pb-4">
          <span class="material-symbols-outlined text-primary">bolt</span>
          <h2 class="font-headline font-bold text-lg text-on-surface">操作</h2>
        </div>
        <div class="space-y-3">
          <button @click="formatJSON" class="w-full group flex items-center justify-between bg-primary text-on-primary px-4 py-4 rounded-xl font-headline font-bold tracking-tight active:scale-95 transition-all duration-200 cursor-pointer shadow-lg shadow-primary/20">
            <span class="flex items-center gap-3">
              <span class="material-symbols-outlined">auto_fix_high</span>
              格式化 JSON
            </span>
            <span class="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
          </button>

          <button @click="validateJSON" class="w-full group flex items-center justify-between bg-secondary-container dark:bg-surface-container-highest text-on-secondary-container dark:text-on-surface px-4 py-4 rounded-xl font-headline font-bold tracking-tight hover:brightness-105 active:scale-95 transition-all duration-200 cursor-pointer">
            <span class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary">fact_check</span>
              校验 JSON
            </span>
          </button>

          <button @click="minifyJSON" class="w-full group flex items-center justify-between bg-secondary-container dark:bg-surface-container-highest text-on-secondary-container dark:text-on-surface px-4 py-4 rounded-xl font-headline font-bold tracking-tight hover:brightness-105 active:scale-95 transition-all duration-200 cursor-pointer">
            <span class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary">compress</span>
              压缩 JSON
            </span>
          </button>

          <div class="pt-4 mt-2 border-t border-outline-variant/10">
            <button @click="clearAll" class="w-full flex items-center justify-center gap-2 text-error font-headline font-bold px-4 py-3 rounded-xl hover:bg-error/10 active:scale-95 transition-all duration-200 cursor-pointer">
              <span class="material-symbols-outlined">delete_sweep</span>
              清空工作区
            </button>
          </div>
        </div>
      </div>

      <div class="bg-surface-container-low dark:bg-surface-container-low rounded-2xl p-6 shadow-xl border border-white dark:border-black transition-all duration-300">
        <h3 class="text-sm font-bold text-on-surface mb-5 uppercase tracking-widest">快捷设置</h3>
        <div class="space-y-5">
          <div class="flex items-center justify-between">
            <label class="text-xs font-semibold text-on-surface-variant">缩进</label>
            <select v-model="indentation" class="bg-surface-container-highest text-on-surface text-xs rounded-lg border-none py-1.5 px-3 focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer">
              <option :value="2">2 个空格</option>
              <option :value="4">4 个空格</option>
              <option :value="0">制表符</option>
            </select>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-xs font-semibold text-on-surface-variant">按键排序</label>
            <button @click="sortKeys = !sortKeys" :class="['w-10 h-5 rounded-full relative transition-colors cursor-pointer', sortKeys ? 'bg-primary' : 'bg-surface-container-highest']">
              <span :class="['absolute top-1 w-3 h-3 bg-white rounded-full transition-all', sortKeys ? 'right-1' : 'left-1']"></span>
            </button>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-xs font-semibold text-on-surface-variant">严格模式</label>
            <button @click="strictMode = !strictMode" :class="['w-10 h-5 rounded-full relative transition-colors cursor-pointer', strictMode ? 'bg-primary' : 'bg-surface-container-highest']">
              <span :class="['absolute top-1 w-3 h-3 bg-white rounded-full transition-all', strictMode ? 'right-1' : 'left-1']"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 继承 HTML 中的字体设置 */
.font-headline { font-family: 'Manrope', sans-serif; }

/* 简单的行号同步效果 */
textarea {
  tab-size: 2;
  white-space: pre;
  overflow-x: auto;
}

/* 滚动条美化 */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: var(--color-outline-variant);
  border-radius: 10px;
  opacity: 0.5;
}
::-webkit-scrollbar-thumb:hover { background: var(--color-outline); }
</style>