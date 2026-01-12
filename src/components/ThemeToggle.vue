<template>
  <button
      @click="toggleTheme"
      class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="切换主题"
  >
    <svg
        class="h-5 w-5 text-gray-700 dark:text-gray-200"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
      <path
          v-if="isDark"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
      <path
          v-else
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  </button>
</template>

<script setup>
import {ref, watch, onMounted} from 'vue'

// 初始化暗黑模式状态（优先从本地存储读取）
const isDark = ref(
    localStorage.getItem('theme') === 'dark' ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme'))
)

// 初始化主题样式
const initTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// 切换主题
const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  initTheme()
}

// 监听主题变化
watch(isDark, () => {
  initTheme()
})

// 组件挂载时初始化
onMounted(() => {
  initTheme()
  // 监听系统主题变化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      isDark.value = e.matches
    }
  })
})
</script>
