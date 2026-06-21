<template>
  <HeroSection />
  <CategoriesGrid />
  <FeaturesSection />
</template>

<script setup>
import {onMounted} from "vue";
import FeaturesSection from "./components/FeaturesSection.vue";
import HeroSection from "./components/HeroSection.vue";
import CategoriesGrid from "./components/CategoriesGrid.vue";
import {warmupMarkdownHighlighter} from "@/utils/markdown-utils.js";

onMounted(() => {
  warmupMarkdownHighlighter().catch(console.error)
})
</script>
