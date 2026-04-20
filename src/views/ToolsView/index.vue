<script setup>
import {toolsJson} from '@/data/tools.js'
import SvgIcon from "@/components/public/SvgIcon.vue";

</script>

<template>
  <section class="py-16 px-8 transition-colors duration-300 bg-[#f8f9ff] dark:bg-[#121214] min-h-screen">
    <div class="max-w-7xl mx-auto">

      <div v-for="item in toolsJson" :key="item.category" class="mb-16 last:mb-0">

        <div class="flex items-center gap-4 mb-8">
          <h2 class="text-sm font-black font-headline uppercase tracking-[0.2em] text-[#0066ff] whitespace-nowrap">
            {{ item.category }}
          </h2>
          <div class="h-px w-full bg-slate-200 dark:bg-[#27272a]"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link
              v-for="tool in item.tools"
              :key="tool.id"
              :to="`/tools/${tool.id}`"
              class="group flex items-start gap-5 p-6 rounded-xl border transition-all duration-300 cursor-pointer min-h-27.5
                   /* 白天模式 */
                   bg-white border-slate-200/60 shadow-sm
                   hover:-translate-y-1 hover:border-[#0066ff]/40 hover:shadow-[0_10px_30px_-10px_rgba(0,102,255,0.15)]
                   /* 黑夜模式 */
                   dark:bg-[#1c1c1f] dark:border-[#27272a] dark:hover:border-[#0066ff]/50 dark:hover:shadow-[0_0_20px_rgba(0,102,255,0.1)]"
          >
            <div class="w-12 h-12 shrink-0 rounded-lg flex items-center justify-center transition-colors
                        bg-[#0066ff]/10 text-[#0066ff] group-hover:bg-[#0066ff] group-hover:text-white">
              <!-- 使用 SvgIcon 组件，传递 iconName 作为 name 属性，自定义样式类 -->
              <SvgIcon
                  :name="tool.iconName"
                  class="w-6 h-6 group-hover:fill-white transition-colors"
              />
            </div>


            <div class="grow">
              <h3 class="text-base font-bold font-headline mb-1 text-[#0b1c30] dark:text-[#f1f1f1] group-hover:text-[#0066ff] transition-colors">
                {{ tool.title }}
              </h3>
              <p class="text-xs leading-relaxed font-body text-[#424656] dark:text-[#a1a1aa] line-clamp-2">
                {{ tool.description }}
              </p>
            </div>

            <div class="self-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="material-symbols-outlined text-sm text-[#0066ff]">chevron_right</span>
            </div>
          </router-link>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.font-headline {
  font-family: 'Manrope', sans-serif;
}

.font-body {
  font-family: 'Inter', sans-serif;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
