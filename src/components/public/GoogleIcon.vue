<template>
  <span class="material-symbols-outlined fill-current inline-block shadow-none" :style="{fontSize: size}">{{props.name}}</span>
</template>

<script setup>
import 'material-symbols/outlined.css'
const props = defineProps({
  name: { type: String, required: true },
  size: { type: String, default: '2rem' }
})
</script>
