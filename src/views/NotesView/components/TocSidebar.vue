<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps({
  tocList: {
    type: Array,
    default: () => []
  },
  activeId: {
    type: String,
    default: ''
  }
})

const activeId = ref('')
const tocContainer = ref(null) // 用于 TOC 自身滚动的容器引用

// 折叠状态管理
const sidebarWidth = ref(260)
const isCollapsed = ref(false)
const isResizing = ref(false)
const minWidth = 160
const maxWidth = 450

const toggleCollapse = () => isCollapsed.value = !isCollapsed.value

// 点击跳转
const scrollToHeading = (id) => {
  const element = document.getElementById(id)
  if (element) {
    activeId.value = id
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 滚动同步 (IntersectionObserver)
let observer = null

const initObserver = () => {
  if (observer) observer.disconnect()

  // 这里的 rootMargin 设置为 '-100px 0px -70% 0px'
  // 表示当元素到达距离顶部 100px 附近时触发选中，更符合阅读习惯
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeId.value = entry.target.id
      }
    })
  }, { rootMargin: '0px 0px -80% 0px', threshold: 0 })

  // 观察所有在 TOC 中出现的 ID 对应的 DOM 元素
  props.tocList.forEach(item => {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  })
}

// 侧边栏自动跟随
watch(activeId, (newId) => {
  nextTick(() => {
    const activeEl = tocContainer.value?.querySelector(`[data-id="${CSS.escape(newId)}"]`)
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  })
})

// 监听内容滚动同步
watch(() => props.activeId, (newId) => {
  activeId.value = newId
  initObserver()
})

// 监听数据变化重新初始化
watch(() => props.tocList, () => {
  nextTick(initObserver)
}, { deep: true })

onMounted(() => {
  initObserver()
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

// --- 原有拖拽逻辑 (保持不变) ---
const startResizing = () => {
  isResizing.value = true
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', stopResizing)
}
const handleMouseMove = (e) => {
  if (!isResizing.value) return
  const newWidth = window.innerWidth - e.clientX
  if (newWidth >= minWidth && newWidth <= maxWidth) sidebarWidth.value = newWidth
}
const stopResizing = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', stopResizing)
}
</script>

<template>
  <aside
      class="relative hidden xl:flex flex-col h-screen sticky top-0 border-l border-slate-200/60 dark:border-[#27272a] bg-[#f8f9ff] dark:bg-[#121214] transition-[width] duration-300 z-40"
      :style="{ width: isCollapsed ? '0px' : sidebarWidth + 'px' }"
  >
    <div
        ref="tocContainer"
        :class="['flex flex-col h-full overflow-y-auto overflow-x-hidden transition-opacity duration-300 custom-scrollbar', isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100']"
        :style="{ width: sidebarWidth + 'px' }"
    >
      <div class="py-10 px-4">
        <h4 class="px-3 font-headline text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-6">
          此页内容目录
        </h4>

        <nav class="flex flex-col space-y-0.5">
          <button
              v-for="item in tocList"
              :key="item.id"
              :data-id="item.id"
              @click="scrollToHeading(item.id)"
              :style="{ paddingLeft: `${(item.level - 1) * 12 + 12}px` }"
              :class="[
              'group flex items-center py-1.5 pr-3 text-left transition-all rounded-lg border-l-2 text-[13px] leading-snug',
              activeId === item.id
                ? 'bg-primary/5 text-primary border-primary font-bold'
                : 'text-slate-500 dark:text-zinc-400 border-transparent hover:bg-slate-200/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-zinc-100'
            ]"
          >
            <span class="truncate">{{ item.text }}</span>
          </button>
        </nav>
      </div>
    </div>

    <div @mousedown="startResizing" class="absolute top-0 -left-1 w-2 h-full cursor-col-resize z-50 hover:bg-primary/20 transition-colors" :class="{ 'bg-primary/40': isResizing }"></div>

    <button @click="toggleCollapse" class="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-12 bg-white dark:bg-[#1c1c1f] border border-slate-200 dark:border-[#27272a] rounded-full flex items-center justify-center shadow-md z-[60] hover:text-primary transition-all">
      <span class="material-symbols-outlined text-[18px] transition-transform" :class="isCollapsed ? 'rotate-0' : 'rotate-180'">chevron_left</span>
    </button>
  </aside>
</template>

<style scoped>
@reference "../../../style.css";

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 10px;
}
aside:hover .custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-slate-200 dark:bg-zinc-800;
}
.material-symbols-outlined { font-variation-settings: 'wght' 300; }
</style>