<script setup>
import {ref, reactive, computed, watch, onMounted, onUnmounted} from 'vue'
import {hsvToRgb, rgbToHex, hexToRgb, rgbToHsv, getContrast} from '../../utils/colorUtils'

// 当前编辑模式：'text' 或 'bg'
const activeTarget = ref('text')

// 存储两个颜色的 HSV 状态
const colors = reactive({
  text: {h: 0, s: 0, v: 0, a: 1},    // 默认黑色
  bg: {h: 0, s: 0, v: 100, a: 1}  // 默认白色
})

// 辅助：输入框绑定的文本
const hexInputs = reactive({
  text: '#000000',
  bg: '#FFFFFF'
})

const swatches = [
  '#000000', '#FFFFFF', '#FF4D4F', '#FFA940', '#FFEC3D',
  '#73D13D', '#36CFC9', '#4096FF', '#9254DE', '#F759AB'
]

// 计算当前的 RGB 和 Hex
const currentRgb = (target) => hsvToRgb(colors[target].h, colors[target].s, colors[target].v)
const currentHex = (target) => rgbToHex(...currentRgb(target))
const currentRgba = (target) => `rgba(${currentRgb(target).join(', ')}, ${colors[target].a})`

const getRgb = (t) => hsvToRgb(colors[t].h, colors[t].s, colors[t].v)
const getRgba = (t) => `rgba(${getRgb(t).join(', ')}, ${colors[t].a})`

// WCAG 对比度计算
const contrastRatio = computed(() => {
  return getContrast(currentRgb('text'), currentRgb('bg'))
})

// 处理输入 Hex(val) 同步到坐标
const syncFromHex = (target, val) => {
  if (!val.startsWith('#')) val = '#' + val
  if (/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(val)) {
    const rgb = hexToRgb(val)
    const hsv = rgbToHsv(...rgb)
    colors[target].h = hsv[0]
    colors[target].s = hsv[1]
    colors[target].v = hsv[2]
  }
}

// 自动同步：当拾色器移动时，更新输入框
watch(() => [colors.text.h, colors.text.s, colors.text.v], () => {
  hexInputs.text = currentHex('text').toUpperCase()
})
watch(() => [colors.bg.h, colors.bg.s, colors.bg.v], () => {
  hexInputs.bg = currentHex('bg').toUpperCase()
})

// 复制状态控制
const copyStatus = reactive({
  hex: false,
  rgba: false
})

const copyToClipboard = (text, type) => {
  navigator.clipboard.writeText(text).then(() => {
    // 设置对应的状态为 true
    copyStatus[type] = true

    // 2秒后恢复原样
    setTimeout(() => {
      copyStatus[type] = false
    }, 2000)
  })
}

// --- 拾色器交互逻辑 ---
const svPanel = ref(null)
const isDragging = ref(false)
const updateSV = (e) => {
  if (!svPanel.value) return
  const rect = svPanel.value.getBoundingClientRect()
  const target = colors[activeTarget.value]
  target.s = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
  target.v = Math.max(0, Math.min(100, 100 - ((e.clientY - rect.top) / rect.height) * 100))
}

// 全局监听处理
const onMove = (e) => isDragging.value && updateSV(e)
const onUp = () => isDragging.value = false
onMounted(() => {
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp)
})
</script>

