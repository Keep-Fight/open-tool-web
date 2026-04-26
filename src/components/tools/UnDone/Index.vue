<script setup>
import { Construction } from 'lucide-vue-next'

defineProps({
  toolName: {
    type: String,
    default: '工具'
  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
    <div class="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center mb-6">
      <Construction class="w-10 h-10 text-on-surface-variant" />
    </div>
    <h2 class="text-xl font-bold text-on-surface mb-2">{{ toolName }}</h2>
    <p class="text-on-surface-variant max-w-md">
      该工具正在开发中，敬请期待...
    </p>
  </div>
</template>
