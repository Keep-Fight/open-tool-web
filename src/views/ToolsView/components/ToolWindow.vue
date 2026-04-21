<template>
  <div class="h-full flex flex-col bg-background transition-colors duration-300">
    <div class="flex-shrink-0 flex items-center justify-between py-4 px-8">
      <div
          @click="router.back()"
          class="inline-flex items-center text-sm font-medium transition-all py-2 px-3 -ml-3 rounded-lg
                 text-on-surface-variant hover:text-primary hover:bg-primary/5 cursor-pointer group"
      >
        <span class="material-symbols-outlined text-[20px] mr-1 group-hover:-translate-x-1 transition-transform">arrow_back</span>
        <span>返回工具列表</span>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-[10px] font-bold uppercase tracking-widest text-outline">Open Toolbox / {{ route.params.id }}</span>
      </div>
    </div>

    <div class="flex-1 overflow-auto px-6 pb-6 h-full">
      <div
          class="max-w-10xl mx-auto h-full rounded-3xl p-6 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)]
                 dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-outline-variant/30
                 bg-surface overflow-hidden transition-all"
      >
        <component :is="activeTool" v-if="activeTool" />

        <div v-else class="h-full flex flex-col items-center justify-center text-outline">
          <span class="material-symbols-outlined text-4xl mb-2 animate-pulse">construction</span>
          <p class="font-headline font-bold">工具正在维护或开发中...</p>
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
