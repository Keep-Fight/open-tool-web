<script setup>
import { ref, onMounted } from 'vue';

// --- 状态定义 ---
const algorithm = ref('AES(高级加密标准)');
const keyLength = ref('256 bit (32 字节)');
const genMethod = ref('安全随机生成 (推荐)');
const outputFormat = ref('Hex');

const hexOutput = ref('');
const base64Output = ref('');

// 算法列表
const algorithms = ref([
  {
    name: 'AES(高级加密标准)',
    type: '对称加密',
    value: 'AES',
  },
  {
    name: 'DES/3DES(数据加密标准)',
    value: 'DES',
  },
  {
    name: 'RC5'
  },
  {
    name: 'IDEA'
  },
  {
    name: 'Blowfish'
  },
    {
    name: 'SM4'
  },
  {
    name: 'RSA'
  },
  {
    name: 'ECC'
  },
    {
    name: 'SM2'
  }
])

// --- 逻辑处理 ---

// 模拟生成逻辑 (使用 Web Crypto API 保证安全性)
const generateKey = () => {
  // 根据选择的长度获取字节数
  const lengthMatch = keyLength.value.match(/(\d+)\s*bit/);
  const bitLength = lengthMatch ? parseInt(lengthMatch[1]) : 256;
  const byteLength = bitLength / 8;

  const array = new Uint8Array(byteLength);
  window.crypto.getRandomValues(array);

  // 转换为 Hex
  const hex = Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

  // 转换为 Base64
  const base64 = btoa(String.fromCharCode(...array));

  hexOutput.value = hex;
  base64Output.value = base64;
};

const clearResults = () => {
  hexOutput.value = '';
  base64Output.value = '';
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    alert('已复制到剪贴板！');
  } catch (err) {
    console.error('复制失败', err);
  }
};

// 初始化生成
onMounted(() => {
  generateKey();
});
</script>

