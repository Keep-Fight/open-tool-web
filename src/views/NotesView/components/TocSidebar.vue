<script setup>
import {ref, onMounted, onUnmounted, watch, nextTick} from 'vue'
import SvgIcon from '@/components/public/SvgIcon.vue'

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
// activeId 改变时同步
const isClickScrolling = ref(false)
let lockTimer = null


// 切换折叠
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

// 点击跳转
const scrollToHeading = (id) => {
  const element = document.getElementById(id)
  if (element) {
    // 开启锁定
    isClickScrolling.value = true
    activeId.value = id

    element.scrollIntoView({ behavior: 'smooth', block: 'start' })

    // 释放锁定的处理：
    // 因为平滑滚动没有结束回调，通常使用定时器或者监听滚动结束
    if (lockTimer) clearTimeout(lockTimer)
    lockTimer = setTimeout(() => {
      isClickScrolling.value = false
    }, 800) // 时间略长于平滑滚动的持续时间
  }
}

// 滚动同步 (IntersectionObserver)
let observer = null

const initObserver = () => {
  if (observer) observer.disconnect()

  observer = new IntersectionObserver((entries) => {
    // 核心：如果是点击产生的滚动，不接受观察器的更新
    if (isClickScrolling.value) return

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeId.value = entry.target.id
      }
    })
  }, { rootMargin: '0px 0px -80% 0px', threshold: 0 })

  props.tocList.forEach(item => {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  })
}

// 监听内容滚动同步
watch(() => props.activeId, (newId) => {
  if (isClickScrolling.value) return
  if (newId && newId !== activeId.value) {
    activeId.value = newId
    // 只有在展开状态下才需要重新初始化或同步
    if (!isCollapsed.value) {
      nextTick(initObserver)
    }
  }
})

// 监听数据变化重新初始化
watch(() => props.tocList, () => {
  nextTick(initObserver)
}, {deep: true})

onMounted(() => {
  initObserver()
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

// 拖拽逻辑
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
      class="relative hidden xl:flex flex-col h-screen sticky top-0 transition-[width,border] duration-300 z-40"
      :class="[
        isCollapsed ? 'border-transparent' : 'border-l border-slate-200/60 dark:border-[#27272a]',
        isResizing ? 'transition-none' : ''
      ]"
      :style="{
        width: isCollapsed ? '0px' : sidebarWidth + 'px',
        backgroundColor: isCollapsed ? 'transparent' : ''
      }"
  >
    <div
        ref="tocContainer"
        class="flex flex-col h-full bg-[#f8f9ff] dark:bg-[#121214] transition-opacity duration-300 custom-scrollbar"
        :class="[
          isCollapsed ? 'opacity-0 pointer-events-none overflow-hidden' : 'opacity-100 overflow-y-auto overflow-x-hidden'
        ]"
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

    <div v-if="!isCollapsed"
         @mousedown="startResizing"
         class="absolute top-0 -left-1 w-2 h-full cursor-col-resize z-50 hover:bg-primary/20 transition-colors"
         :class="{ 'bg-primary/40': isResizing }"></div>

    <button @click="toggleCollapse"
            class="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-12 bg-white dark:bg-[#1c1c1f] border border-slate-200 dark:border-[#27272a] rounded-full flex items-center justify-center shadow-md z-[60] hover:text-primary transition-all active:scale-95">
      <SvgIcon name="chevron-left" className="w-[18px] h-[18px] transition-transform duration-300"
            :class="isCollapsed ? 'rotate-180' : 'rotate-0'" />
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
</style>