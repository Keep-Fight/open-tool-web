<template>
  <div class="max-w-7xl mx-auto px-6 py-10">
    <router-link to="/" class="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-8 transition-colors">
      <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" stroke-width="2"/></svg>
      返回首页
    </router-link>

    <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <component :is="activeTool" v-if="activeTool" />
      <div v-else class="text-center py-20 text-gray-400">工具开发中...</div>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {toolsComponent} from "../data/tools.js";

const props = defineProps(['id'])

const activeTool = computed(() => {
  return toolsComponent[props.id] || null
})
</script>
