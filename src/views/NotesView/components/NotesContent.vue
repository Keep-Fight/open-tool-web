<script setup>
import {ref, watch, onMounted} from 'vue'
import {renderMarkdown} from "@/utils/markdown-utils.js";

const props = defineProps({
  content: {type: String, default: ''}
})

const renderedHtml = ref('<p>正在加载内容...</p>')
const mdContentRef = ref(null)

// 渲染Markdown
const renderContent = async () => {
  if (props.content) {
    renderedHtml.value = await renderMarkdown(props.content)
  } else if (!props.content) {
    renderedHtml.value = '<div class="flex flex-col items-center justify-center h-64 text-slate-400">请选择文件以查看内容</div>'
  }
}

// 监听内容变化重绘
watch(() => props.content, renderContent)

onMounted(() => {
  renderContent()
})
</script>

<template>
  <div
      class="h-full w-full bg-white dark:bg-[#0a0a0b] transition-colors duration-300"
      ref="mdContentRef"
  >
    <article
        class="mx-auto max-w-4xl px-6 py-12 prose prose-slate dark:prose-invert
             prose-headings:scroll-mt-20 prose-headings:font-bold
             prose-a:text-primary prose-pre:bg-transparent prose-pre:p-0"
        v-html="renderedHtml"
    >
    </article>
  </div>
</template>

<style>
/* 深度适配 Shiki 的多主题切换 */
.shiki {
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.1); /* slate-400/10 */
}

html.dark .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
}

/* 适配你已有的边框风格 */
.dark .prose pre {
  background-color: #1c1c1f !important;
  border: 1px solid #27272a;
}
</style>