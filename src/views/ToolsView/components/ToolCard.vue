<script setup>
import {Star} from "lucide-vue-next"
import {colorMap} from "@/data/colorMap"

defineProps({
  title: String,
  desc: String,
  icon: [Object, String],
  iconName: String,
  color: String,
  tags: Array
})
</script>

<template>
  <div
      class="group p-6 rounded-3xl border transition-all duration-300 relative h-full flex flex-col
             bg-surface-container-lowest border-outline-variant/10 hover:-translate-y-1 card-glow">

    <button class="absolute top-5 right-5 text-outline hover:text-yellow-400 transition z-10">
      <Star class="w-5 h-5"/>
    </button>

    <div :class="[
      'w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shrink-0',
      colorMap[color] || colorMap.blue
    ]">
      <component
          :is="icon"
          class="w-8 h-8"
          v-bind="{name: iconName}"
      />
    </div>

    <h3 class="text-lg font-bold mb-2 text-on-surface shrink-0">
      {{ title }}
    </h3>

    <p class="text-sm leading-relaxed mb-6 text-on-surface-variant flex-1">
      {{ desc }}
    </p>

    <div class="flex gap-2 flex-wrap shrink-0">
      <span v-for="tag in tags"
            :key="tag"
            class="px-2.5 py-1 rounded-md text-[11px] font-medium bg-surface-container-low text-on-surface-variant">
        {{ tag }}
      </span>
    </div>

  </div>
</template>