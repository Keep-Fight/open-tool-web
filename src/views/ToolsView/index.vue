<script setup>
import ToolSidebar from "./components/ToolSidebar.vue"
import ToolCard from "./components/ToolCard.vue"
import {useTools} from "@/composables/useTools"

const {
  searchQuery,
  activeCategory,
  menus,
  filteredTools,
  favoriteCount,
  selectCategory,
  showFavorites,
  toggleFavorite
} = useTools()
</script>

<template>
  <div class="h-screen flex bg-[var(--color-background)] overflow-hidden">

    <ToolSidebar
      :menus="menus"
      :activeCategory="activeCategory"
      :favoriteCount="favoriteCount"
      @select="selectCategory"
      @showFavorites="showFavorites"
    />

    <main class="flex-1 p-8 overflow-y-auto">

      <div class="flex items-center gap-4 mb-8">
        <input
            v-model="searchQuery"
            placeholder="搜索工具..."
            class="flex-1 max-w-2xl px-4 py-3 rounded-2xl shadow-sm
                 bg-[var(--color-surface-container-lowest)]
                 border border-[var(--color-outline-variant)]
                 text-[var(--color-on-surface)]
                 placeholder:text-[var(--color-on-surface-variant)]
                 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div class="mb-6 text-sm text-[var(--color-on-surface-variant)]">
        共 {{ filteredTools.length }} 个工具
      </div>

      <div v-if="filteredTools.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        <ToolCard
          v-for="t in filteredTools"
          :key="t.id"
          v-bind="t"
          @toggleFavorite="toggleFavorite"
        />
      </div>

      <div v-else class="flex flex-col items-center justify-center py-20 text-center">
        <p class="text-lg text-[var(--color-on-surface-variant)]">没有找到匹配的工具</p>
        <p class="text-sm text-[var(--color-on-surface-variant)] mt-2">尝试调整搜索条件或浏览其他分类</p>
      </div>

    </main>
  </div>
</template>
