<template>
  <div class="min-h-screen">
    <NavBar :is-dark="isDark" @toggle-theme="toggleTheme" />
    <main class="pt-16">
      <HeroSection />
      <CategoriesGrid />
      <FeaturesSection />
    </main>
    <SiteFooter />
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import CategoriesGrid from './components/CategoriesGrid.vue'
import FeaturesSection from './components/FeaturesSection.vue'
import SiteFooter from './components/SiteFooter.vue'
import { useTheme } from './composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>
