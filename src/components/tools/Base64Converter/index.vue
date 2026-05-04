<script setup>
import { ref, computed } from 'vue';
import { useToast } from '@/composables/useToast';
import SvgIcon from '@/components/public/SvgIcon.vue';

const toast = useToast();

// 模式切换：'base64ToImg' (解码) 或 'imgToBase64' (编码)
const activeMode = ref('base64ToImg');

// --- Base64 转图片状态 ---
const base64Input = ref('');

const formattedImgSrc = computed(() => {
  if (!base64Input.value) return '';
  let val = base64Input.value.trim();
  // 如果没有 Data URL 前缀，尝试补全
  if (!val.startsWith('data:image')) {
    return `data:image/png;base64,${val}`;
  }
  return val;
});

// --- 图片转 Base64 状态 ---
const generatedBase64 = ref('');
const previewImage = ref('');
const outputFormat = ref('dataUrl'); // 'dataUrl' 或 'pure'
const fileInfo = ref({ name: '', size: '', width: 0, height: 0 });

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  fileInfo.value.name = file.name;
  fileInfo.value.size = (file.size / 1024 / 1024).toFixed(2) + ' MB';

  const reader = new FileReader();
  reader.onload = (e) => {
    const result = e.target.result;
    previewImage.value = result;
    generatedBase64.value = result;

    const img = new Image();
    img.onload = () => {
      fileInfo.value.width = img.width;
      fileInfo.value.height = img.height;
    };
    img.src = result;
  };
  reader.readAsDataURL(file);
};

const clearImage = () => {
  previewImage.value = '';
  generatedBase64.value = '';
  fileInfo.value = { name: '', size: '', width: 0, height: 0 };
};

// --- 通用工具逻辑 ---
const copyToClipboard = async (text) => {
  try {
    const content = outputFormat.value === 'pure' && activeMode.value === 'imgToBase64'
        ? text.split(',')[1]
        : text;
    await navigator.clipboard.writeText(content);
    toast.success('已复制到剪贴板');
  } catch (err) {
    toast.error('复制失败');
  }
};

const downloadImage = () => {
  if (!formattedImgSrc.value) return;
  const link = document.createElement('a');
  link.href = formattedImgSrc.value;
  link.download = `converted-image-${Date.now()}.png`;
  link.click();
};

const downloadText = () => {
  const content = outputFormat.value === 'pure'
      ? generatedBase64.value.split(',')[1]
      : generatedBase64.value;
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `base64-output.txt`;
  link.click();
  URL.revokeObjectURL(url);
};
</script>

