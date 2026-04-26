<script setup>
import {Star} from "lucide-vue-next"

defineProps({
  menus: {
    type: Array,
    default: () => []
  },
  activeCategory: {
    type: String,
    default: 'all'
  },
  favoriteCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['select', 'showFavorites'])

const selectMenu = (id) => {
  emit('select', id)
}

const showFavorites = () => {
  emit('showFavorites')
}
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
        <button
            class="w-full py-2 rounded-lg text-xs font-medium
                 bg-primary text-white hover:opacity-90 transition"
            @click="showFavorites">
          查看收藏 ({{ favoriteCount }})
        </button>
      </div>
    </div>

    <nav class="flex-1 px-3 space-y-1">
      <a v-for="m in menus"
         :key="m.id"
         href="#"
         :class="[
           'flex items-center justify-between px-4 py-3 rounded-xl transition cursor-pointer',
           activeCategory === m.id
             ? 'bg-primary/10 text-primary font-semibold'
             : 'text-on-surface-variant hover:bg-surface-container-low'
         ]"
         @click.prevent="selectMenu(m.id)">

        <div class="flex items-center gap-3">
          <component :is="m.icon" v-bind="{name: m.iconName}" class="w-5 h-5"/>
          <span class="text-sm">{{ m.title }}</span>
        </div>

        <span class="text-xs opacity-60">{{ m.count }}</span>
      </a>
    </nav>

  </aside>
</template>
