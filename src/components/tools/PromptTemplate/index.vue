<template>
    <div class="bg-card-window-body grid grid-cols-1 lg:grid-cols-20 gap-6 items-start mx-auto">

      <!-- 左侧：我的模板 -->
      <aside class="lg:col-span-3  p-5">
        <div class="font-semibold text-[15px] mb-4 flex justify-between items-center">
          <span>我的模板</span>
          <button class="text-blue-500 dark:text-[#0066ff] text-xs cursor-pointer flex items-center gap-1 hover:brightness-110 transition-all">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            新建模板
          </button>
        </div>
        <ul class="list-none space-y-1">
          <li
              v-for="(item, index) in menuItems"
              :key="index"
              @click="activeIndex = index"
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
      <section class="lg:col-span-11 border border-slate-200 dark:border-[#27272a] p-5">
        <div class="font-semibold text-[15px] mb-4">模板编辑</div>

        <div class="gap-4 mb-5">
          <div class="flex flex-col gap-2">
            <label class="text-[13px] text-slate-500 dark:text-[#a1a1aa] font-medium">模板名称</label>
            <input
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
                class="transition-colors flex-1 p-3  resize-y min-h-75 font-mono text-sm leading-relaxed bg-transparent outline-none focus:border-blue-500 dark:focus:border-[#0066ff] focus:ring-2 focus:ring-blue-100 dark:focus:ring-[#0066ff]/20 placeholder:text-slate-400 dark:placeholder:text-[#3f3f46]"
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
          <button class="flex-1 bg-blue-500 dark:bg-[#0066ff] text-white py-2 rounded-md flex items-center justify-center gap-1.5 hover:bg-blue-600 dark:hover:brightness-110 transition-colors text-sm font-medium">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
            保存模板
          </button>
          <button class="flex-1 text-red-500 border border-red-200 dark:border-red-900/50 dark:bg-red-900/10 py-2 rounded-md flex items-center justify-center gap-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            删除模板
          </button>
        </div>
      </section>

      <!-- 右侧：提示词预览 -->
      <aside class="lg:col-span-6 p-5">
        <div class="font-semibold text-[15px] mb-4 flex justify-between items-center">
          <span>提示词预览</span>
          <button class="bg-blue-500 dark:bg-[#0066ff] text-white text-xs px-2.5 py-1.5 rounded hover:bg-blue-600 dark:hover:brightness-110 transition-colors font-medium">
            生成
          </button>
        </div>
        <div class="mt-5">
          <label class="text-xs text-slate-400 dark:text-[#a1a1aa]">生成结果预览</label>
          <div class="bg-[#fafafa] dark:bg-[#1c1c1f] border border-slate-200 dark:border-[#27272a] rounded-md p-4 min-h-[600px] text-slate-400 dark:text-[#a1a1aa] text-[13px] mt-2 leading-relaxed">
            预览结果将实时显示在这里...
          </div>
        </div>
      </aside>

    </div>
</template>

<script setup>
import { ref } from 'vue'

const activeIndex = ref(0)
const menuItems = ref([
  '代码解释助手',
  '翻译助手',
  '周报生成器',
  '小红书文案生成',
  'SQL 优化助手',
  '面试题生成器',
  '文章润色助手',
  '学习计划制定'
])

const variables = ref([
  { name: 'language', value: '' },
  { name: 'code', value: '' }
])

const addVar = () => {
  variables.value.push({ name: '', value: '' })
}

const removeVar = (index) => {
  variables.value.splice(index, 1)
}
</script>