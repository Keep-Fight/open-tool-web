<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { hsvToRgb, rgbToHex, hexToRgb, rgbToHsv, getContrast } from '../../utils/colorUtils'

// 1. 核心状态
const activeTarget = ref('text')
const colors = reactive({
  text: { h: 0, s: 0, v: 0, a: 1 },
  bg: { h: 210, s: 10, v: 98, a: 1 }
})

// 2. 预览排版状态
const previewSettings = reactive({
  text: '配色实验室 Pro',
  fontSize: 48
})

// 3. 预设色槽
const swatches = [
  '#000000', '#FFFFFF', '#FF4D4F', '#FFA940', '#FFEC3D',
  '#73D13D', '#36CFC9', '#4096FF', '#9254DE', '#F759AB'
]

// 4. 显示与计算
const hexDisplay = reactive({ text: '#000000', bg: '#F5F8FA' })
const getRgb = (t) => hsvToRgb(colors[t].h, colors[t].s, colors[t].v)
const getHex = (t) => rgbToHex(...getRgb(t))
const getRgba = (t) => `rgba(${getRgb(t).join(', ')}, ${colors[t].a})`
const contrastRatio = computed(() => getContrast(getRgb('text'), getRgb('bg')))

// 5. 输入同步防崩逻辑
const syncFromHex = (target, val) => {
  if (val && !val.startsWith('#')) val = '#' + val
  if (val) hexDisplay[target] = val.toUpperCase()

  if (/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(val)) {
    const rgb = hexToRgb(val)
    if (rgb) {
      const hsv = rgbToHsv(...rgb)
      colors[target].h = hsv.h; colors[target].s = hsv.s; colors[target].v = hsv.v
    }
  }
}

// 自动更新输入框
watch(() => [colors.text.h, colors.text.s, colors.text.v], () => {
  const newHex = getHex('text').toUpperCase()
  if (hexDisplay.text !== newHex) hexDisplay.text = newHex
})
watch(() => [colors.bg.h, colors.bg.s, colors.bg.v], () => {
  const newHex = getHex('bg').toUpperCase()
  if (hexDisplay.bg !== newHex) hexDisplay.bg = newHex
})

// 6. 交互
const svPanel = ref(null)
const isDragging = ref(false)
const updateSV = (e) => {
  const rect = svPanel.value.getBoundingClientRect()
  const t = colors[activeTarget.value]
  t.s = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
  t.v = Math.max(0, Math.min(100, 100 - ((e.clientY - rect.top) / rect.height) * 100))
}

