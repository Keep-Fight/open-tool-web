<template>
  <component
      :is="iconComponent"
      v-if="iconComponent"
      class="fill-current inline-block shadow-none"
      :class="className"
  />
</template>

<script setup>
import { defineAsyncComponent, shallowRef, watchEffect } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  className: { type: String, default: 'w-6 h-6' }
})

const iconComponent = shallowRef(null)

// 动态监听 name 的变化并加载对应的文件
watchEffect(() => {
  try {
    iconComponent.value = defineAsyncComponent(() =>
        import(`@/assets/icons/${props.name}.svg?component`)
    )
  } catch (e) {
    console.error(`图标 ${props.name} 加载失败`, e)
  }
})
</script>