<template>
  <div class="mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
    <div class="lg:col-span-7 space-y-4">
      <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
        <div class="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
          <button @click="activeTarget = 'text'"
                  :class="activeTarget === 'text' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-500'"
                  class="flex-1 py-2 text-xs font-black uppercase rounded-lg transition-all">文本颜色
          </button>
          <button @click="activeTarget = 'bg'"
                  :class="activeTarget === 'bg' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-500'"
                  class="flex-1 py-2 text-xs font-black uppercase rounded-lg transition-all">背景颜色
          </button>
        </div>

        <div ref="svPanel" class="relative h-80 rounded-xl cursor-crosshair mb-4"
             :style="{ backgroundColor: `hsl(${colors[activeTarget].h}, 100%, 50%)` }"
             @mousedown="isDragging = true; updateSV($event)">
          <div class="absolute inset-0 bg-linear-to-r from-white to-transparent rounded-xl"></div>
          <div class="absolute inset-0 bg-linear-to-t from-black to-transparent rounded-xl"></div>
          <div
              class="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg -translate-x-2 -translate-y-2 pointer-events-none"
              :style="{ left: colors[activeTarget].s + '%', top: (100 - colors[activeTarget].v) + '%' }"></div>
        </div>

        <!-- 预设颜色选择器 -->
        <button v-for="s in swatches" :key="s" @click="syncFromHex(activeTarget, s)"
                class="w-6 h-6 rounded-md border-2 border-white dark:border-slate-800 shadow-sm hover:scale-110 transition-transform"
                :style="{ backgroundColor: s }"></button>
        <!-- 全颜色选择器 -->
        <input type="range" v-model="colors[activeTarget].h" min="0" max="360"
               class="w-full h-3 rounded-lg appearance-none cursor-pointer hue-slider mb-6"/>

        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <input v-model="hexInputs[activeTarget]" @input="syncFromHex(activeTarget, $event.target.value)"
                   class="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none"/>

            <div class="relative">
              <button @click="copyToClipboard(currentHex(activeTarget), 'hex')"
                      class="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-500 hover:text-indigo-600 transition-all flex items-center justify-center min-w-[50px]">
                <span v-if="!copyStatus.hex">Hex</span>
                <svg v-else class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>

              <Transition name="fade-pop">
                <div v-if="copyStatus.hex" class="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                  已复制！
                  <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                </div>
              </Transition>
            </div>

            <div class="flex-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-2 font-mono text-[15px] text-slate-500 truncate dark:text-slate-400">
              {{ getRgba(activeTarget) }}
            </div>

            <div class="relative">
              <button @click="copyToClipboard(getRgba(activeTarget), 'rgba')"
                      class="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-500 hover:text-indigo-600 transition-all flex items-center justify-center min-w-[60px]">
                <span v-if="!copyStatus.rgba">RGBA</span>
                <svg v-else class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>

              <Transition name="fade-pop">
                <div v-if="copyStatus.rgba" class="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                  已复制！
                  <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="lg:col-span-5 space-y-10">
      <div
          class="h-80 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 transition-colors duration-200"
          :style="{ backgroundColor: currentRgba('bg') }">
        <h2 class="text-5xl font-black mb-2 tracking-tight" :style="{ color: currentRgba('text') }">Text 文本</h2>
        <p class="text-sm opacity-80 max-w-xs text-center leading-relaxed" :style="{ color: currentRgba('text') }">
          Everything will be ok.
        </p>
        <p class="text-sm opacity-80 max-w-xs text-center leading-relaxed" :style="{ color: currentRgba('text') }">
          一切都会好起来的。
        </p>
      </div>

      <div
          class="bg-white h-50 dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contrast Ratio</div>
          <div class="text-6xl font-black tabular-nums transition-all"
               :class="contrastRatio >= 4.5 ? 'text-emerald-500' : 'text-amber-500'">
            {{ contrastRatio }}<span class="text-2xl">:1</span>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <span class="w-12 text-[10px] font-bold text-slate-400">AA</span>
            <span :class="contrastRatio >= 4.5 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'"
                  class="px-3 py-1 rounded text-[10px] font-black text-white uppercase">{{
                contrastRatio >= 4.5 ? 'Pass' : 'Fail'
              }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="w-12 text-[10px] font-bold text-slate-400">AAA</span>
            <span :class="contrastRatio >= 7.0 ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'"
                  class="px-3 py-1 rounded text-[10px] font-black text-white uppercase">{{
                contrastRatio >= 7.0 ? 'Pass' : 'Fail'
              }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
@reference "../../style.css";

.hue-slider {
  background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
}

.hue-slider::-webkit-slider-thumb {
  @apply appearance-none w-5 h-5 bg-white border-2 border-slate-200 rounded-full shadow-lg cursor-pointer;
}

/* 气泡弹出动画 */
.fade-pop-enter-active, .fade-pop-leave-active {
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.fade-pop-enter-from {
  opacity: 0;
  transform: translate(-50%, 10px) scale(0.8);
}

.fade-pop-leave-to {
  opacity: 0;
  transform: translate(-50%, 0) scale(0.9);
}
</style>