onMounted(() => {
  window.addEventListener('mousemove', (e) => isDragging.value && updateSV(e))
  window.addEventListener('mouseup', () => isDragging.value = false)
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 flex items-center justify-center">
    <div class="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-5 gap-8">

      <div class="lg:col-span-3 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xs font-black uppercase tracking-widest text-slate-400">Inspector</h2>
          <div class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button @click="activeTarget = 'text'" :class="activeTarget === 'text' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-white' : 'text-slate-500'" class="px-5 py-2 text-[10px] font-bold uppercase rounded-lg transition-all">Text</button>
            <button @click="activeTarget = 'bg'" :class="activeTarget === 'bg' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-white' : 'text-slate-500'" class="px-5 py-2 text-[10px] font-bold uppercase rounded-lg transition-all">BG</button>
          </div>
        </div>

        <div ref="svPanel" class="relative h-64 rounded-2xl cursor-crosshair overflow-hidden shadow-inner"
             :style="{ backgroundColor: `hsl(${colors[activeTarget].h}, 100%, 50%)` }" @mousedown="isDragging = true; updateSV($event)">
          <div class="absolute inset-0 bg-linear-to-r from-white to-transparent"></div>
          <div class="absolute inset-0 bg-linear-to-t from-black to-transparent"></div>
          <div class="absolute w-5 h-5 border-2 border-white rounded-full shadow-lg -translate-x-2.5 -translate-y-2.5 pointer-events-none" :style="{ left: colors[activeTarget].s + '%', top: (100 - colors[activeTarget].v) + '%' }"></div>
        </div>

        <div class="space-y-4">
          <div class="flex gap-4">
            <div class="flex-1 space-y-2">
              <span class="text-[9px] font-bold text-slate-400">HUE ({{ Math.round(colors[activeTarget].h) }}°)</span>
              <input type="range" v-model="colors[activeTarget].h" min="0" max="360" class="w-full h-2 rounded-lg appearance-none cursor-pointer hue-slider" />
            </div>
            <div class="flex-1 space-y-2">
              <span class="text-[9px] font-bold text-slate-400">OPACITY ({{ Math.round(colors[activeTarget].a * 100) }}%)</span>
              <div class="h-2 rounded-lg alpha-track relative">
                <input type="range" v-model="colors[activeTarget].a" min="0" max="1" step="0.01" class="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer z-10 alpha-slider" />
                <div class="absolute inset-0 rounded-lg" :style="{ background: `linear-gradient(to right, transparent, ${getHex(activeTarget)})` }"></div>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 py-2">
            <button v-for="s in swatches" :key="s" @click="syncFromHex(activeTarget, s)"
                    class="w-6 h-6 rounded-md border-2 border-white dark:border-slate-800 shadow-sm hover:scale-110 transition-transform" :style="{ backgroundColor: s }"></button>
          </div>
        </div>

        <hr class="border-slate-100 dark:border-slate-800" />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label class="text-[9px] font-black text-slate-400 uppercase block mb-1">Custom Preview Text</label>
              <input v-model="previewSettings.text" class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
            <div>
              <label class="text-[9px] font-black text-slate-400 uppercase block mb-1">Font Size ({{ previewSettings.fontSize }}px)</label>
              <input type="range" v-model="previewSettings.fontSize" min="12" max="120" class="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none" />
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <label class="text-[9px] font-black text-slate-400 uppercase block mb-1">Hex Input</label>
              <input v-model="hexDisplay[activeTarget]" @input="syncFromHex(activeTarget, $event.target.value)" class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 font-mono text-sm dark:text-white" />
            </div>
            <div>
              <label class="text-[9px] font-black text-slate-400 uppercase block mb-1">RGBA Value</label>
              <div class="bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2.5 font-mono text-[10px] text-slate-500 truncate select-all">{{ getRgba(activeTarget) }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2 flex flex-col gap-6">
        <div class="flex-1 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 transition-all duration-300 border border-slate-100 dark:border-slate-800"
             :style="{ backgroundColor: getRgba('bg') }">
          <div :style="{ color: getRgba('text'), fontSize: previewSettings.fontSize + 'px' }" class="font-black text-center break-words max-w-full leading-tight">
            {{ previewSettings.text }}
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 text-center">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contrast Ratio</span>
          <div class="text-6xl font-black tabular-nums my-2" :class="contrastRatio >= 4.5 ? 'text-emerald-500' : 'text-amber-500'">
            {{ contrastRatio }}<span class="text-xl ml-1">:1</span>
          </div>
          <div class="flex gap-2 justify-center mt-4">
            <div :class="contrastRatio >= 4.5 ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'" class="px-4 py-1.5 rounded-lg text-[9px] font-black uppercase">AA</div>
            <div :class="contrastRatio >= 7.0 ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'" class="px-4 py-1.5 rounded-lg text-[9px] font-black uppercase">AAA</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
@reference "../../style.css";

.hue-slider { background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%); }
.hue-slider::-webkit-slider-thumb, .alpha-slider::-webkit-slider-thumb {
  @apply appearance-none w-5 h-5 bg-white border-2 border-slate-200 rounded-full shadow-lg cursor-pointer;
}
.alpha-track {
  background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%),
  linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%);
  background-size: 8px 8px;
}
</style>
