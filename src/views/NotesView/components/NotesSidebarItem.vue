<script setup>
import {inject, computed} from 'vue' // 引入 inject
import SvgIcon from '@/components/public/SvgIcon.vue'

const props = defineProps({
  item: {type: Object, required: true},
  depth: {type: Number, default: 0}
})

// 注入父级提供的状态
const activePath = inject('activePath')
const selectPath = inject('selectPath')

// 判断当前项是否被选中
const isActive = computed(() => activePath.value === props.item.path)

const handleClick = () => {
  if (props.item.children) {
    // 如果是目录，切换展开/收起状态
    props.item.isOpen = !props.item.isOpen;
    // 根据展开状态更新文件夹图标
    if (props.item.icon === 'folder' || props.item.icon === 'folder-open') {
      props.item.icon = props.item.isOpen ? 'folder-open' : 'folder';
    }

  } else {
    // 如果是文件，执行选择逻辑
    selectPath(props.item.path);
  }
}
</script>

<template>
  <div class="w-full">
    <component
        :is="item.children ? 'button' : 'a'"
        @click="handleClick"
        :class="[
        'w-full flex items-center px-2 py-1.5 transition-all rounded-r-lg border-l-2 mb-0.5',
        depth === 0 ? 'text-sm font-bold' : 'text-[13px] font-medium',

        // 修改逻辑：使用 isActive 判断高亮
        isActive
          ? 'bg-primary/10 text-primary border-primary'
          : 'text-[#424656] dark:text-[#a1a1aa] border-transparent hover:text-primary dark:hover:text-[#f1f1f1] hover:bg-slate-200/50 dark:hover:bg-[#1c1c1f]'
      ]"
    >

      <SvgIcon v-show="item.icon==='folder-open'" name="folder-open" className="w-6 h-6 flex-shrink-0 mr-2"
            :class="(depth === 0 || item.isOpen || isActive ) ? 'text-primary' : 'opacity-60'" />
      <SvgIcon v-show="item.icon==='folder'" name="folder" className="w-6 h-6 flex-shrink-0 mr-2"
               :class="(depth === 0 || item.isOpen || isActive  ) ? 'text-primary' : 'opacity-60'" />
      <SvgIcon v-show="item.icon!=='folder'&& item.icon!=='folder-open'" :name="item.icon" className="w-6 h-6 flex-shrink-0 mr-2"
               :class="(depth === 0 || item.isOpen || isActive ) ? 'text-primary' : 'opacity-60'" />

      <span class="grow text-left truncate">{{ item.title }}</span>

      <div class="w-4 flex-shrink-0 flex items-center justify-start">
        <SvgIcon v-show="item.directory" name="keyboard-arrow-down" className="w-6 h-6 transition-transform opacity-40"
              :class="item.isOpen ? 'rotate-0' : '-rotate-90'" />
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