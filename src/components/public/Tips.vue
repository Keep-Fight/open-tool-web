<script setup>
import { defineProps } from 'vue'
import {Info} from  'lucide-vue-next'
const props = defineProps({
  text: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="bg-primary/5 p-2 px-5 flex rounded-xl items-center gap-4 text-xs text-blue-500">
    <Info class="w-5 h-5"/>
    <p>
      <span class="font-bold mr-2">提示:</span>
      {{text}}
    </p>
  </div>
</template>

