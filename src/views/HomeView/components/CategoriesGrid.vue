<template>
  <section class="py-24 px-8 bg-surface-container-low dark:bg-surface">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-12">
        <h2 class="text-3xl font-bold font-headline text-on-surface">
          开放工具
        </h2>
        <div class="h-px grow mx-8 bg-outline-variant/20 dark:bg-outline-variant hidden md:block"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        <div
          v-for="category in categoriesWithLimit"
          :key="category.category"
          class="category-card group"
        >
          <div :class="['icon-box', category.colorClass]">
            <span class="material-symbols-outlined text-3xl">{{ category.icon }}</span>
          </div>
          <h3 class="text-xl font-bold font-headline mb-4">{{ category.category }}</h3>
          <ul class="space-y-3">
            <li v-for="tool in category.tools" :key="tool.id">
              <router-link class="nav-link" :to="`/tools/${tool.id}`">
                {{ tool.title }}
                <span class="material-symbols-outlined text-xs">arrow_forward</span>
              </router-link>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { toolsJson } from '@/data/tools.js'

const colorMap = {
  'dev-tools': 'text-dev bg-dev/10',
  'text-image': 'text-design bg-design/10'
}

const iconMap = {
  'dev-tools': 'code',
  'text-image': 'palette'
}

const categoriesWithLimit = computed(() => {
  return toolsJson.map(cat => ({
    ...cat,
    icon: iconMap[cat.icon] || 'tools',
    colorClass: colorMap[cat.icon] || 'text-primary bg-primary/10',
    tools: cat.tools.slice(0, 3)
  }))
})
</script>

<style scoped>
@reference "../../../style.css";

.category-card {
  @apply bg-surface-container-lowest
  dark:bg-surface-container
  p-8
  rounded-xl
  shadow-sm
  dark:shadow-none
  hover:shadow-[0_12px_32px_-4px_rgba(11,28,48,0.08)]
  dark:hover:shadow-none
  border
  border-transparent
  dark:border-outline-variant
  dark:hover:border-primary/50
  transition-all
  duration-300
  dark:card-glow;
}

.icon-box {
  @apply w-12
  h-12
  rounded-lg
  flex
  items-center
  justify-center
  mb-6
  group-hover:scale-110
  transition-transform;
}

.nav-link {
  @apply text-on-surface-variant
  hover:text-primary
  flex
  items-center
  gap-2
  text-sm
  font-medium
  transition-colors;
}
</style>