<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { Star } from 'lucide-vue-next'
import {useTools} from "@/composables/useTools"
const {
  tools
} = useTools()


const route = useRoute()
const router = useRouter()
const favoriteStore = useFavoriteStore()

// 根据 id 获取工具
const tool = computed(() => {
  return tools.value.find(t => t.id === route.params.id)
})

// 获取工具组件
const activeTool = computed(() => {
  return tool.value?.component
})

// 收藏状态
const isFavorite = computed(() => {
  return tool.value ? favoriteStore.isFav(tool.value.id) : false
})

// 切换收藏
const toggleFavorite = () => {
  if (tool.value) {
    favoriteStore.toggle(tool.value.id)
  }
}

// 返回
const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="h-full flex flex-col bg-background transition-colors duration-300">

    <!-- 返回按钮 -->
    <div class="flex-shrink-0 flex items-center py-3 px-6">
      <div
          @click="goBack"
          class="inline-flex items-center text-sm font-medium transition-all py-2 px-3 -ml-3 rounded-lg
                 text-on-surface-variant hover:text-primary hover:bg-primary/5 cursor-pointer group"
      >
        <span class="material-symbols-outlined text-[20px] mr-1 group-hover:-translate-x-1 transition-transform">arrow_back</span>
        <span>返回工具箱</span>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="flex-1 overflow-hidden px-6 pb-6 flex flex-col">
      <div class="flex-1 rounded-2xl shadow-sm border border-outline-variant/30 bg-surface overflow-hidden transition-all flex flex-col">

        <!-- 工具头部 -->
        <header v-if="tool" class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 border-b border-outline-variant/30 shrink-0">
          <div class="flex items-center gap-3">
            <div :class="`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${tool.color}`">
              <component
                  :is="tool.icon"
                  class="w-7 h-7"
                  v-bind="{name: tool.iconName}"
              />
            </div>
            <div>
              <h1 :class="['text-2xl font-bold text-on-surface flex items-center gap-2 flex-wrap',tool.titleColor]">
                {{ tool.title }}
                <span v-for="cat in tool.category" :key="cat" class="text-[10px] font-normal bg-blue-100 text-blue-600 px-2 py-0.5 rounded dark:bg-blue-500/20 dark:text-blue-400">
                  {{ cat }}
                </span>
              </h1>
              <p class="text-sm text-on-surface-variant mt-1">{{ tool.description }}</p>
            </div>
          </div>
          <div class="flex gap-2 shrink-0">
            <button
              @click="toggleFavorite"
              class="px-3 py-1.5 border border-outline-variant rounded-lg text-sm flex items-center gap-1 transition"
              :class="isFavorite ? 'text-yellow-400 border-yellow-400/30 bg-yellow-50/50 dark:bg-yellow-500/10' : 'text-on-surface-variant hover:bg-surface-container-low'"
            >
              <Star class="w-4 h-4" :class="isFavorite ? 'fill-yellow-400' : ''"/>
              {{ isFavorite ? '已收藏' : '收藏' }}
            </button>
          </div>
        </header>

        <!-- 工具内容 - flex-1 撑满剩余高度 -->
        <div class="flex-1 overflow-auto ">
          <component :is="activeTool" v-if="activeTool" />
          <div v-else class="h-full flex flex-col items-center justify-center text-outline">
            <span class="material-symbols-outlined text-4xl mb-2 animate-pulse">construction</span>
            <p class="font-headline font-bold">工具正在维护或开发中...</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
