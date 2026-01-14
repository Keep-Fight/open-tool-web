<script setup>
import {ref, reactive, computed, onMounted, onUnmounted} from 'vue'
import {hsvToRgb, rgbToHex} from '../../utils/colorUtils'

// 1. 核心状态：使用 HSV 模型更利于拾色器操作
const color = reactive({
  h: 210, // 色相 0-360
  s: 50,  // 饱和度 0-100
  v: 100, // 明度 0-100
  a: 1    // 透明度 0-1
})

// 2. 计算属性：导出不同格式
const rgbArr = computed(() => hsvToRgb(color.h, color.s, color.v))
const hex = computed(() => rgbToHex(...rgbArr.value))
const rgba = computed(() => `rgba(${rgbArr.value.join(', ')}, ${color.a})`)

// 3. UI 交互控制
const isDraggingSV = ref(false)
const svPanel = ref(null)

const updateSV = (e) => {
  if (!svPanel.value) return
  const rect = svPanel.value.getBoundingClientRect()
  let x = ((e.clientX - rect.left) / rect.width) * 100
  let y = ((e.clientY - rect.top) / rect.height) * 100
  color.s = Math.max(0, Math.min(100, x))
  color.v = Math.max(0, Math.min(100, 100 - y))
}

// 全局鼠标事件监听
const startDraggingSV = (e) => {
  isDraggingSV.value = true
  updateSV(e)
}

const handleGlobalMove = (e) => {
  if (isDraggingSV.value) updateSV(e)
}

const stopDragging = () => {
  isDraggingSV.value = false
}

onMounted(() => {
  window.addEventListener('mousemove', handleGlobalMove)
  window.addEventListener('mouseup', stopDragging)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleGlobalMove)
  window.removeEventListener('mouseup', stopDragging)
})

// 复制功能
const copy = (text) => {
  navigator.clipboard.writeText(text)
  alert('已复制: ' + text)
}
</script>

<template>
  <div>
    <div class="ml-6 mr-6 h-32 w-auto relative transition-colors duration-200 rounded-xl" :style="{ backgroundColor: rgba }">
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="text-white font-black text-2xl drop-shadow-md select-all uppercase">{{ hex }}</span>
      </div>
      <div
          class="absolute inset-0 -z-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
    </div>

    <div class="p-6 space-y-6">
      <div
          ref="svPanel"
          class="relative h-48 w-full rounded-xl cursor-crosshair overflow-hidden"
          :style="{ backgroundColor: `hsl(${color.h}, 100%, 50%)` }"
          @mousedown="startDraggingSV"
      >
        <div class="absolute inset-0 bg-linear-to-r from-white to-transparent"></div>
        <div class="absolute inset-0 bg-linear-to-t from-black to-transparent"></div>
        <div
            class="absolute w-4 h-4 border-2 border-white rounded-full shadow-md -translate-x-2 -translate-y-2 pointer-events-none"
            :style="{ left: color.s + '%', top: (100 - color.v) + '%' }"
        ></div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <span class="text-[10px] font-bold text-slate-400 w-8">HUE</span>
          <input type="range" v-model="color.h" min="0" max="360"
                 class="flex-1 h-3 rounded-lg appearance-none cursor-pointer hue-slider"/>
        </div>

        <div class="flex items-center gap-4">
          <span class="text-[10px] font-bold text-slate-400 w-8">ALPHA</span>
          <div class="flex-1 h-3 rounded-lg relative alpha-track">
            <input type="range" v-model="color.a" min="0" max="1" step="0.01"
                   class="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer z-10 alpha-slider"/>
            <div class="absolute inset-0 rounded-lg pointer-events-none"
                 :style="{ background: `linear-gradient(to right, transparent, ${hex})` }"></div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-3">
        <div @click="copy(hex)"
             class="group flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all">
          <div class="flex flex-col">
            <span class="text-[10px] font-bold text-slate-400">HEX</span>
            <span class="font-mono text-sm dark:text-slate-200 uppercase">{{ hex }}</span>
          </div>
          <svg class="w-4 h-4 text-slate-300 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24"
               stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>
          </svg>
        </div>

        <div @click="copy(rgba)"
             class="group flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all">
          <div class="flex flex-col">
            <span class="text-[10px] font-bold text-slate-400">RGBA</span>
            <span class="font-mono text-sm dark:text-slate-200">{{ rgba }}</span>
          </div>
          <svg class="w-4 h-4 text-slate-300 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24"
               stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>
          </svg>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
@reference "../../style.css";

/* 色相条自定义样式 */
.hue-slider {
  background: linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);
}

/* 隐藏 Range 默认滑块样式（根据需要自定义） */
input[type=range]::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 bg-white border-2 border-slate-200 rounded-full shadow-md;
}

/* 透明度棋盘格背景 */
.alpha-track {
  background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%),
  linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%);
  background-size: 10px 10px;
  background-position: 0 0, 5px 5px;
}
</style>
