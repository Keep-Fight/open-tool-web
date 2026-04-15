<script setup>
import { ref, onMounted, defineEmits, onUnmounted } from 'vue'
import mdApi from '../../../api/mdApi'
import NotesSidebarItem from './NotesSidebarItem.vue'

const menuGroups = ref([])
const emit = defineEmits(['path-change'])

const formatTreeToMenu = (tree) => {
  return tree.map(node => {
    if (node.directory) {
      return {
        title: node.name,
        icon: node.icon || 'folder_open',
        isOpen: false,
        path: node.path,
        directory: true,
        children: formatTreeToMenu(node.children)
      }
    } else {
      return {
        title: node.name,
        icon: node.icon || 'description',
        isOpen: false,
        active: false,
        directory: false,
        path: node.path
      }
    }
  })
}

const loadTree = async () => {
  try {
    const treeData = await mdApi.getTree()
    menuGroups.value = formatTreeToMenu(treeData)
  } catch (e) {
    console.error("Failed to load tree", e)
  }
}

onMounted(() => loadTree())

// 状态管理
const sidebarWidth = ref(288)
const isCollapsed = ref(false)
const isResizing = ref(false)
const minWidth = 200
const maxWidth = 480

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const startResizing = (e) => {
  isResizing.value = true
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', stopResizing)
  document.body.style.cursor = 'col-resize'
}

const handleMouseMove = (e) => {
  if (!isResizing.value) return
  const newWidth = e.clientX
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
      class="relative hidden lg:flex flex-col h-screen sticky top-0 border-r border-slate-200/60 dark:border-[#27272a] bg-[#f8f9ff] dark:bg-[#121214] transition-[width] duration-300 ease-in-out z-40"
      :style="{ width: isCollapsed ? '0px' : sidebarWidth + 'px' }"
  >
    <div :class="['flex flex-col h-full overflow-hidden transition-opacity duration-300', isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100']"
         :style="{ width: sidebarWidth + 'px' }">

      <div class="py-8 px-4 flex-grow overflow-y-auto">
        <div class="flex items-center mb-8 px-3">
          <h3 class="font-headline uppercase tracking-widest text-[10px] font-black text-slate-400 dark:text-zinc-500">
            文件目录
          </h3>
        </div>

        <nav class="flex flex-col">
          <NotesSidebarItem v-for="item in menuGroups" :key="item.title" :item="item" />
        </nav>
      </div>
    </div>

    <div
        @mousedown="startResizing"
        class="absolute top-0 -right-1 w-2 h-full cursor-col-resize z-50 hover:bg-primary/20 transition-colors"
        :class="{ 'bg-primary/40': isResizing }"
    ></div>

    <button
        @click="toggleCollapse"
        class="absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-12 bg-white dark:bg-[#1c1c1f] border border-slate-200 dark:border-[#27272a] rounded-full flex items-center justify-center shadow-sm z-[60] hover:text-primary transition-all group"
        title="Toggle Sidebar"
    >
      <span class="material-symbols-outlined text-[18px] transition-transform duration-300"
            :class="isCollapsed ? 'rotate-180' : 'rotate-0'">
        chevron_left
      </span>
    </button>
  </aside>
</template>

<style scoped>
aside {
  user-select: none;
  /* 允许按钮溢出容器显示 */
  overflow: visible !important;
}

/* 即使宽度为0，也要保证按钮所在位置可点击 */
aside:empty {
  min-width: 0;
}

.material-symbols-outlined {
  font-variation-settings: 'wght' 300;
}
</style>