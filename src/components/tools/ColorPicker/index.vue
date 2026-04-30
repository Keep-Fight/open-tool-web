<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue';
import {Copy} from 'lucide-vue-next'
import { useToast } from '@/composables/useToast';

const toasts = useToast()

// --- 1. 基础状态管理 ---
const bgState = reactive({ h: 0, s: 0, v: 100, a: 1 });    // 背景默认纯白
const textState = reactive({ h: 0, s: 0, v: 0, a: 1 });    // 文本默认纯黑
const activeTarget = ref('bg');
const colorState = reactive({ h: 0, s: 0, v: 0, a: 1 }); // UI操作面板状态

// 切换目标时同步
watch(activeTarget, (newTarget) => {
  const target = newTarget === 'bg' ? bgState : textState;
  Object.assign(colorState, target);
}, { immediate: true });

// 拖动取色器时同步回目标
watch(colorState, (newState) => {
  const target = activeTarget.value === 'bg' ? bgState : textState;
  Object.assign(target, newState);
}, { deep: true });

// --- 2. 颜色转换算法库 ---

// HSV <-> RGB
const hsvToRgb = (h, s, v) => {
  s /= 100; v /= 100;
  const i = Math.floor(h / 60), f = h / 60 - i;
  const p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
  let r, g, b;
  switch (i % 6) {
    case 0: [r, g, b] = [v, t, p]; break;
    case 1: [r, g, b] = [q, v, p]; break;
    case 2: [r, g, b] = [p, v, t]; break;
    case 3: [r, g, b] = [p, q, v]; break;
    case 4: [r, g, b] = [t, p, v]; break;
    case 5: [r, g, b] = [v, p, q]; break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

const rgbToHsv = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h;
  if (d === 0) h = 0;
  else if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [Math.round(((h * 60) + 360) % 360), Math.round(max === 0 ? 0 : (d / max) * 100), Math.round(max * 100)];
};

const rgbToHex = (r, g, b) => "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();

// --- 3. 结果计算逻辑 ---
const getAllFormats = (state) => {
  const [r, g, b] = hsvToRgb(state.h, state.s, state.v);
  return {
    HEX: rgbToHex(r, g, b),
    RGBA: `rgba(${r}, ${g}, ${b}, ${state.a})`,
    RGB: `rgb(${r}, ${g}, ${b})`
  };
};

const bgData = computed(() => getAllFormats(bgState));
const textData = computed(() => getAllFormats(textState));

// --- 4. 输入解析与反向定位 ---
const handleInputChange = (targetKey, type, value) => {
  const state = targetKey === 'bg' ? bgState : textState;
  let r, g, b, a;
  try {
    if (type === 'HEX') {
      const hex = value.replace('#', '');
      if (![3, 6].includes(hex.length)) return;
      const fullHex = hex.length === 3 ? hex.split('').map(s => s + s).join('') : hex;
      r = parseInt(fullHex.slice(0, 2), 16);
      g = parseInt(fullHex.slice(2, 4), 16);
      b = parseInt(fullHex.slice(4, 6), 16);
    } else if (type === 'RGB') {
      const val = value.replace('rgb', '').replace('(', '').replace(')','')
      const parts = val.split(',').map(v => parseInt(v.trim()));
      console.log(parts);
      if (parts.length < 3) return;
      [r, g, b] = parts;
    } else if (type === 'RGBA') {
      const val = value.replace('rgba', '').replace('(', '').replace(')','')
      const parts = val.split(',').map(v => parseFloat(v.trim()));
      if (parts.length < 4) return;
      [ r, g, b, a] = parts.slice(0, 3);
    }

    if ([r, g, b].every(v => v >= 0 && v <= 255)) {
      const [h, s, v] = rgbToHsv(r, g, b);
      state.h = h; state.s = s; state.v = v;
      // 如果修改的是当前激活的目标，同步到取色器 UI
      if (activeTarget.value === targetKey) {
        colorState.h = h; colorState.s = s; colorState.v = v;
      }
    }
  } catch (e) { console.error("Parse error"); }
};

// --- 5. 交互逻辑
const svPanel = ref(null);
const isDraggingSV = ref(false);
const handleSVMove = (e) => {
  if (!svPanel.value) return;
  const rect = svPanel.value.getBoundingClientRect();
  colorState.s = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
  colorState.v = Math.max(0, Math.min(100, (1 - (e.clientY - rect.top) / rect.height) * 100));
};
const handleHueMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  colorState.h = Math.max(0, Math.min(360, ((e.clientY - rect.top) / rect.height) * 360));
};
const handleCopy = (val) => {
  navigator.clipboard.writeText(val);
  toasts.success('已复制到剪贴板')
};
const onMouseMove = (e) => { if (isDraggingSV.value) handleSVMove(e); };
const onMouseUp = () => { isDraggingSV.value = false; };

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
});
onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
});

