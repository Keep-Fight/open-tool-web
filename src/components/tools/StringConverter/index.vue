<template>
  <div class="h-full flex flex-col font-sans text-on-surface dark:text-gray-100 overflow-hidden">
    <div
        class="h-full p-6 mb-6 flex-grow flex flex-col justify-center bg-white dark:bg-[#121214] border border-gray-200 dark:border-[#27272a]">
      <div class="flex flex-col md:flex-row items-stretch gap-4 h-full">

        <div class="flex-1 flex flex-col">
          <label class="block text-sm font-bold text-gray-700 dark:text-[#f1f1f1] mb-2">输入</label>
          <div class="relative flex-grow">
            <textarea
                v-model="inputText"
                class="w-full min-h-[600px] p-4  border border-gray-200 dark:border-[#3f3f46] rounded-lg bg-white dark:bg-[#1c1c1f] text-sm text-gray-900 dark:text-[#f1f1f1] placeholder:text-gray-400 dark:placeholder:text-[#a1a1aa] focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#0066ff] focus:outline-none resize-none"
                placeholder="请输入要转换的内容..."
                maxlength="10000"
            ></textarea>
            <span class="absolute bottom-2 right-3 text-xs text-gray-400 dark:text-[#a1a1aa]">
              {{ inputText.length }} / 10000
            </span>
          </div>

          <div class="grid grid-cols-2 gap-3 mt-4">
            <div>
              <label class="block text-xs text-gray-500 dark:text-[#a1a1aa] mb-1">输入编码</label>
              <select v-model="inputEncoding"
                      class="w-full border border-gray-200 dark:border-[#27272a] rounded-md p-2 text-sm bg-white dark:bg-[#1c1c1f] dark:text-[#f1f1f1] focus:outline-none">
                <option v-for="opt in encodings" :key="opt">{{ opt }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-gray-500 dark:text-[#a1a1aa] mb-1">输入格式</label>
              <select v-model="inputFormat"
                      class="w-full border border-gray-200 dark:border-[#27272a] rounded-md p-2 text-sm bg-white dark:bg-[#1c1c1f] dark:text-[#f1f1f1] focus:outline-none">
                <option v-for="opt in formats" :key="opt">{{ opt }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-center">
          <button
              class="bg-blue-50 dark:bg-[#0066ff]/10 text-blue-600 dark:text-[#0066ff] w-10 h-10 rounded-full hover:bg-blue-100 dark:hover:bg-[#0066ff]/20 transition-colors border border-blue-100 dark:border-[#0066ff]/20 flex items-center justify-center">
            <i class="fa-solid fa-right-left"></i>
          </button>
        </div>

        <div class="flex-1 flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-semibold text-on-surface italic">输出</label>
            <div class="flex items-center gap-3">
              <button @click="expandAll"
                      class="text-xs text-blue-600 flex items-center gap-1 hover:underline cursor-pointer">
                <Copy class="w-3 h-3"/>
                复制
              </button>
            </div>
          </div>
          <div class="flex-grow">
            <textarea
                :value="outputText"
                readonly
                class="w-full h-full p-4 border border-gray-200 dark:border-[#27272a] rounded-lg bg-gray-50 dark:bg-[#0a0a0b] text-sm text-gray-600 dark:text-[#a1a1aa] focus:outline-none resize-none"
                placeholder="转换结果将显示在这里..."
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-3 mt-4">
            <div>
              <label class="block text-xs text-gray-500 dark:text-[#a1a1aa] mb-1">输出编码</label>
              <select v-model="outputEncoding"
                      class="w-full border border-gray-200 dark:border-[#27272a] rounded-md p-2 text-sm bg-white dark:bg-[#1c1c1f] dark:text-[#f1f1f1] focus:outline-none">
                <option v-for="opt in encodings" :key="opt">{{ opt }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-gray-500 dark:text-[#a1a1aa] mb-1">输出格式</label>
              <select v-model="outputFormat"
                      class="w-full border border-gray-200 dark:border-[#27272a] rounded-md p-2 text-sm bg-white dark:bg-[#1c1c1f] dark:text-[#f1f1f1] focus:outline-none">
                <option v-for="opt in formats" :key="opt">{{ opt }}</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div
        class=" bg-blue-50/50 dark:bg-[#0066ff]/5 p-3 flex flex-wrap items-center gap-4 text-[11px] text-gray-500 dark:text-[#a1a1aa] border border-blue-100 dark:border-[#0066ff]/10 shrink-0">
      <div class="flex items-center gap-1">
        <i class="fa-solid fa-circle-info text-blue-400 dark:text-[#0066ff]"></i>
        <span class="font-bold">支持的编码：</span> UTF-8, GBK, GK2312, ASCII, ISO-8859-1
      </div>
      <div class="flex items-center gap-1">
        <span class="font-bold ml-2">支持的格式：</span> 字符串, 十六进制, 十进制, 二进制, Base64, URL 编码
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue';
import {Copy} from "lucide-vue-next";

// 状态管理
const inputText = ref('');
const inputEncoding = ref('UTF-8');
const inputFormat = ref('字符串');
const outputEncoding = ref('UTF-8');
const outputFormat = ref('十六进制');

const encodings = ['UTF-8', 'GBK', 'ASCII', 'ISO-8859-1'];
const formats = ['字符串', '十六进制', 'Base64', '十进制', '二进制'];

// 转换逻辑（此处保持原示例中的镜像逻辑，可根据需求扩展具体算法）
const outputText = computed(() => {
  if (!inputText.value) return '';
  // 模拟转换逻辑：目前仅透传，实际开发可在此编写转换函数
  return inputText.value;
});
</script>

<style scoped>
/* 移除 textarea 滚动条样式优化 (可选) */
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 10px;
}
</style>
