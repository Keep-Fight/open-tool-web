<template>
  <section class="py-24 px-8 bg-surface-container-low dark:bg-surface">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-12">
        <h2 class="text-3xl font-bold font-headline text-on-surface">
          Browse by Utility
        </h2>
        <div class="h-px flex-grow mx-8 bg-outline-variant/20 dark:bg-outline-variant hidden md:block"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        <!-- ✅ 关键：这里加 group -->
        <div class="category-card group">
          <div class="icon-box text-dev bg-dev/10">
            <span class="material-symbols-outlined text-3xl">code</span>
          </div>
          <h3 class="text-xl font-bold font-headline mb-4">Development</h3>
          <ul class="space-y-3">
            <li v-for="link in ['JSON Formatter', 'Base64 Encode/Decode', 'JWT Debugger']" :key="link">
              <a class="nav-link" href="#">
                {{ link }}
                <span class="material-symbols-outlined text-xs">arrow_forward</span>
              </a>
            </li>
          </ul>
        </div>

        <div class="category-card group">
          <div class="icon-box text-design bg-design/10">
            <span class="material-symbols-outlined text-3xl">palette</span>
          </div>
          <h3 class="text-xl font-bold font-headline mb-4">Design</h3>
          <ul class="space-y-3">
            <li v-for="link in ['SVG Optimizer', 'Color Palette Gen', 'Icon Generator']" :key="link">
              <a class="nav-link" href="#">
                {{ link }}
                <span class="material-symbols-outlined text-xs">arrow_forward</span>
              </a>
            </li>
          </ul>
        </div>

        <div class="category-card group">
          <div class="icon-box text-prod bg-prod/10">
            <span class="material-symbols-outlined text-3xl">clock_loader_40</span>
          </div>
          <h3 class="text-xl font-bold font-headline mb-4">Productivity</h3>
          <ul class="space-y-3">
            <li v-for="link in ['Markdown Editor', 'Focus Timer', 'Text Diff Tool']" :key="link">
              <a class="nav-link" href="#">
                {{ link }}
                <span class="material-symbols-outlined text-xs">arrow_forward</span>
              </a>
            </li>
          </ul>
        </div>

        <div class="category-card group">
          <div class="icon-box text-media bg-media/10">
            <span class="material-symbols-outlined text-3xl">photo_camera</span>
          </div>
          <h3 class="text-xl font-bold font-headline mb-4">Multimedia</h3>
          <ul class="space-y-3">
            <li v-for="link in ['Image Compressor', 'Video Converter', 'Audio Trimmer']" :key="link">
              <a class="nav-link" href="#">
                {{ link }}
                <span class="material-symbols-outlined text-xs">arrow_forward</span>
              </a>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </section>
</template>
<!--<style scoped>-->
<!--@reference "../style.css";-->

<!--.category-card {-->
<!--  @apply bg-surface-container-lowest-->
<!--  dark:bg-surface-container-->
<!--  p-8-->
<!--  rounded-xl-->
<!--  shadow-sm-->
<!--  dark:shadow-none-->
<!--  hover:shadow-[0_12px_32px_-4px_rgba(11,28,48,0.08)]-->
<!--  dark:hover:shadow-none-->
<!--  border-->
<!--  border-transparent-->
<!--  dark:border-outline-variant-->
<!--  dark:hover:border-primary/50-->
<!--  transition-all-->
<!--  duration-300-->
<!--  dark:card-glow;-->
<!--}-->

<!--.icon-box {-->
<!--  @apply w-12-->
<!--  h-12-->
<!--  rounded-lg-->
<!--  flex-->
<!--  items-center-->
<!--  justify-center-->
<!--  mb-6-->
<!--  group-hover:scale-110-->
<!--  transition-transform;-->
<!--}-->

<!--.nav-link {-->
<!--  @apply text-on-surface-variant-->
<!--  hover:text-primary-->
<!--  flex-->
<!--  items-center-->
<!--  gap-2-->
<!--  text-sm-->
<!--  font-medium-->
<!--  transition-colors;-->
<!--}-->
<!--</style>-->
