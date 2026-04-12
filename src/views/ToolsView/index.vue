<script setup>
import { ref, computed } from 'vue'

// 模拟工具数据
const tools = ref([
  { title: 'JSON 格式化/校验', description: '美化混乱的 JSON 数据，验证其格式正确性。', iconName: 'code', category: '开发' },
  { title: 'Base64 编解码', description: '对文本或二进制数据进行 Base64 编解码转换。', iconName: 'sync_alt', category: '开发' },
  { title: '正则表达式测试', description: '实时编写并测试你的正则表达式。', iconName: 'terminal', category: '开发' },
  { title: 'SVG 优化器', description: '移除冗余代码，压缩并优化 SVG 矢量图形。', iconName: 'palette', category: '设计' },
  { title: '配色方案生成', description: '基于调色板算法生成专业的 UI 设计配色方案。', iconName: 'color_lens', category: '设计' },
  { title: 'Markdown 编辑器', description: '支持实时预览与 GitHub 风格渲染。', iconName: 'description', category: '生产力' },
  { title: '时间戳转换', description: 'Unix 时间戳与北京时间之间的快速互转工具。', iconName: 'schedule', category: '生产力' },
  { title: '图片压缩', description: '在保持视觉质量的前提下，大幅减小图片体积。', iconName: 'photo_camera', category: '多媒体' }
])

// 核心逻辑：按分类对数据进行分组
const groupedTools = computed(() => {
  const groups = {}
  tools.value.forEach(tool => {
    if (!groups[tool.category]) {
      groups[tool.category] = []
    }
    groups[tool.category].push(tool)
  })
  return groups
})
</script>

<template>
  <section class="py-16 px-8 transition-colors duration-300 bg-[#f8f9ff] dark:bg-[#121214] min-h-screen">
    <div class="max-w-7xl mx-auto">

      <div v-for="(items, category) in groupedTools" :key="category" class="mb-16 last:mb-0">

        <div class="flex items-center gap-4 mb-8">
          <h2 class="text-sm font-black font-headline uppercase tracking-[0.2em] text-[#0066ff] whitespace-nowrap">
            {{ category }}
          </h2>
          <div class="h-px w-full bg-slate-200 dark:bg-[#27272a]"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
              v-for="tool in items"
              :key="tool.title"
              class="group flex items-start gap-5 p-6 rounded-xl border transition-all duration-300 cursor-pointer min-h-27.5
                   /* 白天模式 */
                   bg-white border-slate-200/60 shadow-sm
                   hover:-translate-y-1 hover:border-[#0066ff]/40 hover:shadow-[0_10px_30px_-10px_rgba(0,102,255,0.15)]
                   /* 黑夜模式 */
                   dark:bg-[#1c1c1f] dark:border-[#27272a] dark:hover:border-[#0066ff]/50 dark:hover:shadow-[0_0_20px_rgba(0,102,255,0.1)]"
          >
            <div class="w-12 h-12 shrink-0 rounded-lg flex items-center justify-center transition-colors
                        bg-[#0066ff]/10 text-[#0066ff] group-hover:bg-[#0066ff] group-hover:text-white">
              <span class="material-symbols-outlined text-2xl">{{ tool.iconName }}</span>
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
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.font-headline { font-family: 'Manrope', sans-serif; }
.font-body { font-family: 'Inter', sans-serif; }
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>