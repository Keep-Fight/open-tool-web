<script setup>
import { ref, onUnmounted } from 'vue'
import TocSidebarItem from './TocSidebarItem.vue'

// 模拟 4 层级数据
const tocData = ref([
  {
    title: '1. 核心指南', id: 'guide', active: false,
    children: [
      {
        title: '1.1 架构设计', id: 'arch', active: true,
        children: [
          {
            title: '1.1.1 渲染引擎', id: 'engine', active: false,
            children: [
              { title: '1.1.1.1 虚拟DOM优化', id: 'vdom', active: false }
            ]
          }
        ]
      }
    ]
  },
  { title: '2. 部署方案', id: 'deploy', active: false }
])

// 状态管理
const sidebarWidth = ref(240) // 初始宽度稍窄一点更精致
const isCollapsed = ref(false)
const isResizing = ref(false)
const minWidth = 160
const maxWidth = 450

const toggleCollapse = () => isCollapsed.value = !isCollapsed.value

const startResizing = () => {
  isResizing.value = true
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', stopResizing)
  document.body.style.cursor = 'col-resize'
}

const handleMouseMove = (e) => {
  if (!isResizing.value) return
  const newWidth = window.innerWidth - e.clientX
  if (newWidth >= minWidth && newWidth <= maxWidth) {
    sidebarWidth.value = newWidth
    isCollapsed.value = false
  }
}

const stopResizing = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', stopResizing)
  document.body.style.cursor = 'default'
}

onUnmounted(() => stopResizing())
</script>

<template>
  <aside
      class="relative hidden xl:flex flex-col h-screen sticky top-0 border-l border-slate-200/60 dark:border-[#27272a] bg-[#f8f9ff] dark:bg-[#121214] transition-[width] duration-300 z-40"
      :style="{ width: isCollapsed ? '0px' : sidebarWidth + 'px' }"
  >
    <div
        :class="['flex flex-col h-full overflow-hidden transition-opacity duration-300', isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100']"
        :style="{ width: sidebarWidth + 'px' }"
    >
      <div class="py-10 px-2 overflow-y-auto">
        <h4 class="px-3 font-headline text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-4">
          此页内容目录
        </h4>

        <nav class="flex flex-col">
          <TocSidebarItem v-for="item in tocData" :key="item.title" :item="item" />
        </nav>
      </div>
    </div>

    <div
        @mousedown="startResizing"
        class="absolute top-0 -left-1 w-2 h-full cursor-col-resize z-50 hover:bg-primary/20 transition-colors"
        :class="{ 'bg-primary/40': isResizing }"
    ></div>

    <button
        @click="toggleCollapse"
        class="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-12 bg-white dark:bg-[#1c1c1f] border border-slate-200 dark:border-[#27272a] rounded-full flex items-center justify-center shadow-md z-[60] hover:text-primary transition-all group"
    >
      <span class="material-symbols-outlined text-[18px] transition-transform"
            :class="isCollapsed ? 'rotate-0' : 'rotate-180'">
        chevron_left
      </span>
    </button>
  </aside>
</template>

<style scoped>
aside {
  user-select: none;
  overflow: visible !important;
}
/* 隐藏滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 0px;
}
.material-symbols-outlined {
  font-variation-settings: 'wght' 300;
}
</style>