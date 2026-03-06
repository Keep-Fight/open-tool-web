<!-- src/layouts/Layout.vue -->
<template>
  <div class="app-layout">
    <ToolHeader/>
    <main class="main-content">
      <router-view/>
    </main>
    <ToolFooter/>
  </div>
</template>

<script setup>
import ToolFooter from "./ToolFooter.vue";
import ToolHeader from "./ToolHeader.vue";
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>
