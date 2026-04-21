<template>
  <div class="h-full flex flex-col">
    <div
        @click="router.back()"
        class="flex-shrink-0 inline-flex items-center text-sm transition-colors py-4 px-6 dark:text-gray-300 dark:hover:text-blue-400 text-gray-500 hover:text-blue-600 cursor-pointer"
    >
      <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M15 19l-7-7 7-7" stroke-width="2"/>
      </svg>
      <span class="dark:text-gray-300 text-gray-500">返回</span>
    </div>

    <div class="flex-1 overflow-auto px-6 pb-10">
      <div
          class="max-w-7xl mx-auto h-full rounded-3xl p-8 shadow-sm border transition-colors dark:bg-slate-800 dark:border-slate-700 bg-white border-gray-100">
        <component :is="activeTool" v-if="activeTool" class="h-full"/>
        <div
            v-else
            class="h-full flex items-center justify-center text-center transition-colors dark:text-gray-500 text-gray-400"
        >
          工具开发中...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {toolsComponent} from "@/data/tools.js";

const route = useRoute()
const router = useRouter()

// 获取工具组件和标题
const activeTool = computed(() => {
  return toolsComponent[route.params.id] || null
})
</script>
