<!-- src/layouts/Layout.vue -->
<template>
  <div class="min-h-screen flex flex-col" >
    <Header :is-dark="isDark" @toggle-theme="toggleTheme" />
    <main class="pt-16 flex-1">
      <router-view/>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import { useTheme } from '@/data/useTheme.js'
const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
</style>
