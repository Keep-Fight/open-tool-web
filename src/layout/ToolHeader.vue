<template>
  <header
      class="sticky top-0 z-50 border-b transition-colors duration-200"
      :class="isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center font-bold text-xl">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600 dark:text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 00-1 1v1a2 2 0 11-4 0v-1a1 1 0 00-1-1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
        <!-- 动态绑定文字颜色 -->
        <span :class="isDark ? 'text-white' : 'text-gray-900'">开放工具</span>
      </div>
      <div class="flex items-center space-x-4">
        <ThemeToggle />
        <a
            href="#"
            class="text-sm font-medium transition-colors"
            :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-900'"
        >
          关于
        </a>
      </div>
    </div>
  </header>
</template>

<script setup>
import { inject } from 'vue'
import ThemeToggle from '../components/ThemeToggle.vue'

// 注入暗黑模式状态
const isDark = inject('isDark')
</script>
