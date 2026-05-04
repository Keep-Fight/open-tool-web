<script setup>
import {ref, watch, onMounted, nextTick} from 'vue'
import {renderMarkdown} from "@/utils/markdown-utils.js";
import mediumZoom from 'medium-zoom'

const props = defineProps({
  content: {type: String, default: ''}
})

const renderedHtml = ref('<p>正在加载内容...</p>')
let zoomInstance = null

// 初始化图片缩放
const initZoom = () => {
  if (zoomInstance) zoomInstance.detach()
  // 只针对文章内的图片
  zoomInstance = mediumZoom('.prose img', {
    background: 'rgba(0,0,0,0.8)',
    margin: 24
  })
}

// 渲染Markdown
const renderContent = async () => {
  if (props.content) {
    renderedHtml.value = '<p>正在加载内容...</p>'
    renderedHtml.value = await renderMarkdown(props.content)
    await nextTick()
    initZoom()
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
  >
    <article
        class="mx-auto max-w-5xl px-6 py-12 prose prose-slate dark:prose-invert
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
}

/* 图片点击效果 */
.prose img {
  cursor: zoom-in;
  border-radius: 0.5rem;
}


/* 移除标题链接 */
.prose h1 a, .prose h2 a, .prose h3 a, .prose h4 a, .prose h5 a, .prose h6 a {
  text-decoration: none !important;
}

/* 列表项前添加图标 */
.prose ul li::marker {
  color: #3b82f6 !important; /* 你想要的颜色 */
}

/* 图片样式处理 */
.prose img {
  margin-left: auto !important;
  margin-right: auto !important;
  display: block !important;
  max-width: 90% !important; /* 防止图片撑满全屏，留边距更美观 */
  border-radius: 8px; /* 柔和圆角，和整体卡片风格统一 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); /* 轻微阴影质感 */
}


/* 加粗样式处理 */
.prose strong {
  font-weight: 600 !important;       /* 适度加粗，不黑粗 */
  font-size: inherit;
  color: #000000 !important;         /* 加深一点颜色，更醒目 */
  background: transparent !important; /* 无背景 */
  padding: 0 !important;             /* 无内边距 */
  border-radius: 0 !important;       /* 无圆角 */
}

/* 暗色模式适配（可选） */
.dark .prose strong {
  color: #f9fafb !important;
}


/* `` 单引号样式处理 */
.prose :not(pre) > code {
  &::before, &::after {
    content: none !important;
  }
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  background-color: #f3f4f6;
  color: #d97706;
  vertical-align: baseline;
  font-weight: bold;
}
.dark .prose :not(pre) > code {
  background-color: #1f2937;
  color: #fbbf24;
}

/**********************************[引用块样式]**********************************/
/* 引用块样式，去掉自动双引号、斜体 */
.prose blockquote {
  font-style: normal !important;       /* 取消斜体 */
  font-weight: normal !important; /* 取消加粗 */
  quotes: none !important;             /* 去掉自动双引号 */
  border-left: 3px solid  rgb(0, 102, 255) ; /* 保留左边竖线（可选） */
  margin: 0.5rem 0 !important; /* 缩小上下间距 */
  padding: 0.3rem 0.5rem;
  line-height: 1.4 !important; /* 缩小行间距 */
  background-color:  rgba(0, 102, 255,0.1);
}

.prose blockquote * {
  margin: 5px !important; /* 去掉内部段落大间距 */
  font-weight: normal !important;
  line-height: 1.4 !important;
  font-size: 15px;
}


/**********************************[代码块样式]**********************************/
/* 代码样式 黑夜模式 */
.dark .prose pre {
  background-color: #1c1c1f !important;
  position: relative;
  border: 1px solid #374151;
  border-radius: 12px;
  margin: 1.5rem 0 !important;
  padding: 1.25rem !important;
  color: #f9fafb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  overflow: hidden;
}

.dark .prose pre:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3), 0 10px 15px rgba(0, 0, 0, 0.4);
  border-color: #4b5563;
}

.dark .prose pre code {
  padding: 0 !important;
  background: transparent !important;
  font-size: 0.9rem;
  line-height: 1.6;
}


/* 代码样式 正常模式 */
.prose pre {
  position: relative;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin: 1.5rem 0 !important;
  padding: 1.25rem !important;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  overflow: hidden;
  font-weight: bolder;
}

.prose pre:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 15px rgba(0, 0, 0, 0.1);
  border-color: #d1d5db;
}

/* 让内部代码不顶边，更美观 */
.prose pre code {
  padding: 0 !important;
  background: transparent !important;
  font-size: 0.9rem;
  line-height: 1.6;
}

pre code span.line {
  counter-increment: linenumber;
}

pre code span.line::before {
  content: counter(linenumber);
  display: inline-block;
  width: 2em;
  margin-right: 2em;
  text-align: right;
  font-weight: bold;
}
</style>