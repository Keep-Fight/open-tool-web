<template>
  <div class="h-full p-6 bg-card-window-body overflow-auto">
    <div class="mx-auto space-y-6">

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
                    class="bg-card-window-body w-full border border-outline-variant rounded-lg px-4 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-primary text-on-surface "
                >
                  <option value="text">文本 / 链接</option>
                  <option value="wifi">WiFi</option>
                  <option value="vcard">名片 (vCard)</option>
                </select>
                <span class="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
            </div>
            <div v-if="qrConfig.logoPreview">
              <label class="block text-sm font-medium text-on-surface-variant mb-2">LOGO 预览</label>
              <div class="relative w-full h-32 border border-outline-variant rounded-lg overflow-hidden bg-gray-50 dark:bg-[#27272a]">
                <img :src="qrConfig.logoPreview" alt="Logo Preview" class="w-full h-full object-contain">
                <button @click="removeLogo" class="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <span class="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            </div>
            <div v-else>
              <label class="block text-sm font-medium text-on-surface-variant mb-2">LOGO (可选)</label>
              <label class="w-full border border-dashed border-outline-variant rounded-lg py-4 flex items-center justify-center text-sm text-on-surface-variant cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                <input type="file" accept="image/*" @change="handleLogoUpload" class="hidden">
                <span class="material-symbols-outlined text-sm mr-2">add_photo_alternate</span> 添加 LOGO
              </label>
            </div>

            <div v-if="qrConfig.type === 'wifi'">
              <label class="block text-sm font-medium text-on-surface-variant mb-2">WiFi 名称 (SSID)</label>
              <input v-model="qrConfig.ssid" type="text" placeholder="WiFi名称"
                     class="w-full border border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface ">
            </div>

            <div v-if="qrConfig.type === 'wifi'">
              <label class="block text-sm font-medium text-on-surface-variant mb-2">密码</label>
              <input v-model="qrConfig.password" type="text" placeholder="WiFi密码"
                     class="w-full border border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface ">
            </div>

            <div v-if="qrConfig.type === 'wifi'">
              <label class="block text-sm font-medium text-on-surface-variant mb-2">加密类型</label>
              <select v-model="qrConfig.hidden" class="bg-card-window-body w-full border border-outline-variant rounded-lg px-4 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-primary text-on-surface ">
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">无密码</option>
              </select>
            </div>

            <div v-if="qrConfig.type === 'vcard'">
              <label class="block text-sm font-medium text-on-surface-variant mb-2">姓名</label>
              <input v-model="qrConfig.name" type="text" placeholder="姓名"
                     class="w-full border border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface ">
            </div>

            <div v-if="qrConfig.type === 'vcard'">
              <label class="block text-sm font-medium text-on-surface-variant mb-2">电话</label>
              <input v-model="qrConfig.phone" type="text" placeholder="电话"
                     class="w-full border border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface ">
            </div>

            <div v-if="qrConfig.type === 'vcard'">
              <label class="block text-sm font-medium text-on-surface-variant mb-2">邮箱</label>
              <input v-model="qrConfig.email" type="text" placeholder="邮箱"
                     class="w-full border border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface ">
            </div>

            <div>
              <label class="block text-sm font-medium text-on-surface-variant mb-2">
                {{ qrConfig.type === 'text' ? '内容详情' : qrConfig.type === 'wifi' ? '备注 (可选)' : '公司 (可选)' }}
              </label>
              <div class="relative">
                <textarea
                    v-model="qrConfig.content"
                    class="w-full border border-outline-variant rounded-lg px-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-primary resize-none text-on-surface placeholder:text-on-surface-variant/30 "
                    placeholder="请输入内容..."
                    maxlength="500"
                ></textarea>
                <span class="absolute bottom-3 right-4 text-xs text-on-surface-variant">
                  {{ qrConfig.content.length }} / 500
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6    transition-all duration-300 flex flex-col">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-bold text-on-surface">预览中心</h2>
            <button @click="clearContent" class="flex items-center text-sm text-on-surface-variant hover:text-primary transition-colors">
              <span class="material-symbols-outlined text-sm mr-1">delete</span> 清空
            </button>
          </div>

          <div class="flex-grow flex items-center justify-center py-8">
            <div class="p-4 bg-white  shadow-lg dark:shadow-black/50">
              <canvas ref="qrCanvas" class="w-48 h-48"></canvas>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mt-4">
            <button @click="downloadQR" class="flex items-center justify-center bg-[#0066ff] text-white py-3 rounded-lg font-semibold hover:brightness-110 transition-all active:scale-[0.98]">
              <span class="material-symbols-outlined mr-2">download</span> 下载
            </button>
            <button @click="copyImage" class="flex items-center justify-center border border-outline-variant text-on-surface py-3 rounded-lg hover:bg-outline-variant/30 transition-colors">
              <span class="material-symbols-outlined mr-2">content_copy</span> 复制
            </button>
          </div>
        </div>
      </div>

      <div class="p-6    transition-all duration-300">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-lg font-bold text-on-surface">高级样式定制</h2>
          <label class="flex items-center text-sm text-on-surface-variant cursor-pointer group">
            <input type="checkbox" v-model="qrConfig.rounded" class="mr-2 w-4 h-4 rounded border-outline-variant accent-[#0066ff]">
            <span class="group-hover:text-on-surface transition-colors">圆角样式</span>
          </label>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div class="space-y-2">
            <label class="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">纠错等级</label>
            <select v-model="qrConfig.level" class="bg-card-window-body w-full border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none ">
              <option value="L">L (低)</option>
              <option value="M">M (中)</option>
              <option value="Q">Q (较高)</option>
              <option value="H">H (高)</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">尺寸</label>
            <select v-model="qrConfig.size" class="bg-card-window-body w-full border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none ">
              <option value="200">200 x 200</option>
              <option value="300">300 x 300</option>
              <option value="500">500 x 500</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">前景色</label>
            <div class="flex items-center border border-outline-variant rounded-lg px-3 py-2 space-x-2">
              <input type="color" v-model="qrConfig.foreground" class="w-6 h-6 rounded cursor-pointer border-0 p-0">
              <span class="text-sm text-on-surface uppercase">{{ qrConfig.foreground }}</span>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">背景色</label>
            <div class="flex items-center border border-outline-variant rounded-lg px-3 py-2 space-x-2">
              <input type="color" v-model="qrConfig.background" class="w-6 h-6 rounded cursor-pointer border-0 p-0">
              <span class="text-sm text-on-surface uppercase">{{ qrConfig.background }}</span>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">内边距</label>
            <select v-model="qrConfig.margin" class="bg-card-window-body w-full border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none ">
              <option value="0">无</option>
              <option value="4">小 (4px)</option>
              <option value="8">中 (8px)</option>
              <option value="12">大 (12px)</option>
            </select>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import {ref, reactive, watch, onMounted, nextTick} from 'vue'
import QRCode from 'qrcode'

const qrCanvas = ref(null)
const qrConfig = reactive({
  type: 'text',
  content: 'https://www.opentoolbox.cn',
  ssid: '',
  password: '',
  hidden: 'WPA',
  name: '',
  phone: '',
  email: '',
  level: 'H',
  size: 200,
  foreground: '#000000',
  background: '#ffffff',
  margin: 0,
  rounded: false,
  logo: null,
  logoPreview: null
})

const generateWifiString = () => {
  const {ssid, password, hidden} = qrConfig
  const escapedSsid = ssid.replace(/[,;\\:"']/g, '\\$&')
  const escapedPassword = password.replace(/[,;\\:"']/g, '\\$&')
  return `WIFI:T:${qrConfig.hidden};S:${escapedSsid};P:${escapedPassword};H:${hidden === 'nopass' ? 'false' : 'true'};;`
}

const generateVCardString = () => {
  const {name, phone, email} = qrConfig
  return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`
}

const getQRContent = () => {
  if (qrConfig.type === 'wifi') {
    return generateWifiString()
  } else if (qrConfig.type === 'vcard') {
    return generateVCardString()
  }
  return qrConfig.content
}

const drawQR = async () => {
  if (!qrCanvas.value) return

  const content = getQRContent()
  if (!content) {
    const ctx = qrCanvas.value.getContext('2d')
    ctx.clearRect(0, 0, qrCanvas.value.width, qrCanvas.value.height)
    return
  }

  const options = {
    errorCorrectionLevel: qrConfig.level,
    width: qrConfig.size,
    margin: qrConfig.margin,
    color: {
      dark: qrConfig.foreground,
      light: qrConfig.background
    }
  }

  try {
    await QRCode.toCanvas(qrCanvas.value, content, options)

    if (qrConfig.rounded) {
      const ctx = qrCanvas.value.getContext('2d')
      const imageData = ctx.getImageData(0, 0, qrCanvas.value.width, qrCanvas.value.height)
      const size = imageData.width
      const radius = Math.floor(size * 0.15)
      const imageDataWithRadius = roundedImageData(imageData, radius)
      ctx.putImageData(imageDataWithRadius, 0, 0)
    }

    if (qrConfig.logo) {
      await drawLogo()
    }
  } catch (err) {
    console.error('QR generation failed:', err)
  }
}

const roundedImageData = (imageData, radius) => {
  const pixels = imageData.data
  const width = imageData.width
  const height = imageData.height
  const newImageData = new ImageData(width, height)
  const newPixels = newImageData.data

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const inCorner = isInCorner(x, y, width, height, radius)

      if (inCorner !== null) {
        const dist = getCornerDistance(x, y, width, height, radius)
        if (dist > radius) {
          newPixels[idx] = 0
          newPixels[idx + 1] = 0
          newPixels[idx + 2] = 0
          newPixels[idx + 3] = 0
        } else {
          const alpha = Math.max(0, 255 - (dist - radius) * 5)
          newPixels[idx] = pixels[idx]
          newPixels[idx + 1] = pixels[idx + 1]
          newPixels[idx + 2] = pixels[idx + 2]
          newPixels[idx + 3] = pixels[idx + 3] * (alpha / 255)
        }
      } else {
        newPixels[idx] = pixels[idx]
        newPixels[idx + 1] = pixels[idx + 1]
        newPixels[idx + 2] = pixels[idx + 2]
        newPixels[idx + 3] = pixels[idx + 3]
      }
    }
  }

  return newImageData
}

const isInCorner = (x, y, width, height, radius) => {
  const corners = [
    [radius, radius],
    [width - radius - 1, radius],
    [radius, height - radius - 1],
    [width - radius - 1, height - radius - 1]
  ]

  for (const [cx, cy] of corners) {
    const dx = x - cx
    const dy = y - cy
    if (dx * dx + dy * dy <= radius * radius) {
      return [cx, cy]
    }
  }
  return null
}

const getCornerDistance = (x, y, width, height, radius) => {
  const corners = [
    [radius, radius],
    [width - radius - 1, radius],
    [radius, height - radius - 1],
    [width - radius - 1, height - radius - 1]
  ]

  let minDist = Infinity
  for (const [cx, cy] of corners) {
    const dx = x - cx
    const dy = y - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    minDist = Math.min(minDist, dist)
  }
  return minDist
}

const drawLogo = async () => {
  if (!qrConfig.logo || !qrCanvas.value) return

  const ctx = qrCanvas.value.getContext('2d')
  const logoSize = qrConfig.size * 0.2
  const logoX = (qrConfig.size - logoSize) / 2
  const logoY = (qrConfig.size - logoSize) / 2

  const img = new Image()
  img.src = qrConfig.logo
  await img.decode()

  ctx.drawImage(img, logoX, logoY, logoSize, logoSize)
}

const handleLogoUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    qrConfig.logo = event.target.result
    qrConfig.logoPreview = event.target.result
  }
  reader.readAsDataURL(file)
}

const removeLogo = () => {
  qrConfig.logo = null
  qrConfig.logoPreview = null
}

const clearContent = () => {
  qrConfig.content = ''
  qrConfig.ssid = ''
  qrConfig.password = ''
  qrConfig.name = ''
  qrConfig.phone = ''
  qrConfig.email = ''
  qrConfig.logo = null
  qrConfig.logoPreview = null
  qrCanvas.value?.getContext('2d')?.clearRect(0, 0, qrConfig.size, qrConfig.size)
}

const downloadQR = () => {
  if (!qrCanvas.value) return

  const link = document.createElement('a')
  link.download = `qrcode-${Date.now()}.png`
  link.href = qrCanvas.value.toDataURL('image/png')
  link.click()
}

const copyImage = async () => {
  if (!qrCanvas.value) return

  try {
    const blob = await new Promise(resolve => qrCanvas.value.toBlob(resolve, 'image/png'))
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ])
  } catch (err) {
    console.error('Copy failed:', err)
  }
}

watch(qrConfig, () => {
  nextTick(() => drawQR())
}, { deep: true })

onMounted(() => {
  nextTick(() => drawQR())
})
</script>

<style scoped>
:deep(.bg-background) { background-color: #0a0a0b; }
:deep(.text-primary) { color: #0066ff; }
:deep(.bg-primary) { background-color: #0066ff; }

textarea::-webkit-scrollbar,
input::-webkit-scrollbar {
  width: 4px;
}
textarea::-webkit-scrollbar-thumb,
input::-webkit-scrollbar-thumb {
  background: #3f3f46;
  border-radius: 10px;
}
</style>