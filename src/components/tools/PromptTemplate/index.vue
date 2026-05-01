<template>
  <div class="bg-card-window-body grid grid-cols-1 lg:grid-cols-20 gap-6 items-start mx-auto">

    <!-- 左侧：我的模板 -->
    <aside class="lg:col-span-3  p-5">

      <!-- 新增：导入导出功能区 -->
      <div class="flex gap-2 mb-4">
        <button @click="showImportModal = true" class="flex-1 bg-slate-50 hover:bg-slate-100 dark:bg-[#1c1c1f] dark:hover:bg-[#252529] text-slate-600 dark:text-[#a1a1aa] border border-slate-200 dark:border-[#3f3f46] py-1.5 rounded-md text-xs flex justify-center items-center gap-1.5 transition-colors cursor-pointer">
          <!-- 导入图标 (Arrow Down) -->
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          导入
        </button>
        <button @click="exportAllTemplates" class="flex-1 bg-slate-50 hover:bg-slate-100 dark:bg-[#1c1c1f] dark:hover:bg-[#252529] text-slate-600 dark:text-[#a1a1aa] border border-slate-200 dark:border-[#3f3f46] py-1.5 rounded-md text-xs flex justify-center items-center gap-1.5 transition-colors cursor-pointer">
          <!-- 导出图标 (Arrow Up) -->
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          导出
        </button>
      </div>

      <div class="font-semibold text-[15px] mb-3 flex justify-between items-center">
        <span>我的模板</span>
        <button @click="createTemplate" class="text-blue-500 dark:text-[#0066ff] text-xs cursor-pointer flex items-center gap-1 hover:brightness-110 transition-all">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          新建模板
        </button>
      </div>

      <ul class="list-none space-y-1">
        <li
            v-for="(item, index) in menuItems"
            :key="index"
            @click="selectTemplate(index)"
            :class="[
              'px-3 py-2.5 rounded-md text-sm cursor-pointer flex justify-between items-center transition-colors',
              activeIndex === index
                ? 'bg-blue-50 dark:bg-[#1c1c1f] text-blue-600 dark:text-[#0066ff] font-medium'
                : 'text-slate-500 dark:text-[#a1a1aa] hover:bg-slate-100 dark:hover:bg-[#1c1c1f]'
            ]"
        >
          {{ item }}
        </li>
      </ul>
    </aside>

    <!-- 中间：模板编辑 -->
    <section class="lg:col-span-11 border-l border-r border-slate-200 dark:border-[#27272a] p-5 h-full">
      <div class="font-semibold text-[15px] mb-4">模板编辑</div>
      <div class="gap-4 mb-5">
        <div class="flex flex-col gap-2">
          <label class="text-[13px] text-slate-500 dark:text-[#a1a1aa] font-medium">模板名称</label>
          <input
              v-model="templateName"
              type="text"
              placeholder="输入模板名称..."
              class="w-full p-2.5 border border-slate-200 dark:border-[#3f3f46] bg-transparent rounded-md text-sm outline-none focus:border-blue-500 dark:focus:border-[#0066ff] focus:ring-2 focus:ring-blue-100 dark:focus:ring-[#0066ff]/20 transition-all placeholder:text-slate-400 dark:placeholder:text-[#3f3f46]"
          >
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex justify-between items-center">
          <label class="text-[13px] text-slate-500 dark:text-[#a1a1aa] font-medium">模板内容</label>
        </div>
        <div class="border border-slate-200 dark:border-[#3f3f46] rounded-md overflow-hidden flex  mt-1 ">
            <textarea
                v-model="templateContent"
                class="transition-colors flex-1 p-3  resize-y min-h-75 font-mono text-sm leading-relaxed bg-transparent outline-none placeholder:text-slate-400 dark:placeholder:text-[#3f3f46]"
                placeholder="在此输入 Prompt 模板内容..."
            ></textarea>
        </div>
      </div>

      <div class="font-semibold text-sm mt-6 mb-3">变量设置</div>
      <table class="w-full border-collapse">
        <thead>
        <tr>
          <th class="text-left bg-slate-50 dark:bg-[#1c1c1f] p-2.5 text-xs text-slate-500 dark:text-[#a1a1aa] font-medium">变量名</th>
          <th class="text-left bg-slate-50 dark:bg-[#1c1c1f] p-2.5 text-xs text-slate-500 dark:text-[#a1a1aa] font-medium">变量值 (文本)</th>
          <th class="w-10 bg-slate-50 dark:bg-[#1c1c1f]"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(v, idx) in variables" :key="idx">
          <td class="p-2 border-b border-slate-200 dark:border-[#27272a]">
            <input type="text" v-model="v.name" class="border-none p-1 bg-transparent w-full outline-none text-sm text-slate-800 dark:text-[#f1f1f1]">
          </td>
          <td class="p-2 border-b border-slate-200 dark:border-[#27272a]">
            <input type="text" v-model="v.value" placeholder="请输入变量值..." class="border-none p-1 bg-transparent w-full outline-none text-sm placeholder:text-slate-400 dark:placeholder:text-[#3f3f46]">
          </td>
          <td class="p-2 border-b border-slate-200 dark:border-[#27272a] text-center">
            <button @click="removeVar(idx)" class="text-slate-400 hover:text-red-500 dark:text-[#a1a1aa] dark:hover:text-red-400 transition-colors">
              <svg class="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <button @click="addVar" class="mt-3 w-full border border-dashed border-slate-300 dark:border-[#3f3f46] flex items-center justify-center gap-1.5 py-2 rounded-md text-[13px] text-blue-500 dark:text-[#0066ff] hover:bg-slate-50 dark:hover:bg-[#1c1c1f] cursor-pointer transition-colors">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        添加变量
      </button>

      <div class="flex gap-3 mt-6">
        <button @click="saveTemplate" class="flex-1 bg-blue-500 dark:bg-[#0066ff] text-white py-2 rounded-md flex items-center justify-center gap-1.5 hover:bg-blue-600 dark:hover:brightness-110 transition-colors text-sm font-medium">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
          保存模板
        </button>
        <button @click="deleteTemplate" class="flex-1 text-red-500 border border-red-200 dark:border-red-900/50 dark:bg-red-900/10 py-2 rounded-md flex items-center justify-center gap-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          删除模板
        </button>
      </div>
      <Tips class="mt-3" text="数据存储在浏览器中，清除站点数据/缓存/所有浏览数据时，请先导出保存数据，以免丢失"/>
    </section>

    <!-- 右侧：提示词预览 -->
    <aside class="lg:col-span-6 p-5">
      <div class="font-semibold text-[15px] mb-4 flex justify-between items-center">
        <span>提示词预览</span>
        <button @click="copyPreview" class="bg-blue-500 dark:bg-[#0066ff] text-white text-xs px-2.5 py-1.5 rounded hover:bg-blue-600 dark:hover:brightness-110 transition-colors font-medium">
          复制
        </button>
      </div>
      <div class="mt-5">
        <div class="bg-[#fafafa] dark:bg-[#1c1c1f] border border-slate-200 dark:border-[#27272a] rounded-md p-4 min-h-[600px] text-slate-600 dark:text-[#a1a1aa] text-[13px] mt-2 leading-relaxed whitespace-pre-wrap">
          {{ previewResult || '预览结果将实时显示在这里...' }}
        </div>
      </div>
    </aside>

  </div>

  <!-- 导入弹窗 -->
  <PromptImportModal
      :isOpen="showImportModal"
      @close="closeImportModal"
      @import="handleImport"
  />

  <!-- 确认删除弹窗 -->
  <ConfirmDialog
      ref="confirmDialogRef"
      title="删除模板"
      :message="deleteConfirmMessage"
      @confirm="handleConfirmDelete"
  />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import PromptImportModal from './components/PromptImportModal.vue'
import ConfirmDialog from '@/components/public/ConfirmDialog.vue'
import { useToast } from '@/composables/useToast'
import Tips from "@/components/public/Tips.vue";

const toast = useToast()

// 存储键名
const STORAGE_KEY = 'prompt_templates'

// 默认模板数据
const defaultTemplates = []

// 从 localStorage 加载模板
const loadTemplates = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('加载模板失败:', e)
  }
  return defaultTemplates
}

