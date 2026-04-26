<template>
  <section class="py-24 px-8 bg-surface-container-low dark:bg-surface">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-12">
        <h2 class="text-3xl font-bold font-headline text-on-surface">
          开放工具
        </h2>
        <div class="h-px grow mx-8 bg-outline-variant/20 dark:bg-outline-variant hidden md:block"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        <div
          v-for="item in topCategories"
          :key="item.category.id"
          class="category-card group"
        >
          <div :class="['icon-box', item.colorClass]">
            <component :is="item.category.icon" v-bind="{name: item.category.iconName}" class="w-7 h-7" />
          </div>
          <h3 class="text-xl font-bold font-headline mb-4">{{ item.category.title }}</h3>
          <ul class="space-y-3">
            <li v-for="tool in item.tools" :key="tool.id">
              <router-link class="nav-link" :to="`/tools/${tool.id}`">
                {{ tool.title }}
                <span class="material-symbols-outlined text-xs">arrow_forward</span>
              </router-link>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { categories, tools as allTools } from '@/data/tools.js'
import { colorMap } from '@/data/colorMap.js'

// 颜色列表，用于给分类分配颜色
const colorKeys = Object.keys(colorMap)

// 获取分类的工具列表
const getCategoryTools = (categoryTitle) => {
  return allTools.filter(tool => tool.category.includes(categoryTitle))
}

// 排除 'all' 分类
const realCategories = categories.filter(c => c.id !== 'all')

// 按工具数量排序，取前4个
const topCategories = computed(() => {
  return realCategories
    .map(cat => ({
      category: cat,
      tools: getCategoryTools(cat.title),
      count: getCategoryTools(cat.title).length
    }))
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)
    .map((item, index) => ({
      ...item,
      colorClass: colorMap[colorKeys[index % colorKeys.length]],
      tools: item.tools.slice(0, 3)
    }))
})
</script>

<style scoped>
@reference "../../../style.css";

.category-card {
  @apply bg-surface-container-lowest
  dark:bg-surface-container
  p-8
  rounded-xl
  shadow-sm
  dark:shadow-none
  hover:shadow-[0_12px_32px_-4px_rgba(11,28,48,0.08)]
  dark:hover:shadow-none
  border
  border-transparent
  dark:border-outline-variant
  dark:hover:border-primary/50
  transition-all
  duration-300
  dark:card-glow;
}

.icon-box {
  @apply w-12
  h-12
  rounded-lg
  flex
  items-center
  justify-center
  mb-6
  group-hover:scale-110
  transition-transform;
}

.nav-link {
  @apply text-on-surface-variant
  hover:text-primary
  flex
  items-center
  gap-2
  text-sm
  font-medium
  transition-colors;
}
</style>
