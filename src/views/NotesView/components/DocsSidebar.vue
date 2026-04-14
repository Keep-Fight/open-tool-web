<script setup>
import {ref, onMounted, defineEmits} from 'vue'
import mdApi from '../../../api/mdApi'
import SidebarItem from './SidebarItem.vue'

const menuGroups = ref([])
const emit = defineEmits(['path-change']) // 向父组件传递选中的文件路径

// 递归转换MdNode为侧边栏菜单结构
const formatTreeToMenu = (tree) => {
  return tree.map(node => {
    if (node.directory) {
      return {
        title: node.name,
        icon: node.icon || 'folder_open',
        isOpen: false,
        path: node.path,
        children: formatTreeToMenu(node.children)
      }
    } else {
      return {
        title: node.name,
        icon: node.icon || 'description',
        isOpen: false,
        active: false,
        path: node.path
      }
    }
  })
}

// 加载目录树
const loadTree = async () => {
  const treeData = await mdApi.getTree()
  menuGroups.value = formatTreeToMenu(treeData)
}

// 点击文件项，标记激活并通知父组件
const handleItemClick = (path) => {
  // 递归标记激活状态
  const markActive = (groups) => {
    groups.forEach(group => {
      group.items?.forEach(item => {
        item.active = item.path === path
        if (item.items) markActive([item])
      })
    })
  }
  markActive(menuGroups.value)
  emit('path-change', path) // 传递选中的路径
}

onMounted(() => loadTree())
</script>

<template>
  <aside
      class="hidden lg:flex flex-col h-[100vh] w-72 sticky top-0 py-8 overflow-y-auto px-4 border-r border-slate-200/60 dark:border-[#27272a] bg-[#f8f9ff] dark:bg-[#121214]">
    <div class="mb-8">
      <h3 class="px-3 font-headline uppercase tracking-widest text-[10px] font-black text-slate-400 dark:text-zinc-500 mb-6">
        Documentation
      </h3>

      <nav class="space-y-1">
        <SidebarItem v-for="item in menuGroups" :key="item.title" :item="item"/>
      </nav>
    </div>
  </aside>
</template>