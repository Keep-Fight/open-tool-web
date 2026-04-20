<template>
  <div class="max-w-7xl mx-auto px-6 py-10 transition-colors duration-200 ">
    <router-link
        to="/"
        class="inline-flex items-center text-sm transition-colors mb-8 dark:text-gray-300 dark:hover:text-blue-400 text-gray-500 hover:text-blue-600"
    >
      <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M15 19l-7-7 7-7" stroke-width="2"/>
      </svg>
      <span class="dark:text-gray-300 text-gray-500">返回首页</span>
    </router-link>

    <div
        class="rounded-3xl p-8 shadow-sm border transition-colors dark:bg-slate-800 dark:border-slate-700 bg-white border-gray-100">
      <component :is="activeTool" v-if="activeTool"/>
      <div
          v-else
          class="text-center py-20 transition-colors dark:text-gray-500 text-gray-400"
      >
        工具开发中...
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {toolsComponent} from "@/data/tools.js";

const props = defineProps(['id'])
console.log(props.id)

// 获取工具组件和标题
const activeTool = computed(() => {
  return toolsComponent[props.id] || null
})
</script>
