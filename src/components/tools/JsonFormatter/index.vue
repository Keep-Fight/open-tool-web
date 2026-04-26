<template>
  <div class="bg-[#f0f5ff] h-full w-full font-[Inter]">
    <div class=" mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <main class="p-6 relative">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div class="flex flex-col">
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-semibold text-slate-700 italic">输入 (原始 JSON)</label>
              <div class="flex items-center gap-3">
                <span class="text-xs text-slate-400">字符数: {{ rawInput.length }}</span>
                <button @click="handlePaste" class="text-xs text-blue-600 flex items-center gap-1 hover:underline cursor-pointer">
                  <PasteIcon class="w-3 h-3" /> 粘贴
                </button>
              </div>
            </div>
            <div class="flex-1 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden min-h-125 flex">
              <textarea
                  v-model="rawInput"
                  class="w-full p-4 text-sm code-font bg-transparent outline-none resize-none leading-6 text-slate-600"
                  placeholder="在此粘贴 JSON 代码..."
                  @input="validateJson"
              ></textarea>
            </div>
          </div>

          <div class="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <button @click="formatJson" class="w-10 h-10 bg-white border border-slate-200 rounded-full shadow-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
              <ChevronRightIcon class="w-6 h-6" />
            </button>
          </div>

          <div class="flex flex-col">
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-semibold text-slate-700 italic">输出 (预览/折叠)</label>
              <div class="flex items-center gap-3">
                <span class="text-xs text-slate-400">节点数: {{ nodeCount }}</span>
                <button @click="handleCopy" class="text-xs text-blue-600 flex items-center gap-1 hover:underline cursor-pointer">
                  <CopyIcon class="w-3 h-3" /> {{ copyStatus }}
                </button>
              </div>
            </div>
            <div class="flex-1 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden min-h-[500px] flex overflow-auto">
              <div v-if="options.showLineNumbers" class="w-10 bg-slate-100/50 border-r border-slate-200 text-right pr-2 py-4 text-xs text-slate-300 select-none code-font">
                <div v-for="n in 20" :key="n">{{ n }}</div>
              </div>
              <div class="p-4 w-full h-full overflow-auto custom-scrollbar">
                <div v-if="parsedData">
                  <JsonTreeNode :data="parsedData" :is-last="true" />
                </div>
                <div v-else class="text-slate-300 italic text-sm">等待有效输入...</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer class="p-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div class="md:col-span-1">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">校验结果</h3>
          <div class="flex items-start gap-3">
            <div :class="[isValid ? 'bg-emerald-100' : 'bg-rose-100']" class="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center">
              <component :is="isValid ? CheckIcon : XIcon" :class="[isValid ? 'text-emerald-600' : 'text-rose-600']" class="w-3.5 h-3.5" />
            </div>
            <div>
              <p class="text-sm font-bold text-slate-700">{{ isValid ? 'JSON 格式正确' : '语法错误' }}</p>
              <p class="text-xs text-slate-400 mt-0.5">{{ errorMsg || '未发现语法错误' }}</p>
            </div>
          </div>
        </div>

        <div class="md:col-span-2">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">工具选项</h3>
          <div class="flex flex-wrap gap-x-5 gap-y-3">
            <label v-for="(val, key) in options" :key="key" class="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" v-model="options[key]" class="hidden" />
              <div :class="[options[key] ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300']" class="w-4 h-4 border rounded flex items-center justify-center text-white transition-colors">
                <CheckIcon v-if="options[key]" class="w-3 h-3" />
              </div>
              <span class="text-xs font-medium text-slate-600 group-hover:text-blue-600 transition-colors">
                {{ optionLabels[key] }}
              </span>
            </label>
          </div>
        </div>

        <div class="md:col-span-2">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">操作按钮</h3>
          <div class="flex flex-wrap gap-x-3 gap-y-3">
            <button @click="formatJson" class="text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 transition-colors cursor-pointer">格式化</button>
            <button @click="minifyJson" class="text-xs font-medium text-white bg-slate-700 hover:bg-slate-800 rounded-lg px-4 py-2 transition-colors cursor-pointer">压缩</button>
            <button @click="clearAll" class="text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg px-4 py-2 transition-colors cursor-pointer">清空</button>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue';
import {
  Clipboard as PasteIcon,
  Copy as CopyIcon,
  Check as CheckIcon,
  X as XIcon,
  ChevronRight as ChevronRightIcon
} from 'lucide-vue-next';
import JsonTreeNode from './components/JsonTreeNode.vue';

// 状态
const rawInput = ref('');
const parsedData = ref(null);
const isValid = ref(true);
const errorMsg = ref('');
const copyStatus = ref('复制');

const options = reactive({
  autoFormat: true,
  showLineNumbers: true,
  sortKeys: false
});

const optionLabels = {
  autoFormat: '自动格式化',
  showLineNumbers: '显示行号',
  sortKeys: '按键排序'
};

// 逻辑
const validateJson = () => {
  if (!rawInput.value.trim()) {
    parsedData.value = null;
    isValid.value = true;
    errorMsg.value = '';
    return;
  }
  try {
    let data = JSON.parse(rawInput.value);
    if (options.sortKeys) data = sortObjectKeys(data);
    parsedData.value = data;
    isValid.value = true;
    errorMsg.value = '';
  } catch (e) {
    isValid.value = false;
    errorMsg.value = e.message;
  }
};

const sortObjectKeys = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sortObjectKeys);
  return Object.keys(obj).sort().reduce((acc, key) => {
    acc[key] = sortObjectKeys(obj[key]);
    return acc;
  }, {});
};

const formatJson = () => {
  validateJson();
  if (isValid.value && parsedData.value) {
    rawInput.value = JSON.stringify(parsedData.value, null, 2);
  }
};

const minifyJson = () => {
  validateJson();
  if (isValid.value && parsedData.value) {
    rawInput.value = JSON.stringify(parsedData.value);
  }
};

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(rawInput.value);
    copyStatus.value = '已复制!';
    setTimeout(() => copyStatus.value = '复制', 2000);
  } catch (err) {
    alert('复制失败');
  }
};

const handlePaste = async () => {
  const text = await navigator.clipboard.readText();
  rawInput.value = text;
  validateJson();
};

const clearAll = () => {
  rawInput.value = '';
  parsedData.value = null;
};

const nodeCount = computed(() => {
  if (!parsedData.value) return 0;
  return JSON.stringify(parsedData.value).length;
});

// 监听
watch(() => options.autoFormat, (newVal) => {
  if (newVal) validateJson();
});

watch(() => options.sortKeys, () => {
  validateJson();
});

// 初始化
validateJson();
</script>

<style>
.code-font {
  font-family: 'JetBrains Mono', monospace;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
</style>