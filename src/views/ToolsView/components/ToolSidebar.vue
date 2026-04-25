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
  <aside class="w-64 shrink-0">
    <div class="p-4 space-y-1 rounded-2xl border
                bg-[var(--color-surface)]
                border-[var(--color-outline-variant)]">

      <h3 class="px-4 py-2 text-xs font-semibold uppercase
                 text-[var(--color-on-surface-variant)]">
        分类
      </h3>

      <!-- 分类列表 -->
      <nav class="space-y-1">
        <a v-for="m in menus"
           :key="m.name"
           href="#"
           :class="[
             'flex items-center justify-between px-4 py-2.5 rounded-xl transition',
             m.active
               ? 'bg-[var(--color-surface-container)] text-[var(--color-primary)] font-medium'
               : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)]'
           ]">

          <div class="flex items-center gap-3">
            <component :is="m.icon" class="w-4 h-4"/>
            {{ m.name }}
          </div>

          <span class="text-xs opacity-70">{{ m.count }}</span>
        </a>
      </nav>

      <!-- 收藏卡片 -->
      <div class="pt-6 px-4">
        <div class="rounded-2xl p-4 text-center
                    bg-[var(--color-surface-container)]">

          <Star class="w-6 h-6 mx-auto mb-2 text-[var(--color-primary)]"/>

          <p class="text-sm font-semibold text-[var(--color-on-surface)]">
            收藏夹
          </p>

          <p class="text-xs mt-1 text-[var(--color-on-surface-variant)]">
            收藏您常用的工具
          </p>

          <button class="mt-3 w-full py-1.5 rounded-lg text-xs font-medium
                         bg-[var(--color-surface-container-lowest)]
                         border border-[var(--color-outline-variant)]
                         hover:scale-[1.02] transition">
            查看收藏 (6)
          </button>
        </div>
      </div>

    </div>
  </aside>
</template>