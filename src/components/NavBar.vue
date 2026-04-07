<template>
  <header class="fixed top-0 z-50 w-full bg-surface/80 dark:bg-background/80 backdrop-blur-md shadow-[0_12px_32px_-4px_rgba(11,28,48,0.08)] dark:shadow-none dark:border-b dark:border-outline-variant transition-all duration-300">
    <div class="max-w-7xl mx-auto px-8 flex justify-between items-center h-16">
      <div class="flex items-center gap-8">
        <a class="text-xl font-bold text-primary font-headline tracking-tight" href="#">Open Toolbox</a>
        <nav class="hidden md:flex gap-6 items-center">
          <a class="text-primary font-semibold border-b-2 border-primary pb-1 font-headline transition-all duration-200" href="#">Tools</a>
          <a class="text-on-surface-variant font-medium hover:text-primary dark:hover:text-on-surface font-headline transition-all duration-200" href="#">Categories</a>
          <a class="text-on-surface-variant font-medium hover:text-primary dark:hover:text-on-surface font-headline transition-all duration-200" href="#">GitHub</a>
        </nav>
      </div>
      <div class="flex items-center gap-4">
        <button @click="$emit('toggle-theme')" class="p-2 text-on-surface-variant hover:text-primary dark:hover:text-on-surface rounded-full hover:bg-surface-container-low transition-all">
          <span class="material-symbols-outlined">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
        </button>
        <button class="hidden md:block px-4 py-2 text-on-surface-variant font-medium hover:bg-surface-container-low dark:hover:bg-surface-container rounded-lg transition-all active:scale-[0.98]">Sign In</button>
        <button class="px-5 py-2 bg-primary text-white font-semibold rounded-lg shadow-lg dark:shadow-none hover:bg-blue-700 dark:hover:brightness-110 transition-all active:scale-[0.98]">Get Started</button>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  isDark: Boolean
})
defineEmits(['toggle-theme'])
</script>
