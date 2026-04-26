<script setup>
import {
  LayoutGrid, Code2, Type, CheckSquare, Repeat, Palette, Star
} from "lucide-vue-next"

const menus = [
  { name:'全部工具', icon:LayoutGrid, count:32, active:true },
  { name:'开发工具', icon:Code2, count:12 },
  { name:'文本工具', icon:Type, count:8 },
  { name:'格式化工具', icon:CheckSquare, count:6 },
  { name:'转换工具', icon:Repeat, count:4 },
  { name:'设计工具', icon:Palette, count:6 },
]
</script>

<template>
  <aside class="w-64 h-full shrink-0 border-r border-outline-variant bg-surface flex flex-col">

    <div class="p-6">
      <h3 class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
        工具箱分类
      </h3>
    </div>

    <div class="p-4 border-t border-outline-variant/50">
      <div class="rounded-2xl p-4 bg-surface-container-low">
        <div class="flex items-center gap-2 mb-2">
          <Star class="w-4 h-4 text-yellow-500 fill-yellow-500"/>
          <p class="text-sm font-semibold text-on-surface">收藏夹</p>
        </div>
        <button class="w-full py-2 rounded-lg text-xs font-medium
                       bg-primary text-white hover:opacity-90 transition">
          查看收藏 (6)
        </button>
      </div>
    </div>

    <nav class="flex-1 px-3 space-y-1">
      <a v-for="m in menus"
         :key="m.name"
         href="#"
         :class="[
           'flex items-center justify-between px-4 py-3 rounded-xl transition',
           m.active
             ? 'bg-primary/10 text-primary font-semibold'
             : 'text-on-surface-variant hover:bg-surface-container-low'
         ]">

        <div class="flex items-center gap-3">
          <component :is="m.icon" class="w-5 h-5"/>
          <span class="text-sm">{{ m.name }}</span>
        </div>

        <span class="text-xs opacity-60">{{ m.count }}</span>
      </a>
    </nav>



  </aside>
</template>