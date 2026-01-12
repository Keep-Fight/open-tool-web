<template>
  <div
      class="min-h-screen flex flex-col transition-colors duration-200"
      :class="isDark ? 'bg-slate-900 text-gray-100' : 'bg-gray-50 text-gray-800'"
  >
    <ToolHeader />
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <ToolFooter />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, provide } from 'vue'
import ToolHeader from './layout/ToolHeader.vue'
import ToolFooter from './layout/ToolFooter.vue'

// 初始化暗黑模式状态（增加容错，避免 null 导致的判断错误）
const isDark = ref(false)

const initTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  // 明确赋值，避免模糊判断
  if (savedTheme === 'dark') {
    isDark.value = true
  } else if (savedTheme === 'light') {
    isDark.value = false
  } else {
    isDark.value = systemDark
  }

  // 强制更新根节点类名，避免残留
  const html = document.documentElement
  if (isDark.value) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
    // 额外移除所有可能的暗黑相关类名
    html.classList.remove('dark-mode', 'theme-dark')
  }
}

// 监听 isDark 变化，立即同步
watch(isDark, (newVal) => {
  localStorage.setItem('theme', newVal ? 'dark' : 'light')
  initTheme() // 重新执行，确保样式完全同步
}, { immediate: true })

// 组件挂载时初始化，监听系统主题变化
onMounted(() => {
  initTheme()
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const savedTheme = localStorage.getItem('theme')
    if (!savedTheme) { // 仅当用户未手动设置时跟随系统
      isDark.value = e.matches
    }
  })
})

// 提供给子组件
provide('isDark', isDark)
</script>

<style>
/* 重置过渡动画，避免样式卡顿 */
.page-enter-active, .page-leave-active {
  transition: opacity 0.2s ease;
}
.page-enter-from, .page-leave-to {
  opacity: 0;
}

/* 全局重置，避免样式残留 */
.dark * {
  --tw-shadow-color: rgba(0, 0, 0, 0.2);
}
.light * {
  --tw-shadow-color: rgba(0, 0, 0, 0.1);
}
</style>
