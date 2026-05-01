<template>
    <div class="mx-auto space-y-6  bg-card-window-body">

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div class="p-6 transition-all duration-300">
          <h2 class="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">edit_square</span>
            输入内容
          </h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-on-surface-variant mb-2">内容类型</label>
              <div class="relative">
                <select
                    v-model="qrConfig.type"
                    class="w-full -high border border-outline-variant rounded-lg px-4 py-2.5 appearance-none focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
                >
                  <option value="text">文本 / 链接</option>
                  <option value="wifi">WiFi</option>
                  <option value="vcard">名片</option>
                </select>
                <span class="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-on-surface-variant mb-2">内容详情</label>
              <div class="relative">
                <textarea
                    v-model="qrConfig.content"
                    class="w-full -high border border-outline-variant rounded-lg px-4 py-3 h-64 focus:outline-none focus:ring-1 focus:ring-primary resize-none text-on-surface placeholder:text-on-surface-variant/30"
                    placeholder="请输入链接或文本内容..."
                ></textarea>
                <span class="absolute bottom-3 right-4 text-xs text-on-surface-variant">
                  {{ qrConfig.content.length }} / 2000
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 transition-all duration-300 flex flex-col">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-bold text-on-surface">预览中心</h2>
            <div class="flex gap-3">
              <button @click="clearContent" class="flex items-center text-sm text-on-surface-variant hover:text-primary transition-colors">
                <span class="material-symbols-outlined text-sm mr-1">delete</span> 清空
              </button>
              <button class="flex items-center text-sm text-primary hover:brightness-110 transition-all">
                <span class="material-symbols-outlined text-sm mr-1">refresh</span> 实时刷新
              </button>
            </div>
          </div>

          <div class="  flex-grow flex items-center justify-center py-8">
            <div class="p-4 bg-white  shadow-black/30 dark:shadow-white/20  shadow-2xl  card  ">
              <img
                  :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrConfig.content || ' ')}`"
                  alt="QR Code"
                  class="w-48 h-48"
              >
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
            <button class="flex items-center justify-center bg-primary text-white py-3 rounded-lg font-semibold hover:brightness-110 transition-all active:scale-[0.98]">
              <span class="material-symbols-outlined mr-2">download</span> 下载
            </button>
            <button @click="copyImage" class="flex items-center justify-center -high border border-outline-variant text-on-surface py-3 rounded-lg hover:bg-outline-variant transition-colors">
              <span class="material-symbols-outlined mr-2">content_copy</span> 复制
            </button>
          </div>
        </div>
      </div>

      <div class="p-6 transition-all duration-300">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-lg font-bold text-on-surface">高级样式定制</h2>
          <label class="flex items-center text-sm text-on-surface-variant cursor-pointer group">
            <input type="checkbox" v-model="qrConfig.rounded" class="mr-2 w-4 h-4 rounded border-outline-variant -high text-primary focus:ring-primary">
            <span class="group-hover:text-on-surface transition-colors">圆角样式</span>
          </label>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div class="space-y-2">
            <label class="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">纠错等级</label>
            <select v-model="qrConfig.level" class="w-full -high border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary">
              <option>M (适中)</option>
              <option>H (最高)</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">尺寸</label>
            <select v-model="qrConfig.size" class="w-full -high border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary">
              <option>300 x 300</option>
              <option>500 x 500</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">前景色</label>
            <div class="flex items-center -high border border-outline-variant rounded-lg px-3 py-2 space-x-2">
              <div class="w-4 h-4 rounded" :style="{ backgroundColor: qrConfig.foreground }"></div>
              <span class="text-sm text-on-surface uppercase">{{ qrConfig.foreground }}</span>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">背景色</label>
            <div class="flex items-center -high border border-outline-variant rounded-lg px-3 py-2 space-x-2">
              <div class="w-4 h-4 rounded border border-outline-variant" :style="{ backgroundColor: qrConfig.background }"></div>
              <span class="text-sm text-on-surface uppercase">{{ qrConfig.background }}</span>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">内边距</label>
            <select v-model="qrConfig.margin" class="w-full -high border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary">
              <option>中 (16px)</option>
              <option>小 (8px)</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">LOGO</label>
            <div class="w-full border border-dashed border-outline-variant rounded-lg py-2 flex items-center justify-center text-sm text-on-surface-variant cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
              <span class="material-symbols-outlined text-sm mr-2">add_photo_alternate</span> 上传
            </div>
          </div>
        </div>
      </div>

    </div>
</template>

<script setup>
import { reactive } from 'vue'

// 响应式配置对象
const qrConfig = reactive({
  type: 'text',
  content: 'https://toolbox.example.com',
  level: 'M (适中)',
  size: '300 x 300',
  foreground: '#0066ff',
  background: '#ffffff',
  margin: '中 (16px)',
  rounded: false
})

// 清空内容
const clearContent = () => {
  qrConfig.content = ''
}

// 复制链接功能
const copyImage = () => {
  if (qrConfig.content) {
    navigator.clipboard.writeText(qrConfig.content)
    alert('内容已复制到剪贴板')
  }
}
</script>

<style scoped>
/* 继承自 opentoolbox-dark.html 的色彩规范 */
:deep(.bg-background) { background-color: #0a0a0b; }
:deep(.text-primary) { color: #0066ff; }
:deep(.bg-primary) { background-color: #0066ff; }

/* 交互发光效果 */
.card-glow:hover {
  box-shadow: 0 0 20px rgba(0, 102, 255, 0.12);
}

/* 隐藏滚动条 */
textarea::-webkit-scrollbar {
  width: 4px;
}
textarea::-webkit-scrollbar-thumb {
  background: #3f3f46;
  border-radius: 10px;
}
</style>
