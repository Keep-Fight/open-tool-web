<template>
  <div class="max-w-7xl mx-auto px-6 py-12 transition-colors duration-200">
    <div class="text-center mb-16">
      <h1
          class="text-4xl font-black mb-4 transition-colors dark:text-white text-gray-900"
      >
        发现免费、好用的在线工具
      </h1>
      <input
          v-model="search"
          type="text"
          placeholder="搜索工具..."
          class="w-full max-w-md px-6 py-3 rounded-full border outline-none transition-all shadow-sm
          dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-400 border-gray-200 focus:ring-blue-500"
      >
    </div>

    <div v-for="category in filteredCategories" :key="category.id" class="mb-12">
      <h2 class="text-xl font-bold  mb-6 flex items-center dark:text-white text-gray-900">
        <span class="w-2 h-6 mr-3 rounded-full" :class="[colorMap[category.color].bg]"></span>
        {{ category.name }}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ToolCard
            class="h-full"
            v-for="(tool,index) in category.tools"
            :key="tool.id"
            :id="tool.id"
            :title="tool.title"
            :description="tool.description"
            :icon-name="tool.iconName"
            :color="colorNameList[index]"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import {toolsJson} from '../data/tools.js'
import ToolCard from '../components/ToolCard.vue'
import {colorMap} from "../data/colorMap.js";

// 颜色名列表
const colorNameList = computed(() => Object.keys(colorMap))

// 搜索功能
const search = ref('')

// 过滤工具卡片
const filteredCategories = computed(() => {
  if (!search.value) return toolsJson
  const keyword = search.value.toLowerCase()
  return toolsJson.map(category => ({
    ...category,
    tools: category.tools.filter(tool =>
        tool.title.toLowerCase().includes(keyword) ||
        tool.description.toLowerCase().includes(keyword)
    )
  })).filter(category => category.tools.length > 0)
})
</script>
