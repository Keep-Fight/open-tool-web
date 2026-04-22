<template>
  <div class="font-mono text-sm leading-6 select-none">
    <div v-if="isObject" class="flex flex-col">
      <div class="flex items-start group">
        <span
            @click="toggle"
            class="cursor-pointer mr-1 mt-1.5 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-transform duration-200"
            :class="{ 'rotate-[-90deg]': collapsed }"
        >
          <svg class="w-3 h-3 fill-current text-gray-500" viewBox="0 0 20 20">
            <path d="M5 6l5 5 5-5 1.5 1.5L10 14 3.5 7.5 5 6z" />
          </svg>
        </span>

        <div class="flex-1">
          <span v-if="jsonKey" class="text-purple-600 dark:text-purple-400">"{{ jsonKey }}": </span>

          <template v-if="!collapsed">
            <span class="text-gray-500">{{ isArray ? '[' : '{' }}</span>
            <div class="pl-6 border-l border-gray-200 dark:border-gray-800 ml-1.5">
              <div v-for="(value, key, index) in data" :key="key">
                <JsonViewer
                    :data="value"
                    :json-key="isArray ? '' : String(key)"
                    :is-last="index === Object.keys(data).length - 1"
                />
              </div>
            </div>
            <span class="text-gray-500">{{ isArray ? ']' : '}' }}{{ isLast ? '' : ',' }}</span>
          </template>

          <template v-else>
            <span
                @click="copyToClipboard(data)"
                class="cursor-pointer bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800 hover:border-blue-400 transition-colors inline-flex items-center gap-1"
                title="点击复制该部分 JSON"
            >
              {{ isArray ? '[...]' : '{...}' }}
              <span class="text-[10px] opacity-70 italic">{{ itemCount }} items</span>
            </span>
            <span v-if="!isLast" class="text-gray-500">,</span>
          </template>
        </div>
      </div>
    </div>

    <div v-else class="flex ml-5 group">
      <span v-if="jsonKey" class="text-purple-600 dark:text-purple-400">"{{ jsonKey }}": </span>
      <span :class="valueClass" class="break-all">
        {{ formatValue(data) }}
      </span>
      <span v-if="!isLast" class="text-gray-500">,</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  data: {
    required: true
  },
  jsonKey: {
    type: String,
    default: ''
  },
  isLast: {
    type: Boolean,
    default: true
  }
});

const collapsed = ref(false);

const isObject = computed(() => {
  return props.data !== null && typeof props.data === 'object';
});

const isArray = computed(() => {
  return Array.isArray(props.data);
});

const itemCount = computed(() => {
  if (isArray.value) return props.data.length;
  if (isObject.value) return Object.keys(props.data).length;
  return 0;
});

const toggle = () => {
  collapsed.value = !collapsed.value;
};

// 格式化基础值
const formatValue = (val) => {
  if (typeof val === 'string') return `"${val}"`;
  if (val === null) return 'null';
  return val;
};

// 样式区分
const valueClass = computed(() => {
  if (typeof props.data === 'string') return 'text-green-600 dark:text-green-400';
  if (typeof props.data === 'number') return 'text-orange-500 dark:text-orange-300';
  if (typeof props.data === 'boolean') return 'text-blue-500 dark:text-blue-400';
  if (props.data === null) return 'text-gray-400 italic';
  return 'text-gray-900 dark:text-gray-100';
});

// 复制功能
const copyToClipboard = async (val) => {
  try {
    const text = JSON.stringify(val, null, 2);
    await navigator.clipboard.writeText(text);
    alert('JSON 片段已复制到剪贴板');
  } catch (err) {
    console.error('无法复制: ', err);
  }
};
</script>

<style scoped>
/* 针对 Tailwind 4 的微调：确保代码字体渲染清晰 */
.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>