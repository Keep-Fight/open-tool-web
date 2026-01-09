<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    <ToolHeader />
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <ToolFooter />
  </div>
</template>

<script setup>
import ToolHeader from './components/ToolHeader.vue'
import ToolFooter from './components/ToolFooter.vue'
</script>

<style>
.page-enter-active, .page-leave-active { transition: opacity 0.2s ease; }
.page-enter-from, .page-leave-to { opacity: 0; }
</style>
