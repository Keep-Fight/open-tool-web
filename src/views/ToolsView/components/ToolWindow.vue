<script setup>
import { useRouter } from 'vue-router'

defineProps({
  title: {
    type: String,
    default: '工具名称'
  },
  description: {
    type: String,
    default: '工具描述'
  },
  icon: {
    type: String,
    default: 'construction'
  },
  iconBgClass: {
    type: String,
    default: 'bg-blue-50 dark:bg-primary/10'
  },
  iconTextClass: {
    type: String,
    default: 'text-blue-600 dark:text-primary'
  },
  tag: {
    type: String,
    default: '实用工具'
  },
  tagBgClass: {
    type: String,
    default: 'bg-blue-50 dark:bg-primary/15'
  },
  tagTextClass: {
    type: String,
    default: 'text-blue-600 dark:text-primary'
  },
  tagBorderClass: {
    type: String,
    default: 'border-blue-100 dark:border-primary/20'
  }
})

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="h-full flex flex-col bg-background transition-colors duration-300">
    <div class="shrink-0 flex items-center justify-between py-4 px-8">
      <div
          @click="goBack"
          class="inline-flex items-center text-sm font-medium transition-all py-2 px-3 -ml-3 rounded-lg
                 text-on-surface-variant hover:text-primary hover:bg-primary/5 cursor-pointer group"
      >
        <span class="material-symbols-outlined text-[20px] mr-1 group-hover:-translate-x-1 transition-transform">arrow_back</span>
        <span>返回工具箱</span>
      </div>
    </div>

    <div class="flex-1 overflow-auto px-6 pb-6 h-full">
      <div class="max-w-7xl mx-auto">
        <!-- 工具头部卡片 -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all">
          <div class="flex items-center gap-6">
            <div :class="[iconBgClass, 'w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border', iconBgClass.replace('bg-', 'border-').replace('/10', '/20')]">
              <span :class="[iconTextClass, 'text-3xl font-bold font-headline']">{{ icon }}</span>
            </div>

            <div class="space-y-2">
              <div class="flex items-center gap-3">
                <h1 class="text-2xl font-bold text-on-surface tracking-tight font-headline">{{ title }}</h1>
                <span :class="[tagBgClass, tagTextClass, tagBorderClass, 'px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider border']">
                  {{ tag }}
                </span>
              </div>
              <p class="text-on-surface-variant text-sm leading-relaxed max-w-xl">
                {{ description }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 w-full md:w-auto">
            <button class="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-surface-container-high border border-outline-variant text-on-surface font-semibold rounded-xl hover:bg-outline-variant transition-all active:scale-95 dark:bg-surface-container-high">
              <span class="material-symbols-outlined text-[20px]">star</span>
              收藏
            </button>
            <button class="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:brightness-110 shadow-lg shadow-primary/20 transition-all active:scale-95">
              <span class="material-symbols-outlined text-[20px]">share</span>
              分享
            </button>
          </div>
        </div>

        <!-- 工具内容区域 -->
        <div class="mt-6 bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm transition-all">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>