// 对比度逻辑
const getLum = (st) => {
  const [r, g, b] = hsvToRgb(st.h, st.s, st.v);
  const a = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};
const contrast = computed(() => {
  const l1 = getLum(textState), l2 = getLum(bgState);
  const r = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return { ratio: r.toFixed(2), aa: r >= 4.5, aaa: r >= 7 };
});
</script>

<template>
  <div class="w-full bg-card-window-body p-8">
    <div class="flex flex-wrap lg:flex-nowrap gap-12">

      <section class="flex-none">
        <div class="flex justify-between items-end mb-4">
          <h2 class="text-xs font-black uppercase text-zinc-400 tracking-widest">调色板</h2>
          <span class="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 rounded text-[10px] font-bold text-blue-600">
            Target: {{ activeTarget === 'bg' ? '背景' : '文本' }}
          </span>
        </div>

        <div class="flex gap-6">
          <div ref="svPanel" @mousedown="isDraggingSV = true; handleSVMove($event)"
               class="relative w-[450px] h-[450px] cursor-crosshair overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-inner"
               :style="{ backgroundColor: `hsl(${colorState.h}, 100%, 50%)` }">
            <div class="absolute inset-0 bg-linear-to-r from-white to-transparent"></div>
            <div class="absolute inset-0 bg-linear-to-t from-black to-transparent"></div>
            <div class="absolute w-6 h-6 border-4 border-white rounded-full shadow-xl -translate-x-1/2 translate-y-1/2"
                 :style="{ left: colorState.s + '%', bottom: colorState.v + '%' }"></div>
          </div>

          <div @mousedown="handleHueMove($event)" class="w-8 h-[450px] rounded-full relative cursor-pointer border border-zinc-200/50"
               style="background: linear-gradient(to bottom, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);">
            <div class="absolute -left-1 -right-1 h-3 bg-white border-2 border-zinc-600 rounded-full shadow-md"
                 :style="{ top: (colorState.h / 360 * 100) + '%' }"></div>
          </div>
        </div>

        <div class="mt-8 space-y-2 w-[450px]">
          <div class="flex justify-between text-[10px] font-black text-zinc-400 uppercase">
            <span>不透明度</span> <span>{{ Math.round(colorState.a * 100) }}%</span>
          </div>
          <div class="h-6 rounded-full relative bg-[repeating-conic-gradient(#e5e7eb_0%_25%,#fff_0%_50%)_50%/12px_12px] border overflow-hidden">
            <div class="absolute inset-0" :style="{ background: `linear-gradient(to right, transparent, hsl(${colorState.h}, ${colorState.s}%, ${colorState.v/2+25}%))` }"></div>
            <input type="range" v-model.number="colorState.a" min="0" max="1" step="0.01" class="absolute inset-0 opacity-0 cursor-pointer w-full" />
            <div class="absolute h-full w-1 bg-white shadow-md" :style="{ left: (colorState.a * 100) + '%' }"></div>
          </div>
        </div>
      </section>

      <section class="flex-1 min-w-[480px]">
        <h2 class="text-xs font-black uppercase text-zinc-400 mb-4 tracking-widest">多格式数值输出 (可输入编辑)</h2>

        <div class="grid grid-cols-2 gap-8 mb-8">
          <div class="space-y-2">
            <p class="text-[10px] font-bold text-zinc-500 text-center">背景颜色数值</p>
            <div v-for="(val, type) in bgData" :key="'bg'+type" class="result-box">
              <span class="label">{{ type }}</span>
              <input :value="val" @input="e => handleInputChange('bg', type, e.target.value)" spellcheck="false" class="value-input" />
              <Copy @click="handleCopy(val)" class="w-5 h-5"/>
            </div>
          </div>

          <div class="space-y-2">
            <p class="text-[10px] font-bold text-zinc-500 text-center">文本颜色数值</p>
            <div v-for="(val, type) in textData" :key="'tx'+type" class="result-box">
              <span class="label">{{ type }}</span>
              <input :value="val" @input="e => handleInputChange('text', type, e.target.value)" spellcheck="false" class="value-input"/>
              <Copy @click="handleCopy(val)" class="w-5 h-5"/>
            </div>
          </div>
        </div>

        <div class="flex gap-3 mb-6">
          <button @click="activeTarget = 'bg'" :class="['target-btn', activeTarget === 'bg' ? 'active' : 'inactive']">背景模式</button>
          <button @click="activeTarget = 'text'" :class="['target-btn', activeTarget === 'text' ? 'active' : 'inactive']">文字模式</button>
        </div>

        <div class="relative w-full h-80 rounded-3xl flex flex-col items-center justify-center  shadow-2xl overflow-hidden bg-[repeating-conic-gradient(#e5e7eb_0%_25%,#fff_0%_50%)_50%/20px_20px]">
          <div class="absolute inset-0" :style="{ backgroundColor: `rgba(${hsvToRgb(bgState.h, bgState.s, bgState.v).join(',')}, ${bgState.a})` }"></div>
          <div :style="{ color: `rgba(${hsvToRgb(textState.h, textState.s, textState.v).join(',')}, ${textState.a})` }" class="relative z-10 text-center">
            <p class="text-7xl font-black mb-2 tracking-tighter">{{ contrast.ratio }}:1</p>
            <div class="status-group flex gap-3 justify-center mb-6">
              <span :class="['px-4 py-1 rounded-full text-[10px] font-black', contrast.aa ? 'bg-green-500 text-white' : 'bg-zinc-300 text-zinc-500']">AA {{ contrast.aa ? 'PASS' : 'FAIL' }}</span>
              <span :class="['px-4 py-1 rounded-full text-[10px] font-black', contrast.aaa ? 'bg-green-500 text-white' : 'bg-zinc-300 text-zinc-500']">AAA {{ contrast.aaa ? 'PASS' : 'FAIL' }}</span>
            </div>
            <p class="text-sm font-bold opacity-80 px-12">The quick brown fox jumps over the lazy dog.</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
@reference "@/style.css";

.value-input {
  border: none;
  background: transparent;
  font-size: 14px;
  color: var(--text-main);
  padding: 6px;
}

.result-box {
  @apply flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-xl;
}
.result-box .label { @apply text-[8px] font-black text-zinc-400 w-9; }
.result-box input { @apply flex-1 bg-transparent text-[11px] font-mono dark:text-zinc-200 outline-none border-b border-transparent focus:border-blue-500/30; }

.target-btn { @apply flex-1 py-3 text-xs font-black rounded-2xl transition-all border; }
.target-btn.active { @apply bg-blue-600 text-on-surface border-blue-600 shadow-lg shadow-blue-500/30; }
.target-btn.inactive { @apply bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-zinc-200; }

input[type=range] { -webkit-appearance: none; background: transparent; }
input[type=range]:focus { outline: none; }
</style>