<script setup>
import ToolSidebar from "./components/ToolSidebar.vue"
import ToolCard from "./components/ToolCard.vue"

import { Braces, ChevronsRight, SquareM } from "lucide-vue-next"

// TODO 获取数据
const tools = [
  {
    title:'JSON 格式化和校验',
    desc:'格式化、验证和美化 JSON 数据，支持语法校验和错误提示。',
    icon:Braces,
    color:'green',
    tags:['开发工具','格式化']
  },
  {
    title:'文本对比工具',
    desc:'对比两个文本内容的差异。',
    icon:'div',
    color:'blue',
    tags:['文本工具','对比']
  },
  {
    title:'字符串进制转换',
    desc:'实现不同字符编码转换。',
    icon:ChevronsRight,
    color:'purple',
    tags:['转换工具','编码']
  },
  {
    title:'Markdown 编辑器',
    desc:'实时编辑 Markdown。',
    icon:SquareM,
    color:'orange',
    tags:['文本工具','编辑器']
  }
]
</script>

<template>
  <div class="h-screen flex bg-[var(--color-background)] overflow-hidden">

    <ToolSidebar/>

    <main class="flex-1 p-8 overflow-y-auto">

      <div class="flex items-center gap-4 mb-8">
        <input
            placeholder="搜索工具..."
            class="flex-1 max-w-2xl px-4 py-3 rounded-2xl shadow-sm
                 bg-[var(--color-surface-container-lowest)]
                 border border-[var(--color-outline-variant)]
                 text-[var(--color-on-surface)]
                 placeholder:text-[var(--color-on-surface-variant)]
                 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div class="mb-6 text-sm text-[var(--color-on-surface-variant)]">
        共 {{ tools.length }} 个工具
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        <ToolCard v-for="t in tools" :key="t.title" v-bind="t"/>
      </div>

    </main>
  </div>
</template>