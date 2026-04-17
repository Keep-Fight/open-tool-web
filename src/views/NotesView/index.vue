<template>
  <div class="h-screen flex flex-col bg-surface-container-low dark:bg-background transition-colors duration-300">
    <div class="flex-1 flex overflow-hidden">

      <NotesSidebar
          @path-change="handlePathChange"
          class="shrink-0 h-full border-r border-slate-200/60 dark:border-[#27272a]"
      />

      <div
          class="scrollbar-custom flex-1 overflow-y-auto bg-white dark:bg-[#0a0a0b]"
          @scroll="handleContentScroll"
          ref="mdContentRef"
      >
        <NotesContent :content="currentContent"/>
      </div>

      <TocSidebar
          :toc-list="currentTocList"
          :active-id="currentActiveId"
          class="shrink-0 h-full border-l border-slate-200/60 dark:border-[#27272a]"
      />
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import NotesSidebar from './components/NotesSidebar.vue'
import NotesContent from './components/NotesContent.vue'
import TocSidebar from './components/TocSidebar.vue'
import mdApi from '@/api/mdApi'
import {parseTocFromMd, renderMarkdown} from '@/utils/markdown-utils'

const currentContent = ref('') // 当前md文件内容
const currentTocList = ref([]) // 解析出的标题目录
const currentActiveId = ref('') // 当前激活的目录项
const mdContentRef = ref(null) // 内容区DOM引用

// 路径改变时重新加载内容
const handlePathChange = (path) => {
  console.log('当前选中的路径是:', path)
  try {
    mdApi.getContent(encodeURIComponent(path)).then(data => {
      currentContent.value = data
      currentTocList.value = parseTocFromMd(currentContent.value)
    })
  } catch (e) {
    currentContent.value = '## 加载失败\n无法获取该文件内容。'
  }
}

// 滚动内容时自动高亮目录
const handleContentScroll = () => {
  if (!mdContentRef.value || !currentTocList.value.length) return;

  const scrollTop = mdContentRef.value.scrollTop;
  let activeTocId = '';

  // 遍历所有标题，找到当前视口内的标题
  currentTocList.value.forEach((item) => {
    const target = document.getElementById(item.id);
    if (!target) return;
    // 标题顶部距离内容区顶部的距离
    const offsetTop = target.offsetTop;
    // 判定条件：标题进入视口（偏移30px容错）
    if (offsetTop - 30 <= scrollTop) {
      activeTocId = item.id;
    }
  });


  // 更新激活状态（避免频繁更新）
  if (activeTocId && activeTocId !== currentActiveId.value) {
    currentActiveId.value = activeTocId;
  }
};

</script>

<style scoped>
:deep(.scrollbar-custom::-webkit-scrollbar) {
  width: 0;
}

:deep(.scrollbar-custom) {
  /* 火狐 */
  scrollbar-width: none;
}
</style>