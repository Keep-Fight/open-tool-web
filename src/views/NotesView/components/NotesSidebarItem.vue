<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  depth: {
    type: Number,
    default: 0
  }
})

// 点击切换展开状态
const toggleOpen = () => {
  if (props.item.children) {
    props.item.isOpen = !props.item.isOpen
  }
}
</script>

<template>
  <div class="w-full">
    <component
        :is="item.children ? 'button' : 'a'"
        :href="item.children ? undefined : '#'"
        @click="toggleOpen"
        :class="[
        'w-full flex items-center px-2 py-1.5 transition-all rounded-r-lg border-l-2 mb-0.5',
        // 字体区分：一级 sm，子级则更小一点
        depth === 0 ? 'text-sm font-bold' : 'text-[13px] font-medium',
        // 状态颜色
        item.active
          ? 'bg-primary/10 text-primary border-primary'
          : 'text-[#424656] dark:text-[#a1a1aa] border-transparent hover:text-primary dark:hover:text-[#f1f1f1] hover:bg-slate-200/50 dark:hover:bg-[#1c1c1f]'
      ]"
    >

      <span class="material-symbols-outlined text-[18px] flex-shrink-0 mr-2"
            :class="depth === 0 ? 'text-primary' : 'opacity-60'">
        {{ item.icon }}
      </span>

      <span class="grow text-left truncate">{{ item.title }}</span>

      <div class="w-4 flex-shrink-0 flex items-center justify-start">
        <span v-if="item.children"
              class="material-symbols-outlined text-[16px] transition-transform opacity-40"
              :class="item.isOpen ? 'rotate-0' : '-rotate-90'">
          keyboard_arrow_down
        </span>
      </div>
    </component>

    <div v-if="item.children && item.isOpen"
         class="ml-2.5 border-l border-slate-200/60 dark:border-[#27272a] pl-1">
      <NotesSidebarItem
          v-for="child in item.children"
          :key="child.title"
          :item="child"
          :depth="depth + 1"
      />
    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  /* 调整图标渲染精细度 */
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20;
}
</style>