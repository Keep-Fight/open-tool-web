<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300 font-sans">

    <header class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
      <div class="flex items-center gap-4">
        <button class="flex items-center text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          返回工具箱
        </button>
        <div class="flex items-center gap-3 ml-4 border-l pl-4 border-slate-200 dark:border-slate-700">
          <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
          </div>
          <div>
            <h1 class="text-xl font-bold">Prompt 模板工具</h1>
            <p class="text-xs text-slate-500 dark:text-slate-400">管理、创建和使用 Prompt 模板，提升 AI 对话效率</p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button @click="toggleDarkMode" class="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700">
          <svg v-if="!isDark" class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
          <svg v-else class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        </button>
        <button class="px-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
          收藏
        </button>
        <button class="px-4 py-2 text-sm text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg flex items-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/50">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
          分享
        </button>
      </div>
    </header>

    <main class="max-w-[1600px] mx-auto p-6 grid grid-cols-12 gap-6 items-start">

      <aside class="col-span-12 md:col-span-3 lg:col-span-2 space-y-6">
        <div class="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-medium text-sm text-slate-500 dark:text-slate-400">模板分类</h3>
            <button class="text-blue-600 dark:text-blue-400 text-xs flex items-center hover:underline">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              新建分类
            </button>
          </div>
          <ul class="space-y-1">
            <li v-for="cat in categories" :key="cat.name">
              <button
                  @click="activeCategory = cat.name"
                  :class="['w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                         activeCategory === cat.name ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50']">
                <div class="flex items-center gap-3">
                  <span class="text-lg" v-html="cat.icon"></span>
                  <span>{{ cat.name }}</span>
                </div>
                <span class="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">{{ cat.count }}</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <section class="col-span-12 md:col-span-9 lg:col-span-6 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <h2 class="font-bold text-lg mb-6 border-b border-slate-100 dark:border-slate-700 pb-3">模板编辑</h2>

        <div class="space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-slate-600 dark:text-slate-400 mb-1">模板名称</label>
              <input v-model="formData.name" type="text" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm text-slate-600 dark:text-slate-400 mb-1">所属分类</label>
              <select v-model="formData.category" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                <option v-for="cat in categories.slice(1)" :key="cat.name" :value="cat.name">{{ cat.name }}</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm text-slate-600 dark:text-slate-400 mb-1">模板描述 (可选)</label>
            <input v-model="formData.description" type="text" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="block text-sm text-slate-600 dark:text-slate-400">模板内容</label>
              <button class="text-xs text-blue-600 dark:text-blue-400">插入变量 { }</button>
            </div>
            <textarea v-model="formData.content" rows="10" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
          </div>

          <div class="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button @click="saveToLocal" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
              保存模板
            </button>
            <button class="px-6 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium rounded-lg transition-colors">
              预览效果
            </button>
            <button class="px-6 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium rounded-lg transition-colors">
              复制模板
            </button>
            <button @click="resetForm" class="px-6 py-2 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium rounded-lg transition-colors ml-auto">
              清空/删除
            </button>
          </div>
        </div>
      </section>

      <aside class="col-span-12 lg:col-span-4 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 h-fit sticky top-24">
        <div class="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-700 pb-3">
          <h2 class="font-bold text-lg">模板预览</h2>
          <button class="px-3 py-1.5 bg-blue-600 text-white text-xs rounded flex items-center hover:bg-blue-700">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path></svg>
            使用模板
          </button>
        </div>

        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium mb-1">language <span class="text-red-500">*</span></label>
            <select class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none">
              <option>Python</option>
              <option>JavaScript</option>
              <option>Java</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">code <span class="text-red-500">*</span></label>
            <textarea rows="4" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-mono outline-none">def add(a, b):&#10;    return a + b</textarea>
          </div>
        </div>

        <div class="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-sm border border-slate-100 dark:border-slate-700">
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs text-slate-500">预览结果 (示例)</span>
            <button class="text-xs text-blue-600 dark:text-blue-400 flex items-center">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              复制
            </button>
          </div>
          <div class="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
            <p>1. 代码功能概述<br/>这段代码定义了一个函数 add...</p>
          </div>
        </div>
      </aside>

      <section class="col-span-12 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mt-2">
        <div class="flex flex-wrap justify-between items-center mb-4 gap-4">
          <h2 class="font-bold text-lg">我的模板</h2>
          <div class="flex items-center gap-3">
            <div class="relative">
              <svg class="w-4 h-4 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input type="text" placeholder="搜索模板名称或描述..." class="pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 outline-none w-64">
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th class="pb-3 font-medium">模板名称</th>
              <th class="pb-3 font-medium">分类</th>
              <th class="pb-3 font-medium">描述</th>
              <th class="pb-3 font-medium">更新时间</th>
              <th class="pb-3 font-medium text-right">操作</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
            <tr v-for="item in savedList" :key="item.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td class="py-3 text-blue-600 dark:text-blue-400 flex items-center gap-2">
                {{ item.name }}
                <svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              </td>
              <td class="py-3"><span class="px-2 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded border border-blue-100 dark:border-blue-800">{{ item.category }}</span></td>
              <td class="py-3 text-slate-500 dark:text-slate-400 max-w-xs truncate">{{ item.description }}</td>
              <td class="py-3 text-slate-500 dark:text-slate-400">{{ item.updatedAt }}</td>
              <td class="py-3 text-right">
                <button class="text-blue-600 hover:text-blue-800 dark:text-blue-400 mr-3 text-xs">使用</button>
                <button @click="loadTemplate(item)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-xs">编辑</button>
              </td>
            </tr>
            <tr v-if="savedList.length === 0">
              <td colspan="5" class="py-8 text-center text-slate-400 text-sm">暂无保存的模板数据</td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// --- 1. 黑夜模式逻辑 ---