<template>
  <div class="w-full bg-white dark:bg-zinc-900 p-8  border-zinc-200 dark:border-zinc-800 ">
    <div class="mx-auto space-y-6">

      <div class="bg-white dark:bg-[#121214] rounded-xl border-slate-200 dark:border-[#27272a] overflow-hidden">

      </div>



      <div class="bg-white dark:bg-[#121214] rounded-xl shadow-sm border border-slate-200 dark:border-[#27272a] p-6 space-y-6">



          <p class="text-sm font-bold text-slate-800 dark:text-[#f1f1f1] mb-4 uppercase tracking-widest">密钥生成配置</p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
            <div class="space-y-2">
              <label class="text-[11px] text-slate-400 dark:text-[#a1a1aa] uppercase font-semibold tracking-wider">加密算法</label>
              <select v-model="algorithm" class="w-full bg-slate-50 dark:bg-[#1c1c1f] border border-slate-200 dark:border-[#3f3f46] p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#0066ff]/20 transition-all">
                <option>AES(高级加密标准)</option>
                <option>DES/3DES(数据加密标准)</option>
                <option>RC5</option>
                <option>IDEA</option>
                <option>Blowfish</option>
                <option>SM4</option>
                <option>RSA</option>
                <option>ECC</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-[11px] text-slate-400 dark:text-[#a1a1aa] uppercase font-semibold tracking-wider">密钥长度</label>
              <select v-model="keyLength" class="w-full bg-slate-50 dark:bg-[#1c1c1f] border border-slate-200 dark:border-[#3f3f46] p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#0066ff]/20 transition-all">
                <option>256 bit (32 字节)</option>
                <option>128 bit (16 字节)</option>
                <option>192 bit (24 字节)</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-[11px] text-slate-400 dark:text-[#a1a1aa] uppercase font-semibold tracking-wider">生成方式</label>
              <select v-model="genMethod" class="w-full bg-slate-50 dark:bg-[#1c1c1f] border border-slate-200 dark:border-[#3f3f46] p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#0066ff]/20 transition-all">
                <option>安全随机生成 (推荐)</option>
                <option>基于密码短语 (KDF)</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-[11px] text-slate-400 dark:text-[#a1a1aa] uppercase font-semibold tracking-wider block">优先显示格式</label>
              <div class="flex gap-4 items-center h-10">
                <label class="flex items-center gap-2 text-sm cursor-pointer group">
                  <input type="radio" value="Hex" v-model="outputFormat" class="w-4 h-4 text-[#0066ff] border-slate-300 dark:border-[#3f3f46] focus:ring-[#0066ff]">
                  <span class="group-hover:text-[#0066ff] transition-colors">Hex</span>
                </label>
                <label class="flex items-center gap-2 text-sm cursor-pointer group">
                  <input type="radio" value="Base64" v-model="outputFormat" class="w-4 h-4 text-[#0066ff] border-slate-300 dark:border-[#3f3f46] focus:ring-[#0066ff]">
                  <span class="group-hover:text-[#0066ff] transition-colors">Base64</span>
                </label>
              </div>
            </div>


            <div class="mt-8 flex flex-wrap gap-3 justify-end border-t border-slate-100 dark:border-[#27272a] pt-6">
              <button @click="clearResults" class="px-6 py-2.5 rounded-lg text-sm font-medium border border-slate-200 dark:border-[#3f3f46] hover:bg-slate-50 dark:hover:bg-[#1c1c1f] transition-all flex items-center gap-2">
                <i class="fa-solid fa-trash-can text-slate-400"></i> 清空结果
              </button>
              <button @click="generateKey" class="bg-[#0066ff] hover:brightness-110 text-white px-8 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-[#0066ff]/20 flex items-center gap-2">
                <i class="fa-solid fa-wand-magic-sparkles"></i> 生成密钥
              </button>
            </div>
          </div>


        <div class="bg-blue-50 dark:bg-[#0066ff]/10 border border-blue-100 dark:border-[#0066ff]/20 text-blue-600 dark:text-[#0066ff] p-4 rounded-lg flex items-start gap-3 text-xs leading-relaxed">
          <i class="fa-solid fa-circle-info mt-0.5"></i>
          <p>以下为当前算法生成的密钥信息，请妥善保管密钥。由于是在客户端生成，您的密钥不会被传输到服务器。</p>
        </div>

        <div>
          <p class="text-sm font-bold text-slate-800 dark:text-[#f1f1f1] mb-4 uppercase tracking-widest">密钥指纹信息</p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="(val, label) in { '算法': algorithm, '密钥类型': '对称密钥', '密钥长度': keyLength, '字符编码': 'UTF-8' }" :key="label" class="space-y-1">
              <label class="text-[10px] text-slate-400 dark:text-[#a1a1aa] uppercase tracking-tighter">{{ label }}</label>
              <div class="bg-slate-50 dark:bg-[#1c1c1f] border border-slate-100 dark:border-[#27272a] p-2.5 rounded-lg text-sm font-medium">
                {{ val }}
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6">
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <label class="text-[11px] text-slate-400 dark:text-[#a1a1aa] uppercase font-bold">公钥</label>
            </div>
            <div class="group relative">
              <textarea readonly :value="hexOutput" class="w-full bg-slate-50 dark:bg-[#0a0a0b] border border-slate-200 dark:border-[#27272a] p-4 pr-24 rounded-xl text-xs font-mono text-slate-600 dark:text-[#a1a1aa] focus:outline-none h-20 resize-none transition-colors"></textarea>
              <button @click="copyToClipboard(hexOutput)" class="absolute right-3 top-3 text-[11px] bg-white dark:bg-[#1c1c1f] border border-slate-200 dark:border-[#3f3f46] px-3 py-1.5 rounded-lg shadow-sm hover:bg-blue-50 dark:hover:bg-[#0066ff]/20 hover:text-[#0066ff] transition-all flex items-center gap-1.5">
                <i class="fa-regular fa-copy"></i> 复制
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-[11px] text-slate-400 dark:text-[#a1a1aa] uppercase font-bold">私钥</label>
            <div class="group relative">
              <textarea readonly :value="base64Output" class="w-full bg-slate-50 dark:bg-[#0a0a0b] border border-slate-200 dark:border-[#27272a] p-4 pr-24 rounded-xl text-xs font-mono text-slate-600 dark:text-[#a1a1aa] focus:outline-none h-20 resize-none transition-colors"></textarea>
              <button @click="copyToClipboard(base64Output)" class="absolute right-3 top-3 text-[11px] bg-white dark:bg-[#1c1c1f] border border-slate-200 dark:border-[#3f3f46] px-3 py-1.5 rounded-lg shadow-sm hover:bg-blue-50 dark:hover:bg-[#0066ff]/20 hover:text-[#0066ff] transition-all flex items-center gap-1.5">
                <i class="fa-regular fa-copy"></i> 复制
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-3">
          <h3 class="text-sm font-bold text-slate-800 dark:text-[#f1f1f1] flex items-center gap-2">
            <i class="fa-solid fa-book-open text-[#0066ff] text-xs"></i> 密钥说明
          </h3>
          <div class="bg-white dark:bg-[#121214] rounded-xl border border-slate-200 dark:border-[#27272a] overflow-hidden shadow-sm">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 dark:bg-[#1c1c1f] text-slate-500 dark:text-[#a1a1aa] font-medium">
              <tr>
                <th class="px-4 py-3">类型</th>
                <th class="px-4 py-3">说明</th>
                <th class="px-4 py-3">示例</th>
              </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-[#27272a] text-slate-600 dark:text-[#a1a1aa]">
              <tr v-for="item in [
                  { t: '对称密钥', d: '加解密使用相同密钥', e: 'AES, SM4' },
                  { t: '非对称公钥', d: '公开用于加密或验证', e: 'RSA, ECC' },
                  { t: '非对称私钥', d: '私有用于解密或签名', e: 'RSA, ECC' }
                ]" :key="item.t" class="hover:bg-slate-50/50 dark:hover:bg-[#1c1c1f]/50 transition-colors">
                <td class="px-4 py-3 font-semibold text-slate-700 dark:text-[#f1f1f1]">{{ item.t }}</td>
                <td class="px-4 py-3">{{ item.d }}</td>
                <td class="px-4 py-3 text-[#0066ff] dark:text-[#0066ff] font-medium">{{ item.e }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-sm font-bold text-slate-800 dark:text-[#f1f1f1] flex items-center gap-2">
            <i class="fa-solid fa-shield-halved text-emerald-500 text-xs"></i> 安全建议
          </h3>
          <div class="bg-white dark:bg-[#121214] p-5 rounded-xl border border-slate-200 dark:border-[#27272a]  shadow-sm">
            <ul class="space-y-3 text-xs text-slate-500 dark:text-[#a1a1aa] leading-relaxed">
              <li class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-[#0066ff] mt-1.5 shrink-0"></span>
                <span>建议使用 <strong class="text-slate-700 dark:text-[#f1f1f1] font-semibold">128 位及以上</strong> 的密钥长度 (AES 强烈推荐 256 位)。</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-[#0066ff] mt-1.5 shrink-0"></span>
                <span>密钥应通过安全的 <strong class="text-slate-700 dark:text-[#f1f1f1] font-semibold">CSPRNG</strong> (硬件级随机数生成器) 生成。</span>
              </li>
              <li class="flex items-start gap-2 text-red-500 dark:text-red-400 font-medium">
                <span class="w-1.5 h-1.5 rounded-full bg-[#0066ff] mt-1.5 shrink-0"></span>
                <span>请勿将密钥硬编码在前端代码或公开的配置文件中。</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-[#0066ff] mt-1.5 shrink-0"></span>
                <span>遵循密钥轮转机制，定期更换生产环境密钥。</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  </div>

</template>

<style scoped>
/* 针对 Inter 字体进行优化 */
:deep(select) {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}
</style>