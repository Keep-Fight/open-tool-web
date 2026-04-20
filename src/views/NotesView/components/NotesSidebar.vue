<script setup>
import {ref, onMounted, defineEmits, onUnmounted, computed, provide} from 'vue'
import mdApi from '@/api/mdApi.js'
import NotesSidebarItem from './NotesSidebarItem.vue'

const menuGroups = ref([])
const searchQuery = ref('')

const activePath = ref('')
const emit = defineEmits(['path-change'])


// 处理点击选择逻辑
const handleSelect = (path) => {
  activePath.value = path
  // 向 index.vue 发送事件
  emit('path-change', path)
}

// 将 activePath 和选择函数提供给所有子组件
provide('activePath', activePath)
provide('selectPath', handleSelect)


// 格式化文件目录
const formatTreeToMenu = (tree) => {
  return tree.map(node => {
    if (node.directory) {
      node.icon = node.icon || 'folder'
    } else {
      node.icon = node.icon || 'description'
    }

    if(node.active) {
      // 默认选中第一个
      handleSelect(node.path)
    }

    // 递归处理子节点（99% 你需要这个！）
    if (node.children && node.children.length) {
      node.children = formatTreeToMenu(node.children)
    }
    return node;
  })
}

// 加载目录
const loadTree = async () => {
  try {
    const treeData = await mdApi.getTree()
    menuGroups.value = formatTreeToMenu(treeData)
  } catch (e) {
    console.error("Failed to load tree", e)
  }
}

// 搜索过滤逻辑 (递归搜索)
const filteredMenuGroups = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return menuGroups.value

  const filterNodes = (nodes) => {
    return nodes.reduce((acc, node) => {
      const matchTitle = node.title.toLowerCase().includes(query)
      let filteredChildren = []

      if (node.children) {
        filteredChildren = filterNodes(node.children)
      }

      // 如果当前节点匹配，或者它的子节点有匹配的，就保留这个节点
      if (matchTitle || filteredChildren.length > 0) {
        acc.push({
          ...node,
          // 搜索时自动展开匹配到的目录
          isOpen: query ? true : node.isOpen,
          children: node.children ? filteredChildren : undefined
        })
      }
      return acc
    }, [])
  }

  return filterNodes(menuGroups.value)
})


// 状态管理，处理目录折叠
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


onMounted(() => loadTree())
onUnmounted(() => stopResizing())
</script>

<template>
  <aside
      class="relative hidden lg:flex flex-col h-screen sticky top-0 border-r border-slate-200/60 dark:border-[#27272a] bg-[#f8f9ff] dark:bg-[#121214] transition-[width] duration-300 ease-in-out z-40"
      :style="{ width: isCollapsed ? '0px' : sidebarWidth + 'px' }"
  >
    <div
        :class="['flex flex-col h-full overflow-hidden transition-opacity duration-300', isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100']"
        :style="{ width: sidebarWidth + 'px' }">

      <div class="py-8 px-4 flex-grow overflow-y-auto">
        <div class="flex items-center mb-6 px-3">
          <h3 class="font-headline uppercase tracking-widest text-[10px] font-black text-slate-400 dark:text-zinc-500">
            文件目录
          </h3>
        </div>

        <div class="px-3 mb-6">
          <div class="relative group">
            <span
                class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400 group-focus-within:text-primary transition-colors">
              search
            </span>
            <input
                v-model="searchQuery"
                type="text"
                placeholder="快速搜索..."
                class="w-full bg-slate-200/50 dark:bg-[#1c1c1f] text-[13px] border border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-[#27272a] py-2 pl-9 pr-4 rounded-xl transition-all outline-none text-[#424656] dark:text-[#f1f1f1] placeholder:text-slate-400 dark:placeholder:text-zinc-600"
            />
          </div>
        </div>

        <nav class="flex flex-col">
          <NotesSidebarItem
              v-for="item in filteredMenuGroups"
              :key="item.path + item.title"
              :item="item"
          />
          <div v-if="filteredMenuGroups.length === 0" class="text-center py-10">
            <p class="text-xs text-slate-400">未发现相关文件</p>
          </div>
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
        class="absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-12 bg-white dark:bg-[#1c1c1f] border border-slate-200 dark:border-[#27272a] rounded-full flex items-center justify-center shadow-md z-[60] hover:text-primary transition-all group"
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
  overflow: visible !important;
}

/* 隐藏滚动条但保留滚动功能（可选） */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 10px;
}

aside:hover .overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
}

.dark aside:hover .overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
}

.material-symbols-outlined {
  font-variation-settings: 'wght' 300;
}
</style>