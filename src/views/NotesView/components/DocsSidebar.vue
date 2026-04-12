<script setup>
import { ref } from 'vue'

const menuGroups = ref([
  {
    title: '入门指南',
    icon: 'info',
    isOpen: true,
    items: [
      { name: '核心概念', icon: 'description', active: true },
      { name: '架构概览', icon: 'description', active: false }
    ]
  },
  {
    title: '快速开始',
    icon: 'rocket_launch',
    isOpen: true,
    items: [
      { name: '安装教程', icon: 'install_desktop', active: false },
      { name: '基础配置', icon: 'settings_suggest', active: false }
    ]
  },
  {
    title: '核心架构',
    icon: 'folder',
    isOpen: false,
    items: [
      { name: '系统设计', icon: 'account_tree', active: false },
      { name: '文件系统', icon: 'folder_open', active: false }
    ]
  }
])
</script>

<template>
  <!-- 修改 top-16 为 top-0，h-[calc(100vh-4rem)] 为 h-[100vh] -->
  <aside class="hidden lg:flex flex-col h-[100vh] w-72 sticky top-0 py-8 overflow-y-auto px-4 border-r border-slate-200/60 dark:border-[#27272a] bg-[#f8f9ff] dark:bg-[#121214]">
    <div class="mb-8">
      <h3 class="px-3 font-headline uppercase tracking-widest text-[10px] font-black text-slate-400 dark:text-zinc-500 mb-6">
        Documentation
      </h3>

      <nav class="space-y-4">
        <div v-for="group in menuGroups" :key="group.title" class="space-y-1">
          <button @click="group.isOpen = !group.isOpen"
                  class="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold font-headline rounded-lg transition-colors text-[#0b1c30] dark:text-[#f1f1f1] hover:bg-slate-200/50 dark:hover:bg-[#1c1c1f]">
            <span class="material-symbols-outlined text-lg transition-transform" :class="group.isOpen ? 'rotate-0' : '-rotate-90'">
              keyboard_arrow_down
            </span>
            <span class="material-symbols-outlined text-lg text-primary">{{ group.icon }}</span>
            <span class="grow text-left">{{ group.title }}</span>
          </button>

          <div v-show="group.isOpen" class="pl-6 space-y-1 border-l ml-5 border-slate-200 dark:border-[#27272a]">
            <a v-for="item in group.items" :key="item.name" href="#"
               :class="[
                 'flex items-center gap-3 px-3 py-2 text-sm font-medium transition-all rounded-r-lg border-l-2',
                 item.active
                   ? 'bg-primary/10 text-primary border-primary'
                   : 'text-[#424656] dark:text-[#a1a1aa] border-transparent hover:text-primary dark:hover:text-[#f1f1f1] hover:bg-slate-100 dark:hover:bg-[#1c1c1f]'
               ]">
              <span class="material-symbols-outlined text-lg opacity-60">{{ item.icon }}</span>
              {{ item.name }}
            </a>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>