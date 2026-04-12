<template>
  <header class="fixed top-0 z-50 w-full bg-surface/80 dark:bg-background/80 backdrop-blur-md shadow-[0_12px_32px_-4px_rgba(11,28,48,0.08)] dark:shadow-none dark:border-b dark:border-outline-variant transition-all duration-300">
    <div class="max-w-7xl mx-auto px-8 flex justify-between items-center h-16">
      <!-- 左侧跳转-->
      <div class="flex items-center gap-8">
        <router-link class="text-xl font-bold text-primary font-headline tracking-tight" to="/">OpenToolbox</router-link>
        <nav class="hidden md:flex gap-6 items-center">
          <router-link
              to="/tools"
              :class="navClasses('/tools')"
          >开放工具</router-link>

          <router-link
              to="/notes"
              :class="navClasses('/notes')"
          >学习笔记</router-link>

          <router-link
              to="/files"
              :class="navClasses('/files')"
          >学习文件</router-link>
        </nav>
      </div>

      <!-- 右侧内容-->
      <div class="flex items-center gap-4">
        <button @click="$emit('toggle-theme')" class="flex items-center justify-center p-2 text-on-surface-variant hover:text-primary dark:hover:text-on-surface rounded-full hover:bg-surface-container-low transition-all">
          <span class="material-symbols-outlined">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
        </button>
        <a href="https://github.com/Keep-Fight" target="_blank" class="hidden md:block px-4 py-2 text-on-surface-variant font-medium hover:bg-surface-container-low dark:hover:bg-surface-container rounded-lg transition-all active:scale-[0.98]">Github</a>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()

// 统一样式函数
const navClasses = (path) => [
  'font-headline transition-all duration-200',
  route.path.startsWith(path)
      ? 'text-primary font-semibold border-b-2 border-primary pb-1'
      : 'text-on-surface-variant font-medium hover:text-primary dark:hover:text-on-surface'
]

defineProps({ isDark: Boolean })
defineEmits(['toggle-theme'])
</script>