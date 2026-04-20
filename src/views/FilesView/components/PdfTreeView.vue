<template>
  <div class="pdf-tree-container h-full flex flex-col bg-white dark:bg-[#0a0a0b]">
    <!-- 标题 -->
    <div class="px-4 py-3 border-b border-slate-200/60 dark:border-[#27272a]">
      <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100">
        PDF 文件库
      </h2>
    </div>

    <!-- 文件树内容 -->
    <div class="flex-1 overflow-y-auto scrollbar-custom">
      <div v-if="loading" class="flex items-center justify-center py-8">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="error" class="px-4 py-8 text-center text-red-500">
        {{ error }}
      </div>

      <div v-else-if="treeData.length === 0" class="px-4 py-8 text-center text-slate-400">
        暂无 PDF 文件
      </div>

      <div v-else class="py-2">
        <div
            v-for="category in treeData"
            :key="category.title"
            class="mb-2"
        >
          <div
              class="flex items-center px-4 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-[#1a1a1b] transition-colors"
              @click="toggleCategory(category.title)"
              :title="category.displayName || category.title"
          >
            <ChevronRight
                class="w-4 h-4 text-slate-400 transition-transform duration-200 mr-2 shrink-0"
                :class="{ 'rotate-90': expandedCategories.has(category.title) }"
            />
            <Folder
                class="w-5 h-5 mr-2 shrink-0"
                :class="expandedCategories.has(category.title) ? 'text-yellow-500' : 'text-slate-400'"
            />
            <span class="text-sm font-medium text-slate-700 dark:text-slate-200 truncate flex-1">
              {{ category.displayName || category.title }}
            </span>
            <span class="ml-2 text-xs text-slate-400 shrink-0">
              {{ category.children?.length || 0 }}
            </span>
          </div>

          <div
              v-show="expandedCategories.has(category.title)"
              class="ml-6 mt-1 space-y-0.5"
          >
            <div
                v-for="file in category.children"
                :key="file.path"
                class="flex items-center px-3 py-1.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-[#1a1a1b] rounded transition-colors"
                @click="handleFileClick(file)"
                :title="file.displayName || file.title"
            >
              <FileText class="w-4 h-4 mr-2 text-red-500 shrink-0" />
              <span class="text-sm text-slate-600 dark:text-slate-300 truncate flex-1">
                {{ file.displayName || file.title }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Folder, FileText, ChevronRight } from 'lucide-vue-next'
import pdfApi from '@/api/pdfApi'

const emit = defineEmits(['file-select'])

const treeData = ref([])
const loading = ref(true)
const error = ref('')
const expandedCategories = ref(new Set())

// 加载 PDF 树数据
const loadTree = async () => {
  loading.value = true
  error.value = ''
  try {
    treeData.value = await pdfApi.getTree()
    // 默认展开所有目录
    treeData.value.forEach(cat => {
      expandedCategories.value.add(cat.title)
    })
  } catch (err) {
    error.value = '加载失败，请重试'
  } finally {
    loading.value = false
  }
}

// 切换目录展开/折叠
const toggleCategory = (categoryName) => {
  if (expandedCategories.value.has(categoryName)) {
    expandedCategories.value.delete(categoryName)
  } else {
    expandedCategories.value.add(categoryName)
  }
  // 创建新 Set 以触发响应式更新
  expandedCategories.value = new Set(expandedCategories.value)
}

// 处理文件点击
const handleFileClick = (file) => {
  emit('file-select', file)
}

onMounted(() => {
  loadTree()
})
</script>

<style scoped>
.scrollbar-custom {
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.5) transparent;
}

.scrollbar-custom::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  background-color: rgba(148, 163, 184, 0.5);
  border-radius: 3px;
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background-color: rgba(148, 163, 184, 0.7);
}
</style>