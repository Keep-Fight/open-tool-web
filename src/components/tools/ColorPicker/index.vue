<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';

const currentColor = ref('#FF4D4F');
const bgColor = ref('#FFFFFF');
const colorState = reactive({ h: 0, s: 100, v: 100, a: 1 });

const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

const getLuminance = (r, g, b) => {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

const contrastData = computed(() => {
  const rgb1 = hexToRgb(currentColor.value);
  const rgb2 = hexToRgb(bgColor.value);
  const l1 = getLuminance(...rgb1);
  const l2 = getLuminance(...rgb2);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return {
    ratio: ratio.toFixed(2),
    aaSmall: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaaSmall: ratio >= 7,
    aaaLarge: ratio >= 4.5
  };
});

const swapColors = () => {
  const temp = currentColor.value;
  currentColor.value = bgColor.value;
  bgColor.value = temp;
};

const svPanel = ref(null);
const isDraggingSV = ref(false);

const hsvToRgb = (h, s, v) => {
  s /= 100; v /= 100;
  const i = Math.floor(h / 60);
  const f = h / 60 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r, g, b;
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

const rgbToHex = (r, g, b) => {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
};

const rgbToCmyk = (r, g, b) => {
  let c = 1 - (r / 255);
  let m = 1 - (g / 255);
  let y = 1 - (b / 255);
  let k = Math.min(c, m, y);
  if (k === 1) return [0, 0, 0, 100];
  c = Math.round(((c - k) / (1 - k)) * 100);
  m = Math.round(((m - k) / (1 - k)) * 100);
  y = Math.round(((y - k) / (1 - k)) * 100);
  k = Math.round(k * 100);
  return [c, m, y, k];
};

const rgb = computed(() => hsvToRgb(colorState.h, colorState.s, colorState.v));
const hex = computed(() => rgbToHex(...rgb.value));
const hsl = computed(() => `hsl(${colorState.h}, ${colorState.s}%, ${Math.round(colorState.v/2)}%)`);
const cmyk = computed(() => {
  const [c, m, y, k] = rgbToCmyk(...rgb.value);
  return `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`;
});

const handleSVMove = (e) => {
  if (!svPanel.value) return;
  const rect = svPanel.value.getBoundingClientRect();
  let x = (e.clientX - rect.left) / rect.width;
  let y = (e.clientY - rect.top) / rect.height;
  colorState.s = Math.max(0, Math.min(100, x * 100));
  colorState.v = Math.max(0, Math.min(100, (1 - y) * 100));
};

const handleHueMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  let percent = (e.clientY - rect.top) / rect.height;
  colorState.h = Math.max(0, Math.min(360, percent * 360));
};

const onMouseMove = (e) => {
  if (isDraggingSV.value) handleSVMove(e);
};
const onMouseUp = () => {
  isDraggingSV.value = false;
};

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
});
onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
});
</script>