const isDark = ref(false)

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// --- 2. 基础数据状态 ---
const activeCategory = ref('全部模板')

// SVG 字符串为了保持代码整洁这里做了简化处理，实际开发中可以引入独立的 SVG 文件
const categories = ref([
  { name: '全部模板', count: 24, icon: '<span>🗂️</span>' },
  { name: '通用对话', count: 6, icon: '<span>💬</span>' },
  { name: '内容创作', count: 6, icon: '<span>✍️</span>' },
  { name: '编程开发', count: 5, icon: '<span>💻</span>' },
  { name: '学习教育', count: 3, icon: '<span>🎓</span>' },
  { name: '职场办公', count: 3, icon: '<span>🏢</span>' },
])

const defaultForm = {
  id: null,
  name: '代码解释助手',
  category: '编程开发',
  description: '用于解释代码的功能、逻辑和实现细节，适用于多种编程语言。',
  content: '你是一位专业的编程助手，擅长理解和解释代码。\n\n请对以下代码进行分析和解释：\n```{language}\n{code}\n```\n\n请按照以下结构进行回答：\n1. 代码功能概述\n2. 关键逻辑说明\n3. 可能的优化建议'
}

const formData = reactive({ ...defaultForm })
const savedList = ref([])

// --- 3. LocalStorage 数据存储与交互逻辑 ---
const STORAGE_KEY = 'prompt_templates_data'

onMounted(() => {
  // 初始化主题
  if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  }

  // 初始化列表数据
  const localData = localStorage.getItem(STORAGE_KEY)
  if (localData) {
    try {
      savedList.value = JSON.parse(localData)
    } catch (e) {
      console.error('解析本地数据失败', e)
    }
  } else {
    // 注入一条初始 mock 数据展示效果
    savedList.value = [{
      id: Date.now(),
      name: '代码解释助手',
      category: '编程开发',
      description: '用于解释代码的功能、逻辑和实现细节',
      content: defaultForm.content,
      updatedAt: new Date().toLocaleString()
    }]
  }
})

const saveToLocal = () => {
  if (!formData.name) return alert('请输入模板名称')

  const now = new Date().toLocaleString()
  const existingIndex = savedList.value.findIndex(item => item.id === formData.id)

  if (existingIndex > -1) {
    // 更新已有
    savedList.value[existingIndex] = { ...formData, updatedAt: now }
  } else {
    // 新增
    savedList.value.unshift({
      ...formData,
      id: Date.now(),
      updatedAt: now
    })
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedList.value))
  alert('保存成功！')
}

const loadTemplate = (item) => {
  Object.assign(formData, item)
}

const resetForm = () => {
  if(confirm('确定要清空当前编辑区吗？')) {
    Object.assign(formData, {
      id: null,
      name: '',
      category: '通用对话',
      description: '',
      content: ''
    })
  }
}
</script>

<style scoped>
/* 隐藏原生滚动条但保持可滚动体验 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
.dark ::-webkit-scrollbar-thumb {
  background: #475569;
}
</style>
