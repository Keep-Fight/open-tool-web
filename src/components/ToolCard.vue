<template>
  <router-link
      :to="{ name: 'tool-detail', params: { id: id } }"
      class="group block rounded-xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1
      dark:bg-slate-800 dark:border-slate-700 hover:border-primary-400/30  bg-white border-gray-200 hover:border-primary/30"
  >
    <div class="flex items-center mb-4">
      <div
          class="h-12 w-12 rounded-lg flex items-center justify-center"
          :class="[ colorMap[color].base, colorMap[color].hover]"
      >
        <SvgIcon :name="iconName" className="w-7 h-7"/>
      </div>
      <h3
          class="ml-4 text-lg font-semibold"
          :class="[colorMap[color].titleHover]"
      >
        {{ title }}
      </h3>
    </div>
    <p class="text-sm line-clamp-2 dark:text-gray-400 text-gray-500">
      {{ description }}
    </p>
  </router-link>
</template>

<script setup>
import {colorMap} from "../data/colorMap.js";
import SvgIcon from "./SvgIcon.vue";

defineProps(['id', 'title', 'description', 'iconName', 'color'])
</script>