// 保存模板到 localStorage
const saveTemplates = (templates) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
  } catch (e) {
    console.error('保存模板失败:', e)
  }
}

// 模板列表
const templates = ref(loadTemplates())

// 当前选中的模板索引
const activeIndex = ref(0)

// 当前选中的模板
const currentTemplate = computed(() => templates.value[activeIndex.value] || null)

// 模板名称
const templateName = ref('')
const templateContent = ref('')
const variables = ref([])

// 是否显示导入弹窗
const showImportModal = ref(false)

// 监听当前模板变化，更新编辑区
watch(currentTemplate, (tpl) => {
  if (tpl) {
    templateName.value = tpl.name
    templateContent.value = tpl.content
    variables.value = tpl.variables.map(v => ({ ...v }))
  }
}, { immediate: true })

// 监听编辑区变化，同步更新模板
watch([templateName, templateContent, variables], () => {
  if (currentTemplate.value) {
    const idx = activeIndex.value
    templates.value[idx].name = templateName.value
    templates.value[idx].content = templateContent.value
    templates.value[idx].variables = variables.value.map(v => ({ ...v }))
  }
}, { deep: true })

// 菜单项（从模板名称生成）
const menuItems = computed(() => templates.value.map(t => t.name))

// 添加变量
const addVar = () => {
  variables.value.push({ name: '', value: '' })
}

