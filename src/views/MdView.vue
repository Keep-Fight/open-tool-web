<template>
  <div class="flex h-screen bg-white">
    <!-- 左侧文件目录 -->
    <aside class="w-72 h-full border-r border-gray-100 flex flex-col shrink-0 overflow-y-auto bg-[#f9fafb]">
      <div class="p-8 pb-4">
        <h1 class="text-xl font-bold text-slate-800 tracking-tight">文件目录</h1>
      </div>
      <nav class="flex-1 px-4 py-4">
        <MdFileTree
            :nodes="treeData"
            :selectedPath="currentPath"
            @select="handleFileSelect"
        />
      </nav>
    </aside>

    <!-- 中间 Markdown 内容区 -->
    <main
        class="flex-1 overflow-y-auto scroll-smooth bg-white relative"
        id="write-container"
        ref="mdContentRef"
        @scroll="handleContentScroll"
    >
      <div v-if="loading" class="h-full flex items-center justify-center text-emerald-500">
        <span class="animate-pulse">Loading...</span>
      </div>
      <div v-else class="max-w-7xl mx-auto px-6 py-12 lg:px-16">
        <article
            class="markdown-body prose prose-slate prose-emerald max-w-none"
            v-html="renderedHtml"
        ></article>
      </div>
    </main>

    <!-- 右侧内容目录 -->
    <aside
        class="w-64 h-full border-l border-gray-100 shrink-0 overflow-y-auto bg-[#f9fafb] px-4 py-8"
        v-if="tocList.length"
    >
      <h2 class="text-lg font-semibold text-slate-800 mb-4">内容目录</h2>
      <ul class="space-y-1">
        <li
            v-for="item in tocList"
            :key="item.id"
            :class="{
            'text-emerald-600 font-medium': activeTocId === item.id,
            'text-slate-600 hover:text-emerald-500 cursor-pointer': true
          }"
            :style="{ 'padding-left': `${(item.level - 1) * 12}px` }"
            @click="scrollToAnchor(item.id)"
        >
          {{ item.text }}
        </li>
      </ul>
    </aside>
  </div>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue';
import {renderMarkdown} from '../utils/markdown-utils.js';
import MdFileTree from "../components/MdFileTree.vue";
import slugify from 'slugify';

const treeData = ref([]);
const currentPath = ref('');
const renderedHtml = ref('');
const loading = ref(false);
const mdContentRef = ref(null); // 内容区DOM引用
const tocList = ref([]); // 解析出的标题目录
const activeTocId = ref(''); // 当前激活的目录项


/**
 * 清理标题中的Markdown语法（优先移除加粗，可扩展其他语法）
 * @param {string} text - 原始标题文本
 * @returns {string} 清理后的纯文本
 */
