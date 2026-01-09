<template>
  <div class="max-w-7xl mx-auto px-6 py-12">
    <div class="text-center mb-16">
      <h1 class="text-4xl font-black text-gray-900 mb-4">开放工具箱</h1>
      <input v-model="search" type="text" placeholder="搜索工具..."
             class="w-full max-w-md px-6 py-3 rounded-full border focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm">
    </div>

    <div v-for="cat in filteredData" :key="cat.name" class="mb-12">
      <h2 class="text-xl font-bold mb-6 flex items-center">
        <span :class="['w-1.5 h-6 rounded-full mr-3',colorMap[cat.color].bg]"></span>
        {{ cat.name }}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ToolCard v-for="tool in cat.tools" :key="tool.id" v-bind="tool" :color="tool.themeColor" />
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import ToolCard from '../components/ToolCard.vue'
import {toolsJson,colorMap} from "../data/tools.js";

const search = ref('')
const data = toolsJson

const filteredData = computed(() => {
  return data.map(cat => ({
    ...cat,
    tools: cat.tools.filter(t => t.title.includes(search.value))
  })).filter(cat => cat.tools.length > 0)
})
</script>
