<template>
  <div class="h-full flex flex-col font-sans text-on-surface dark:text-gray-100 overflow-hidden">
    <div
        class="h-full p-6  grow flex flex-col justify-center bg-card-window-body ">
      <div class="flex flex-col md:flex-row items-stretch gap-4 h-full">

        <div class="flex-1 flex flex-col">
          <label class="block text-sm font-bold text-gray-700 dark:text-[#f1f1f1] mb-2">输入</label>
          <div class="relative grow">
            <textarea
                v-model="inputText"
                class="w-full min-h-150 p-4  border border-gray-200 dark:border-[#3f3f46] rounded-lg bg-white dark:bg-[#1c1c1f] text-sm text-gray-900 dark:text-[#f1f1f1] placeholder:text-gray-400 dark:placeholder:text-[#a1a1aa] focus:ring-2 focus:ring-blue-500 dark:focus:ring-2 focus:outline-none resize-h"
                placeholder="请输入要转换的内容..."
                maxlength="10000"
            ></textarea>
            <span class="absolute bottom-2 right-3 text-xs text-gray-400 dark:text-[#a1a1aa]">
              {{ inputText.length }} / 10000
            </span>
          </div>

          <div class="mt-4">
            <label class="block text-xs text-gray-500 dark:text-[#a1a1aa] mb-1">输入格式</label>
            <select v-model="inputFormat"
                    class="w-full border border-gray-200 dark:border-[#27272a] rounded-md p-2 text-sm bg-white dark:bg-[#1c1c1f] dark:text-[#f1f1f1] focus:outline-none">
              <option v-for="opt in formats" :key="opt">{{ opt }}</option>
            </select>
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
            <label class="text-sm font-semibold text-on-surface ">输出</label>
            <div class="flex items-center gap-3">
              <button @click="copyOutput"
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

          <div class="mt-4">
            <label class="block text-xs text-gray-500 dark:text-[#a1a1aa] mb-1">输出格式</label>
            <select v-model="outputFormat"
                    class="w-full border border-gray-200 dark:border-[#27272a] rounded-md p-2 text-sm bg-white dark:bg-[#1c1c1f] dark:text-[#f1f1f1] focus:outline-none">
              <option v-for="opt in formats" :key="opt">{{ opt }}</option>
            </select>
          </div>
        </div>

      </div>
    </div>

    <div
        class=" bg-blue-50/50 dark:bg-[#0066ff]/5 p-3 flex flex-wrap items-center gap-4 text-[11px] text-gray-500 dark:text-[#a1a1aa] border border-blue-100 dark:border-[#0066ff]/10 shrink-0">
      <div class="flex items-center gap-1">
        <i class="fa-solid fa-circle-info text-blue-400 dark:text-[#0066ff]"></i>
        <span class="font-bold">支持的格式：</span> 字符串, 十六进制, 十进制, 二进制, Base64, URL 编码
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue';
import {Copy} from "lucide-vue-next";

const inputText = ref('');
const inputFormat = ref('字符串');
const outputFormat = ref('字符串');

const formats = ['字符串', 'Base64', 'URL编码', '十六进制', '十进制', '二进制'];

function textToBytes(str, format) {
  let bytes;
  const encoder = new TextEncoder();

  if (format === '字符串') {
    bytes = encoder.encode(str);
  } else if (format === 'Base64') {
    try {
      const decoded = atob(str);
      bytes = new Uint8Array(decoded.length);
      for (let i = 0; i < decoded.length; i++) {
        bytes[i] = decoded.charCodeAt(i);
      }
    } catch {
      return null;
    }
  } else if (format === 'URL编码') {
    try {
      const decoded = decodeURIComponent(str);
      bytes = encoder.encode(decoded);
    } catch {
      return null;
    }
  } else if (format === '十六进制') {
    const hex = str.replace(/\s+/g, '');
    if (!/^[0-9a-fA-F]*$/.test(hex) || hex.length % 2 !== 0) {
      return null;
    }
    bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
  } else if (format === '十进制') {
    const parts = str.split(/[\s,]+/).filter(p => p);
    bytes = new Uint8Array(parts.length);
    for (let i = 0; i < parts.length; i++) {
      const num = parseInt(parts[i], 10);
      if (isNaN(num) || num < 0 || num > 255) return null;
      bytes[i] = num;
    }
  } else if (format === '二进制') {
    const bin = str.replace(/\s+/g, '');
    if (!/^[01]*$/.test(bin) || bin.length % 8 !== 0) {
      return null;
    }
    bytes = new Uint8Array(bin.length / 8);
    for (let i = 0; i < bin.length; i += 8) {
      bytes[i / 8] = parseInt(bin.slice(i, i + 8), 2);
    }
  } else {
    bytes = encoder.encode(str);
  }

  return bytes;
}

function bytesToText(bytes, format) {
  if (!bytes || bytes.length === 0) return '';

  let result = '';
  const decoder = new TextDecoder('utf-8');

  if (format === '字符串') {
    try {
      result = decoder.decode(new Uint8Array(bytes));
    } catch {
      result = '';
    }
  } else if (format === 'Base64') {
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    result = btoa(binary);
  } else if (format === 'URL编码') {
    try {
      const text = decoder.decode(new Uint8Array(bytes));
      result = encodeURIComponent(text);
    } catch {
      result = '';
    }
  } else if (format === '十六进制') {
    result = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ');
  } else if (format === '十进制') {
    result = Array.from(bytes).map(b => b.toString(10)).join(' ');
  } else if (format === '二进制') {
    result = Array.from(bytes).map(b => b.toString(2).padStart(8, '0')).join(' ');
  }

  return result;
}

const outputText = computed(() => {
  if (!inputText.value) return '';

  const bytes = textToBytes(inputText.value, inputFormat.value);
  if (!bytes) return '输入格式错误';

  return bytesToText(bytes, outputFormat.value);
});

function copyOutput() {
  if (outputText.value && outputText.value !== '输入格式错误') {
    navigator.clipboard.writeText(outputText.value);
  }
}
</script>

<style scoped>
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 10px;
}
</style>