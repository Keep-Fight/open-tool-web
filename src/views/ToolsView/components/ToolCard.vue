<script setup>
import { Star } from "lucide-vue-next"

defineProps({
  title: String,
  desc: String,
  icon: [Object, String],
  color: String,
  tags: Array
})
</script>

<template>
  <div
      class="group p-6 rounded-3xl border transition-all duration-300 relative bg-surface-container-lowest border-outline-variant/10 hover:-translate-y-1 card-glow">

    <!-- 收藏 -->
    <button class="absolute top-5 right-5 text-outline hover:text-yellow-400 transition">
      <Star class="w-5 h-5"/>
    </button>

    <!-- 图标 -->
    <div :class="`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`">
      <component :is="icon" class="w-8 h-8"/>
    </div>

    <!-- 标题 -->
    <h3 class="text-lg font-bold mb-2 text-on-surface">
      {{ title }}
    </h3>

    <!-- 描述 -->
    <p class="text-sm leading-relaxed mb-6 text-on-surface-variant">
      {{ desc }}
    </p>

    <!-- 标签 -->
    <div class="flex gap-2 flex-wrap">
      <span v-for="tag in tags"
            :key="tag"
            class="px-2.5 py-1 rounded-md text-[11px] font-medium bg-surface-container-low text-on-surface-variant">
        {{ tag }}
      </span>
    </div>

  </div>
</template>