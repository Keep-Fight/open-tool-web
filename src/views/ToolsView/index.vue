<script setup>
import ToolSidebar from "./components/ToolSidebar.vue"
import ToolCard from "./components/ToolCard.vue"

import { Braces, ChevronsRight, SquareM } from "lucide-vue-next"

const tools = [
  {
    title:'JSON 格式化和校验',
    desc:'格式化、验证和美化 JSON 数据，支持语法校验和错误提示。',
    icon:Braces,
    color:'bg-green-50 text-green-500',
    tags:['开发工具','格式化']
  },
  {
    title:'文本对比工具',
    desc:'对比两个文本内容的差异。',
    icon:'div',
    color:'bg-blue-50 text-blue-500',
    tags:['文本工具','对比']
  },
  {
    title:'字符串进制转换',
    desc:'实现不同字符编码转换。',
    icon:ChevronsRight,
    color:'bg-purple-50 text-purple-500',
    tags:['转换工具','编码']
  },
  {
    title:'Markdown 编辑器',
    desc:'实时编辑 Markdown。',
    icon:SquareM,
    color:'bg-orange-50 text-orange-500',
    tags:['文本工具','编辑器']
  }
]
</script>

<template>
  <div class="min-h-screen p-6 bg-[var(--color-background)]">
    <div class="max-w-[1400px] mx-auto flex gap-8">

      <ToolSidebar/>

      <main class="flex-1">

        <!-- 顶部 -->
        <div class="flex items-center gap-4 mb-8">

          <!-- 搜索 -->
          <input
              placeholder="搜索工具..."
              class="flex-1 px-4 py-3 rounded-2xl shadow-sm
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

        <!-- 工具卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ToolCard v-for="t in tools" :key="t.title" v-bind="t"/>
        </div>

      </main>
    </div>
  </div>
</template>