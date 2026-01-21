<template>
  <div class="flex h-screen bg-white">
    <aside class="w-72 h-full border-r border-gray-100 flex flex-col shrink-0 overflow-y-auto bg-[#f9fafb]">
      <div class="p-8 pb-4">
        <h1 class="text-xl font-bold text-slate-800 tracking-tight">Java Notes</h1>
      </div>

      <nav class="flex-1 px-4 py-4">
        <MdFileTree
            :nodes="treeData"
            :selectedPath="currentPath"
            @select="handleFileSelect"
        />
      </nav>
    </aside>

    <main class="flex-1 overflow-y-auto scroll-smooth bg-white" id="write-container">
      <div v-if="loading" class="h-full flex items-center justify-center text-emerald-500">
        <span class="animate-pulse">Loading...</span>
      </div>

      <div v-else class="max-w-7xl mx-auto px-6 py-12 lg:px-16">
        <header v-if="currentPath" class="mb-10 border-b border-gray-100 pb-6">
          <h1 class="text-4xl font-extrabold text-slate-900 tracking-tight">
            {{ currentFileName }}
          </h1>
        </header>

        <article
            class="markdown-body prose prose-slate prose-emerald max-w-none"
            v-html="renderedHtml"
        ></article>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { renderMarkdown } from '../utils/markdown-utils.js';
import MdFileTree from "../components/MdFileTree.vue";

const treeData = ref([]);
const currentPath = ref('');
const renderedHtml = ref('');
const loading = ref(false);

const handleFileSelect = async (path) => {
  currentPath.value = path;
  loading.value = true;
  try {
    const res = await fetch(`/api/md/file?path=${encodeURIComponent(path)}`);
    const json = await res.json();
    // 使用我们配置的增强解析器
    renderedHtml.value = await renderMarkdown(json.data);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  const res = await fetch('/api/md/tree');
  const json = await res.json();
  treeData.value = json.data;
});
</script>