// 删除变量
const removeVar = (index) => {
  variables.value.splice(index, 1)
}

// 生成预览（变量替换）
const previewResult = computed(() => {
  if (!templateContent.value) return ''
  let result = templateContent.value
  variables.value.forEach(v => {
    if (v.name && v.value) {
      const regex = new RegExp(`{{${v.name}}}`, 'g')
      result = result.replace(regex, v.value)
    }
  })
  return result
})

// 删除确认消息
const deleteConfirmMessage = computed(() => {
  return `确定要删除模板"${currentTemplate.value?.name || ''}"吗？`
})

// 选择模板
const selectTemplate = (index) => {
  activeIndex.value = index
}

// 新建模板
const createTemplate = () => {
  const newId = Date.now().toString()
  const newTemplate = {
    id: newId,
    name: '新建模板',
    content: '',
    variables: [],
    createdAt: Date.now()
  }
  templates.value.unshift(newTemplate)
  activeIndex.value = 0
  templateName.value = newTemplate.name
  templateContent.value = ''
  variables.value = []
  saveTemplates(templates.value)
}

// 保存模板
const saveTemplate = () => {
  if (!currentTemplate.value) return
  const idx = activeIndex.value
  templates.value[idx].name = templateName.value
  templates.value[idx].content = templateContent.value
  templates.value[idx].variables = variables.value.map(v => ({ ...v }))
  saveTemplates(templates.value)
  toast.success('模板保存成功')
}

// 删除模板
const confirmDialogRef = ref(null)
const deleteTemplate = () => {
  if (!currentTemplate.value) return
  confirmDialogRef.value?.open()
}

const handleConfirmDelete = () => {
  templates.value.splice(activeIndex.value, 1)
  if (templates.value.length === 0) {
    createTemplate()
  } else {
    activeIndex.value = Math.min(activeIndex.value, templates.value.length - 1)
  }
  saveTemplates(templates.value)
  toast.success('模板已删除')
}

// 导出单个模板
const exportTemplate = () => {
  if (!currentTemplate.value) return
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentTemplate.value, null, 2))
  const downloadAnchorNode = document.createElement('a')
  downloadAnchorNode.setAttribute("href", dataStr)
  downloadAnchorNode.setAttribute("download", `prompt_template_${currentTemplate.value.name}.json`)
  document.body.appendChild(downloadAnchorNode)
  downloadAnchorNode.click()
  downloadAnchorNode.remove()
}

// 导出全部模板
const exportAllTemplates = () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(templates.value, null, 2))
  const downloadAnchorNode = document.createElement('a')
  downloadAnchorNode.setAttribute("href", dataStr)
  downloadAnchorNode.setAttribute("download", `prompt_templates_all.json`)
  document.body.appendChild(downloadAnchorNode)
  downloadAnchorNode.click()
  downloadAnchorNode.remove()
}

// 导入模板
const handleImport = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result)
      if (imported.name && imported.content) {
        // 单个模板导入
        const newTemplate = {
          id: Date.now().toString(),
          name: imported.name,
          content: imported.content,
          variables: imported.variables || [],
          createdAt: Date.now()
        }
        templates.value.unshift(newTemplate)
        activeIndex.value = 0
        saveTemplates(templates.value)
        toast.success('导入成功')
      }
    } catch (err) {
      console.error('解析文件失败:', err)
      toast.error('导入失败，文件格式错误')
    }
  }
  reader.readAsText(file)
}

// 导入弹窗关闭
const closeImportModal = () => {
  showImportModal.value = false
}

// 复制预览内容
const copyPreview = async () => {
  if (!previewResult.value) return
  try {
    await navigator.clipboard.writeText(previewResult.value)
    toast.success('复制成功')
  } catch (err) {
    console.error('复制失败:', err)
    toast.error('复制失败')
  }
}
</script>