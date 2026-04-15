<script setup>
const props = defineProps({
  item: { type: Object, required: true },
  depth: { type: Number, default: 0 }
})

// 根据深度动态计算缩进，每级增加 10px，让 4 级目录也不会太靠右
const getIndentStyle = (depth) => {
  return { paddingLeft: `${depth * 10 + 12}px` }
}
</script>

<template>
  <div class="w-full">
    <a
        :href="item.id ? `#${item.id}` : '#'"
        :class="[
        'group flex items-center py-2 pr-2 transition-all duration-200 rounded-md my-0.5 whitespace-nowrap overflow-hidden',
        // 激活状态：使用浅色背景块，不再使用竖线
        item.active
          ? 'bg-primary/10 text-primary font-bold'
          : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-200/50 dark:hover:bg-white/5 hover:text-primary',
        // 字体大小处理
        depth === 0 ? 'text-[14px]' : 'text-[13px]'
      ]"
        :style="getIndentStyle(depth)"
    >
      <span class="truncate">{{ item.title }}</span>
    </a>

    <template v-if="item.children && item.children.length">
      <TocSidebarItem
          v-for="child in item.children"
          :key="child.title"
          :item="child"
          :depth="depth + 1"
      />
    </template>
  </div>
</template>