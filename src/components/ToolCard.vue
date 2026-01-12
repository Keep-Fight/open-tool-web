<template>
  <!-- 移除 group 类，改用普通 hover，避免层级冲突 -->
  <router-link
      :to="{ name: 'tool-detail', params: { id: id } }"
      class="group block rounded-xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1"
      :class="[ isDark? 'bg-slate-800 border-slate-700 hover:border-primary-400/30' : 'bg-white border-gray-200 hover:border-primary/30'
  ]"
  >
    <div class="flex items-center mb-4">
      <div
          class="h-12 w-12 rounded-lg flex items-center justify-center"
          :class="[
          isDark
            ? [colorMap[color].darkBase, colorMap[color].darkHover]
            : [colorMap[color].base, colorMap[color].hover]
        ]"
      >
        <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath"/>
        </svg>
      </div>
      <!-- 标题：严格区分亮/暗模式，避免样式残留 -->
      <h3
          class="ml-4 text-lg font-semibold"
          :class="[colorMap[color].titleHover]"
      >
        {{ title }}
      </h3>
    </div>
    <!-- 文本描述 -->
    <p
        class="text-sm line-clamp-2"
        :class="isDark ? 'text-gray-400' : 'text-gray-500'"
    >
      {{ description }}
    </p>
  </router-link>
</template>

<script setup>
import {inject} from 'vue'
import {colorMap} from "../data/colorMap.js";

// 接收 props
const props = defineProps({
  id: {type: String, required: true},
  title: {type: String, required: true},
  description: {type: String, required: true},
  iconPath: {type: String, required: true},
  color: {type: String, required: true, default: 'primary'}
})

// 注入暗黑模式状态
const isDark = inject('isDark')
</script>
