<template>
  <router-view v-slot="{ Component }">
    <transition name="page" mode="out-in">
      <component :is="Component"/>
    </transition>
  </router-view>
  <Toast />
</template>

<script setup>
import Toast from '@/components/Toast.vue';
</script>

<style>
/* 重置过渡动画，避免样式卡顿 */
.page-enter-active, .page-leave-active {
  transition: opacity 0.2s ease;
}

.page-enter-from, .page-leave-to {
  opacity: 0;
}
</style>