<template>
  <div class="h-full bg-card-window-body p-6 ">
      <!-- 导航 Tabs -->
      <div class="flex border-b border-gray-100 dark:border-outline-variant mb-6">
        <button
            @click="activeMode = 'base64ToImg'"
            :class="['flex items-center gap-2 px-6 py-3 cursor-pointer border-b-2 transition-all', activeMode === 'base64ToImg' ? 'border-primary text-primary' : 'border-transparent text-gray-500 dark:text-on-surface-variant hover:text-primary']"
        >
          <SvgIcon name="base64-converter" className="text-xl w-7 h-7" />
          <div class="text-left">
            <div class="font-medium leading-none">Base64转图片</div>
            <div class="text-[10px] mt-1 opacity-70">解码还原</div>
          </div>
        </button>

        <button
            @click="activeMode = 'imgToBase64'"
            :class="['flex items-center gap-2 px-6 py-3 cursor-pointer border-b-2 transition-all', activeMode === 'imgToBase64' ? 'border-primary text-primary' : 'border-transparent text-gray-500 dark:text-on-surface-variant hover:text-primary']"
        >
          <SvgIcon name="image" className="text-xl w-7 h-7"/>
          <div class="text-left">
            <div class="font-medium leading-none">图片转Base64</div>
            <div class="text-[10px] mt-1 opacity-70">编码转换</div>
          </div>
        </button>
      </div>

      <!-- 核心交互区域 -->
      <div class="min-h-[500px] flex flex-col lg:flex-row items-stretch gap-6">

        <!-- 左侧输入/上传区 -->
        <div class="flex-1 border border-gray-200 dark:border-outline-variant rounded-lg p-5 flex flex-col bg-gray-50/50 dark:bg-surface-container">
          <h3 class="font-medium mb-4 flex items-center gap-2">
            <span class="w-1 h-4 bg-primary rounded-full"></span>
            {{ activeMode === 'base64ToImg' ? 'Base64 输入' : '图片上传' }}
          </h3>

          <!-- 解码输入 -->
          <div v-show="activeMode === 'base64ToImg'" class="flex-1 flex flex-col">
            <div class="relative flex-1">
              <textarea
                  v-model="base64Input"
                  class="w-full h-full min-h-[300px] p-4 border border-gray-200 dark:border-outline bg-white dark:bg-surface rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm break-all font-mono"
                  placeholder="请输入 Base64 字符串..."
              ></textarea>
              <button @click="base64Input = ''" class="absolute top-3 right-3 text-primary text-sm hover:underline">清空</button>
            </div>
          </div>

          <!-- 编码上传 -->
          <div v-show="activeMode === 'imgToBase64'" class="flex-1 flex flex-col">
            <label class="flex-1 border-2 border-dashed border-gray-300 dark:border-outline-variant rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
              <div class="bg-primary/10 text-primary p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <SvgIcon name="cloud-upload" className="text-4xl" />
              </div>
              <p class="font-medium mb-1">点击或拖拽图片</p>
              <p class="text-xs text-gray-400">支持主流格式，最大 10MB</p>
              <input type="file" class="hidden" accept="image/*" @change="handleFileUpload">
            </label>

            <!-- 预览[cite: 1] -->
            <div v-if="previewImage" class="mt-4 border border-gray-200 dark:border-outline-variant rounded-lg p-3 bg-white dark:bg-surface flex items-center gap-4">
              <img :src="previewImage" class="w-16 h-16 object-cover rounded border dark:border-outline-variant">
              <div class="flex-1 text-sm overflow-hidden">
                <p class="font-medium truncate">{{ fileInfo.name }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ fileInfo.size }} • {{ fileInfo.width }}x{{ fileInfo.height }}</p>
              </div>
              <button @click="clearImage" class="text-gray-400 hover:text-red-500 p-2"><SvgIcon name="delete" className="w-5 h-5" /></button>
            </div>
          </div>
        </div>

        <!-- 转换结果区 -->
        <div class="flex-1 border border-gray-200 dark:border-outline-variant rounded-lg p-5 flex flex-col bg-gray-50/50 dark:bg-surface-container">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-medium flex items-center gap-2">
              <span class="w-1 h-4 bg-primary rounded-full"></span>
              转换结果
            </h3>
          </div>

          <!-- 解码结果 (图片展示)[cite: 1] -->
          <div v-show="activeMode === 'base64ToImg'" class="flex-1 flex flex-col">
            <div class="flex-1 border border-gray-200 dark:border-outline bg-white dark:bg-background rounded-lg p-2 flex items-center justify-center min-h-[300px] overflow-hidden relative group">
              <img v-if="formattedImgSrc" :src="formattedImgSrc" class="max-w-full max-h-full object-contain">
              <div v-else class="text-gray-400 text-sm flex flex-col items-center gap-2">
                <SvgIcon name="image-not-supported" className="text-4xl opacity-20" />
                等待输入...
              </div>
            </div>
            <div class="mt-4 grid grid-cols-2 gap-3">
              <button @click="downloadImage" class="bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <SvgIcon name="download" className="text-sm" />下载图片
              </button>
              <button @click="copyToClipboard(base64Input)" class="border border-gray-200 dark:border-outline-variant py-2.5 rounded-lg text-sm hover:bg-white dark:hover:bg-surface-container-high transition-all flex items-center justify-center gap-2">
                <SvgIcon name="content-copy" className="text-sm" />复制源码
              </button>
            </div>
          </div>

          <!-- 编码结果 (文本框)[cite: 1] -->
          <div v-show="activeMode === 'imgToBase64'" class="flex-1 flex flex-col">
            <div class="flex gap-4 mb-3 text-xs">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="outputFormat" value="dataUrl" class="text-primary focus:ring-primary bg-transparent"> Data URL
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="outputFormat" value="pure" class="text-primary focus:ring-primary bg-transparent"> 纯 Base64
              </label>
            </div>
            <div class="relative flex-1">
              <textarea
                  readonly
                  :value="outputFormat === 'pure' ? generatedBase64.split(',')[1] : generatedBase64"
                  class="w-full h-full min-h-[260px] p-4 border border-gray-200 dark:border-outline bg-white dark:bg-surface rounded-lg resize-none focus:outline-none text-xs break-all font-mono text-gray-500 dark:text-on-surface-variant"
                  placeholder="等待上传..."
              ></textarea>
            </div>
            <div class="mt-4 flex gap-3">
              <button @click="copyToClipboard(generatedBase64)" class="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2">
                <SvgIcon name="content-copy" className="text-sm" />复制结果
              </button>
              <button @click="downloadText" class="border border-card-window-border px-4 py-2.5 rounded-lg text-sm bg-card-window-btn hover:bg-primary/30 transition-all">
                <SvgIcon name="file-download" className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部提示区[cite: 2] -->
      <footer class="mt-8 pt-6 border-t border-gray-100 dark:border-outline-variant grid md:grid-cols-2 gap-8 text-sm">
        <div>
          <h4 class="font-bold mb-3 text-primary uppercase tracking-wider text-xs">使用指南</h4>
          <ul class="text-gray-500 dark:text-on-surface-variant space-y-2 leading-relaxed">
            <li>• <strong>Data URL：</strong> 包含 MIME 类型前缀，可直接用于 HTML <code>&lt;img&gt;</code> 标签。</li>
            <li>• <strong>离线处理：</strong> 所有转换逻辑均在本地完成，不会将您的图片上传到服务器。</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-3 text-primary uppercase tracking-wider text-xs">支持格式</h4>
          <div class="flex flex-wrap gap-2">
            <span v-for="fmt in ['JPG', 'PNG', 'WEBP', 'SVG', 'GIF']" :key="fmt"
                  class="px-2 py-1 bg-card-window-btn    rounded text-[10px] font-bold border border-card-window-border text-card-window-text">
              {{ fmt }}
            </span>
          </div>
        </div>
      </footer>
    </div>
</template>

<style scoped>
/* 针对 Tailwind 4 的兼容性微调 */
textarea {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 102, 255, 0.2) transparent;
}
</style>