const cleanMarkdownSyntax = (text) => {
  return text
      .replace(/\*\*([^*]+)\*\*/g, '$1') // 移除加粗标记 **内容** → 内容
      .replace(/\*([^*]+)\*/g, '$1')     // 可选：移除斜体标记 *内容* → 内容
      .replace(/\_([^_]+)\_/g, '$1')     // 可选：移除下划线斜体 _内容_ → 内容
      .replace(/\`([^`]+)\`/g, '$1')
      .trim();
};

// 解析Markdown标题生成目录
const parseTocFromMd = (mdContent) => {
  if (!mdContent) {
    tocList.value.length = 0;
    return;
  }

  // 重置目录
  tocList.value.length = 0;

  // 正则匹配并移除所有代码块（```xxx``` 或 `xxx`）
  const mdWithoutCodeBlocks = mdContent
      // 移除多行代码块（```开头，```结尾，支持跨行）
      .replace(/```[\s\S]*?```/g, '');

  // 匹配非代码块内的Markdown标题（h1-h6）
  const headingRegex = /^(#{1,6})\s+(.*?)$/gm;

  let match;
  let index = 0;
  while ((match = headingRegex.exec(mdWithoutCodeBlocks)) !== null) {
    const level = match[1].length; // 标题层级（1-6）
    const rawText = match[2].trim(); // 原始标题文本（含加粗等标记）

    // 核心：清理Markdown加粗标记
    const cleanText = cleanMarkdownSyntax(rawText);

    // 生成唯一锚点ID（兼容特殊字符）
    const slug = encodeURI(cleanText);
    const anchorId = `md-toc-${slug}-${level}`;

    // 存入目录列表
    tocList.value.push({
      id: anchorId,
      text: cleanText,
      level
    });
  }

  console.log("tocList", tocList.value)

  // 替换渲染后的HTML标题，添加锚点ID（同步清理标记）
  renderedHtml.value = renderedHtml.value.replace(
      /<h([1-6])(\s+[^>]*)?>(.*?)<\/h\1>/g,
      (match, level, attrs, text) => {
        // 先清理标题内的HTML标签，再清理Markdown加粗标记
        let cleanText = text.replace(/<[^>]*>/g, '').trim();
        cleanText = cleanMarkdownSyntax(cleanText);

        const slug = encodeURI(cleanText);
        const anchorId = `md-toc-${slug}-${level}`;
        return `<h${level} id="${anchorId}"${attrs || ''}>${text}</h${level}>`;
      }
  );
};

// 文件选择逻辑（新增解析目录）
const handleFileSelect = async (path) => {
  currentPath.value = path;
  loading.value = true;
  try {
    const res = await fetch(`/api/md/file?path=${encodeURIComponent(path)}`);
    const json = await res.json();
    // 渲染Markdown
     renderMarkdown(json.data).then(html => {
       renderedHtml.value = html;
       parseTocFromMd(json.data);
     });
  } catch (e) {
    renderedHtml.value = '加载失败:' + e.message;
    parseTocFromMd([]);
  }
  finally {
    loading.value = false;
  }
};

// 点击目录跳转到对应锚点
const scrollToAnchor = (anchorId) => {
  const target = document.getElementById(anchorId);
  console.log("anchorId",anchorId)
  console.log("mdContentRef",mdContentRef.value)
  console.log("target",target)

  if (target && mdContentRef.value) {
    // 滚动到目标位置（偏移20px避免顶部遮挡）
    mdContentRef.value.scrollTop = target.offsetTop - 20;


    // 高亮当前目录
    activeTocId.value = anchorId;
  }
};

// 滚动内容时自动高亮目录
const handleContentScroll = () => {
  if (!mdContentRef.value || !tocList.value.length) return;

  const scrollTop = mdContentRef.value.scrollTop;
  let currentActiveId = '';

  // 遍历所有标题，找到当前视口内的标题
  tocList.value.forEach((item) => {
    const target = document.getElementById(item.id);
    if (!target) return;
    // 标题顶部距离内容区顶部的距离
    const offsetTop = target.offsetTop;
    // 判定条件：标题进入视口（偏移30px容错）
    if (offsetTop - 30 <= scrollTop) {
      currentActiveId = item.id;
    }
  });

  // 更新激活状态（避免频繁更新）
  if (currentActiveId && currentActiveId !== activeTocId.value) {
    activeTocId.value = currentActiveId;
  }
};

// 获取当前文件名（优化体验）
const currentFileName = ref('');
watch(currentPath, () => {
  if (currentPath.value) {
    // 从路径中提取文件名（如 "docs/guide.md" → "guide.md"）
    currentFileName.value = currentPath.value.split('/').pop() || '';
  }
}, {immediate: true});

// 初始化文件树
onMounted(async () => {
  const res = await fetch('/api/md/tree');
  const json = await res.json();
  treeData.value = json.data;
});
</script>

<style scoped>
/* 右侧目录滚动优化 */
aside:last-child {
  scrollbar-width: thin;
}

aside:last-child::-webkit-scrollbar {
  width: 4px;
}

aside:last-child::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 2px;
}

/* 目录项 hover/active 样式增强 */
li.cursor-pointer {
  transition: color 0.2s ease;
  font-size: 14px;
  padding: 2px 0;
}
</style>