<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 flex justify-center items-center transition-colors font-sans">
    <div class="w-full max-w-5xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-8">

      <header class="flex justify-between items-center mb-10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-[conic-gradient(red,yellow,lime,aqua,blue,magenta,red)]"></div>
          <h1 class="text-xl font-bold dark:text-white">颜色选择器</h1>
        </div>
        <div class="flex gap-2">
          <button class="btn-secondary">复制结果</button>
          <button class="btn-primary">下载结果</button>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 mb-12">
        <section>
          <h2 class="text-xs font-black uppercase text-zinc-400 mb-4 tracking-widest">选择颜色</h2>
          <div class="flex gap-4">
            <div
                ref="svPanel"
                @mousedown="isDraggingSV = true; handleSVMove($event)"
                class="relative w-64 h-52 rounded-xl cursor-crosshair overflow-hidden border border-zinc-200 dark:border-zinc-800"
                :style="{ backgroundColor: `hsl(${colorState.h}, 100%, 50%)` }"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-white to-transparent"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
              <div
                  class="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg -translate-x-1/2 translate-y-1/2 pointer-events-none"
                  :style="{ left: colorState.s + '%', bottom: colorState.v + '%' }"
              ></div>
            </div>

            <div
                @mousedown="handleHueMove($event)"
                class="w-4 h-52 rounded-full relative cursor-pointer bg-gradient-to-b from-[#f00] via-[#ff0] via-[#0f0] via-[#0ff] via-[#00f] via-[#f0f] to-[#f00]"
            >
              <div
                  class="absolute left-[-4px] right-[-4px] h-2 bg-white border border-zinc-400 rounded shadow-sm pointer-events-none"
                  :style="{ top: (colorState.h / 360 * 100) + '%' }"
              ></div>
            </div>
          </div>

          <div class="mt-6 flex items-center gap-3">
            <div class="flex-1 h-3 rounded-full relative bg-[repeating-conic-gradient(#e5e7eb_0%_25%,#fff_0%_50%)_50%_/_8px_8px] dark:bg-[repeating-conic-gradient(#3f3f46_0%_25%,#18181b_0%_50%)_50%_/_8px_8px]">
              <div class="absolute inset-0 rounded-full" :style="{ background: `linear-gradient(to right, transparent, ${hex})` }"></div>
              <input type="range" v-model="colorState.a" min="0" max="1" step="0.01" class="absolute inset-0 opacity-0 cursor-pointer w-full" />
              <div class="absolute w-4 h-4 bg-white border border-zinc-300 rounded-full shadow top-1/2 -translate-y-1/2 pointer-events-none" :style="{ left: (colorState.a * 100) + '%' }"></div>
            </div>
            <span class="text-[10px] font-mono text-zinc-500 w-8">{{ Math.round(colorState.a * 100) }}%</span>
          </div>
        </section>

        <section>
          <h2 class="text-xs font-black uppercase text-zinc-400 mb-4 tracking-widest">颜色值</h2>
          <div class="space-y-3">
            <div v-for="(val, type) in { HEX: hex, RGB: `rgb(${rgb.join(', ')})`, RGBA: `rgba(${rgb.join(', ')}, ${colorState.a})`, HSL: hsl, CMYK: cmyk }" :key="type"
                 class="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-xl group"
            >
              <span class="w-12 text-[10px] font-bold text-zinc-400">{{ type }}</span>
              <input readonly :value="val" class="flex-1 bg-transparent text-sm font-mono dark:text-zinc-200 outline-none" />
              <button class="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-blue-500 transition-opacity">📋</button>
            </div>
          </div>

          <h2 class="text-xs font-black uppercase text-zinc-400 mb-4 mt-8 tracking-widest">预览</h2>
          <div class="flex gap-4">
            <div class="flex-1 p-4 bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 rounded-2xl">
              <div class="h-20 w-full rounded-lg shadow-inner mb-2 transition-colors duration-200" :style="{ backgroundColor: hex, opacity: colorState.a }"></div>
              <p class="text-center font-mono text-xs dark:text-zinc-400">{{ hex }}</p>
            </div>
            <div class="flex-1 p-4 bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 rounded-2xl">
              <div class="h-20 w-full rounded-lg shadow-inner border border-zinc-200 dark:border-zinc-700 bg-white mb-2"></div>
              <p class="text-center font-mono text-xs dark:text-zinc-400">#FFFFFF</p>
            </div>
          </div>
        </section>
      </div>

      <footer class="pt-8 border-t border-zinc-100 dark:border-zinc-800">
        <h3 class="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-6">对比度检查 (WCAG 2.1)</h3>

        <div class="flex flex-wrap items-center gap-6 lg:gap-12">
          <div class="space-y-2">
            <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">前景色</label>
            <div class="color-input-field">
              <div class="w-6 h-6 rounded shadow-sm" :style="{ backgroundColor: currentColor }"></div>
              <input v-model="currentColor" class="bg-transparent font-mono text-sm dark:text-zinc-200 w-20 outline-none" />
            </div>
          </div>

          <button @click="swapColors" class="mt-6 p-2.5 rounded-full border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-95 group">
            <svg class="w-5 h-5 text-zinc-500 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4M7 4L3 8M7 4L11 8M17 8v12M17 20l4-4M17 20l-4-4" />
            </svg>
          </button>

          <div class="space-y-2">
            <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">背景色</label>
            <div class="color-input-field">
              <div class="w-6 h-6 rounded shadow-sm border border-zinc-200 dark:border-zinc-700" :style="{ backgroundColor: bgColor }"></div>
              <input v-model="bgColor" class="bg-transparent font-mono text-sm dark:text-zinc-200 w-20 outline-none" />
            </div>
          </div>

          <div class="ml-auto text-right min-w-[120px]">
            <p class="text-[10px] font-bold text-zinc-400 uppercase mb-1">对比度</p>
            <p class="text-3xl font-black text-zinc-900 dark:text-zinc-100">{{ contrastData.ratio }} : 1</p>

            <div class="flex flex-col items-end gap-1.5 mt-3">
              <span :class="[contrastData.aaLarge ? 'tag-pass' : 'tag-fail']">
                {{ contrastData.aaLarge ? 'AA (大号文本)' : '未通过 AA' }}
              </span>
              <span :class="[contrastData.aaaSmall ? 'tag-pass' : 'tag-fail']">
                {{ contrastData.aaaSmall ? '通过 AAA' : '未通过 AAA' }}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-medium border-t border-zinc-50 dark:border-zinc-800/50 pt-4">
          <span class="text-zinc-400 uppercase tracking-widest">ⓘ WCAG 标准:</span>
          <span class="text-zinc-500 dark:text-zinc-500">AA ≥ 4.5:1 (普通文本)</span>
          <span class="text-zinc-500 dark:text-zinc-500">AA ≥ 3:1 (大号文本)</span>
          <span class="text-zinc-500 dark:text-zinc-500">AAA ≥ 7:1 (普通文本)</span>
          <span class="text-zinc-500 dark:text-zinc-500">AAA ≥ 4.5:1 (大号文本)</span>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
@reference "@/style.css";

.color-input-field {
  @apply flex items-center gap-3 px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800 focus-within:border-blue-500 transition-colors;
}

.tag-pass {
  @apply px-2.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 rounded dark:bg-amber-900/30 dark:text-amber-500;
}

.tag-fail {
  @apply px-2.5 py-0.5 text-[10px] font-bold bg-zinc-100 text-zinc-400 rounded dark:bg-zinc-800 dark:text-zinc-600 line-through;
}

.btn-primary {
  @apply px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all;
}

.btn-secondary {
  @apply px-5 py-2.5 text-sm font-semibold border border-zinc-200 dark:border-zinc-700 dark:text-zinc-300 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition-all;
}

input[type=range] {
  -webkit-appearance: none;
  background: transparent;
}
input[type=range]:focus {
  outline: none;
}
</style>
