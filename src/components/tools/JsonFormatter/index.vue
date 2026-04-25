<script setup>
import { ref, computed } from 'vue';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

const jsonInput = ref('');
const indentation = ref(2);
const sortKeys = ref(false);
const strictMode = ref(true);
const status = ref('准备就绪');
const showPreview = ref(false);

// 解析后的 JSON 数据
const parsedJson = computed(() => {
  try {
    if (!jsonInput.value.trim()) return null;
    return JSON.parse(jsonInput.value);
  } catch {
    return null;
  }
});

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
    showPreview.value = true;
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
    showPreview.value = false;
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
  showPreview.value = false;
};

// 复制
const copyToClipboard = () => {
  navigator.clipboard.writeText(jsonInput.value);
  status.value = '已复制到剪贴板！';
};
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full h-full">
    <div class="h-full lg:col-span-9 bg-surface-container-lowest dark:bg-surface-container-lowest rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden flex flex-col border border-white dark:border-black transition-all duration-300">
      <div class="flex items-center justify-between px-6 py-4 bg-surface-container dark:bg-surface-container-high/40 border-b border-outline-variant/10">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-primary" data-icon="code">code</span>
          <span class="font-headline font-bold text-sm tracking-widest text-on-surface-variant uppercase">JSON 格式化/校验</span>
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

      <div class="flex flex-col h-full relative">
        <textarea
            v-show="!showPreview"
            v-model="jsonInput"
            class="flex-1 p-6 font-mono text-sm bg-transparent border-none focus:ring-0 focus:outline-none resize-none text-on-surface leading-relaxed"
            placeholder='{ "hint": "在此粘贴您的 JSON 代码..." }'
            spellcheck="false"
        ></textarea>

        <div v-if="showPreview && parsedJson" class="flex-1 overflow-auto">
          <div class="sticky top-0 z-10 flex items-center justify-between px-6 py-2 bg-surface-container-high/80 backdrop-blur-sm border-b border-outline-variant/10">
            <span class="text-xs font-medium text-on-surface-variant">JSON 预览 · 可点击节点折叠</span>
            <button @click="showPreview = false" class="text-xs text-primary hover:text-primary/80 cursor-pointer">返回编辑</button>
          </div>
          <div class="p-4">
            <vue-json-pretty
                :data="parsedJson"
                :collapsed="1"
                :show-length="true"
                :show-line="true"
                :show-icon="true"
                line-color="var(--color-outline-variant)"
                key-color="var(--color-primary)"
                value-color="var(--color-on-surface)"
                bracket-color="var(--color-on-surface-variant)"
                quote-color="var(--color-primary)"
                tree-height="500"
            />
          </div>
        </div>
      </div>

      <div class="px-6 py-4 bg-surface-container border-t border-outline-variant/5 flex justify-between items-center text-[10px]">
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

/* JSON 树形视图折叠控制器样式 - 移至行首 */
:deep(.vjs-tree-node.has-carets) {
  padding-left: 20px;
}

:deep(.vjs-carets) {
  position: absolute;
  left: 0;
  right: auto;
  width: 16px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-primary);
  z-index: 1;
}

:deep(.vjs-carets svg) {
  transition: transform 0.2s;
  width: 12px;
  height: 12px;
}

:deep(.vjs-carets:hover) {
  color: var(--color-primary);
}

:deep(.vjs-tree-node) {
  position: relative;
  padding-left: 20px !important;
  line-height: 24px;
}

:deep(.vjs-tree-node:hover) {
  background-color: var(--color-surface-container-high);
  border-radius: 4px;
}
</style>