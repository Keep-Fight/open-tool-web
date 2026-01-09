<template>
  <router-link
      :to="{ name: 'tool-detail', params: { id: id } }"
      class="group block bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 hover:-translate-y-1"
  >
    <div class="flex items-center mb-4">
      <div
          :class="[
              'h-12 w-12 rounded-lg flex items-center justify-center transition-colors',
              colorMap[color].base,
              colorMap[color].hover
          ]">

        <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath"/>
        </svg>
      </div>
      <h3 :class="[
          'ml-4 text-lg font-semibold text-gray-900',
          colorMap[color].titleHover
          ]">{{
          title
        }}</h3>
    </div>
    <p class="text-gray-500 text-sm line-clamp-2">{{ description }}</p>
  </router-link>
</template>

<script setup>
import {colorMap} from "../data/tools.js";

defineProps(['id', 'title', 'description', 'iconPath', 'color'])
</script>
