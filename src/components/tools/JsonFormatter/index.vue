<template>
  <div class="bg-background h-full w-full font-body">
    <div class="mx-auto shadow-sm border-outline-variant/30 bg-surface overflow-hidden">
      <main class="p-6 relative">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div class="flex flex-col">
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-semibold text-on-surface italic">JSON 数据</label>
              <div class="flex items-center gap-3">
                <span class="text-xs text-on-surface-variant">字符数: {{ rawInput.length }}</span>
              </div>
            </div>
            <div class="flex-1 bg-surface border border-outline-variant/60 rounded-xl overflow-hidden min-h-125 flex">
              <textarea
                  v-model="rawInput"
                  class="w-full p-4 text-sm code-font bg-transparent outline-none resize-none leading-6 text-on-surface scrollbar-custom"
                  placeholder="在此粘贴 JSON 代码..."
                  @input="validateJson"
              ></textarea>
            </div>
          </div>

          <div class="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <button @click="formatJson" class="w-10 h-10 bg-surface-container-lowest border border-outline/30 rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-surface-container-low transition-all cursor-pointer">
              <ChevronRightIcon class="w-6 h-6" />
            </button>
          </div>

          <div class="flex flex-col">
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-semibold text-on-surface italic">JSON 预览</label>
              <div class="flex items-center gap-3">
                <span class="text-xs text-on-surface-variant">节点数: {{ nodeCount }}</span>
              </div>
            </div>
            <div class="flex-1 bg-surface border border-outline/30 rounded-xl overflow-hidden max-h-125 flex ">
              <div v-if="options.showLineNumbers" class="w-10 bg-surface border-r border-outline/30 text-right pr-2 py-4 text-xs text-on-surface-variant/30 select-none code-font">
                <div v-for="n in 20" :key="n">{{ n }}</div>
              </div>
              <div class="p-4 w-full h-3xl overflow-auto scrollbar-custom">
                <div v-if="parsedData">
                  <JsonTreeNode :data="parsedData" :is-last="true" />
                </div>
                <div v-else class="text-on-surface-variant italic text-sm">等待有效输入...</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer class="p-6 border-t border-outline-variant grid grid-cols-1 md:grid-cols-5 gap-8">
        <div class="md:col-span-1">
          <h3 class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">校验结果</h3>
          <div class="flex items-start gap-3">
            <div :class="[isValid ? 'bg-emerald-500/10' : 'bg-rose-500/10']" class="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center">
              <component :is="isValid ? CheckIcon : XIcon" :class="[isValid ? 'text-emerald-600' : 'text-rose-600']" class="w-3.5 h-3.5" />
            </div>
            <div>
              <p class="text-sm font-bold text-on-surface">{{ isValid ? 'JSON 格式正确' : '语法错误' }}</p>
              <p class="text-xs text-on-surface-variant mt-0.5">{{ errorMsg || '未发现语法错误' }}</p>
            </div>
          </div>
        </div>

        <div class="md:col-span-2">
          <h3 class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">工具选项</h3>
          <div class="flex flex-wrap gap-x-5 gap-y-3">
            <label v-for="(val, key) in options" :key="key" class="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" v-model="options[key]" class="hidden" />
              <div :class="[options[key] ? 'bg-primary border-primary' : 'bg-surface-container-lowest border-outline']" class="w-4 h-4 border rounded flex items-center justify-center text-white transition-colors">
                <CheckIcon v-if="options[key]" class="w-3 h-3" />
              </div>
              <span class="text-xs font-medium text-on-surface group-hover:text-primary transition-colors">
                {{ optionLabels[key] }}
              </span>
            </label>
          </div>
        </div>

        <div class="md:col-span-2">
          <h3 class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">操作按钮</h3>
          <div class="flex flex-wrap gap-x-3 gap-y-3">
            <button @click="handlePaste" class="text-xs font-medium text-white bg-primary hover:opacity-90 rounded-lg px-4 py-2 transition-colors cursor-pointer">粘贴</button>
            <button @click="formatJson" class="text-xs font-medium text-white bg-primary hover:opacity-90 rounded-lg px-4 py-2 transition-colors cursor-pointer">格式化</button>
            <button @click="minifyJson" class="text-xs font-medium text-white bg-primary hover:opacity-90 rounded-lg px-4 py-2 transition-colors cursor-pointer">压缩</button>
            <button @click="handleCopy" class="text-xs font-medium text-white bg-primary hover:opacity-90 rounded-lg px-4 py-2 transition-colors cursor-pointer">复制</button>
            <button @click="clearAll" class="text-xs font-medium text-white bg-primary hover:opacity-90 rounded-lg px-4 py-2 transition-colors cursor-pointer">清空</button>
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
import { useToast } from '@/composables/useToast';

// 状态
const rawInput = ref('');
const parsedData = ref(null);
const isValid = ref(true);
const errorMsg = ref('');
const toast = useToast();

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
    toast.success('格式化成功');
  } else {
    toast.error('格式化失败：JSON 格式错误');
  }
};

const minifyJson = () => {
  validateJson();
  if (isValid.value && parsedData.value) {
    rawInput.value = JSON.stringify(parsedData.value);
    toast.success('压缩成功');
  } else {
    toast.error('压缩失败：JSON 格式错误');
  }
};

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(rawInput.value);
    toast.success('已复制到剪贴板');
  } catch (err) {
    toast.error('复制失败');
  }
};

const handlePaste = async () => {
  try {
    const text = await navigator.clipboard.readText();
    rawInput.value = text;
    validateJson();
    toast.info('已粘贴');
  } catch (err) {
    toast.error('粘贴失败，请手动粘贴');
  }
};

const clearAll = () => {
  rawInput.value = '';
  parsedData.value = null;
  toast.info('已清空');
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