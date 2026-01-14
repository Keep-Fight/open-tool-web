<template>
  <header class="sticky top-0 z-50 border-b transition-colors duration-200 dark:bg-slate-800 dark:border-slate-700 bg-white border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center font-bold text-xl">
        <SvgIcon name="logo" class="h-8 w-8"/>
        <span class=" ml-2 from-[var(--open-gradient-from)] to-[var(--open-gradient-to)]   text-transparent  bg-clip-text   bg-gradient-to-r">
          开放工具箱
        </span>
      </div>
      <div class="flex items-center space-x-4">
        <ThemeToggle/>
        <a
            href="#"
            class="text-sm font-medium transition-colors dark:text-gray-300 dark:hover:text-white text-gray-500 hover:text-gray-900"
        >
          学习文档
        </a>
      </div>
    </div>
  </header>
</template>

<script setup>
import ThemeToggle from '../components/ThemeToggle.vue'
import SvgIcon from "../components/SvgIcon.vue";
</script>
