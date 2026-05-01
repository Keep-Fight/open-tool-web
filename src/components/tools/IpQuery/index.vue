<script setup>
import {ref, onMounted, reactive} from 'vue';
import {toolApi} from '@/api/toolApi.js'

// --- 状态管理 ---
const myIpInfo = reactive({
  ip: '加载中...',
  location: '定位中...',
  isp: '获取中...',
  status: 'checking',
  lastUpdate: ''
});

// --- 输入数据---
const searchDomainName = ref('');
const searchIp = ref([]);

const result = ref({});
const isLoading = ref(false);

// --- 常用 IP 预设 ---
const commonIps = [
  {label: '8.8.8.8', desc: 'Google DNS'},
  {label: '1.1.1.1', desc: 'Cloudflare DNS'},
  {label: '114.114.114.114', desc: '国内 DNS'},
  {label: '223.5.5.5', desc: '阿里 DNS'},
  {label: '8.8.4.4', desc: 'Google DNS'},
  {label: '208.67.222.222', desc: 'OpenDNS'}
];

// --- 核心查询逻辑 ---

// 获取我的公网 IP 详情
const fetchMyIpInfo = async () => {
  myIpInfo.status = 'checking';
  try {
    // 1. 先获取 IP 地址
    const res = await toolApi.getIpAddress();
    myIpInfo.ip = res.data;
    console.log( '获取公网 IP:', res)

    // TODO 档后端返回接口获取不到信息是，通过下面注释掉的方法获取
    // const res = await fetch('https://api.ipify.org?format=json');
    // const { ip } = await res.json();
    // myIpInfo.ip = ip;


    // 2. 获取地理位置和运营商
    const detailRes = await fetch(`http://ip-api.com/json/${ip}?lang=zh-CN`);
    const data = await detailRes.json();

    myIpInfo.location = `${data.country} · ${data.regionName} · ${data.city}`;
    myIpInfo.isp = data.isp;
    myIpInfo.status = 'normal';
    myIpInfo.lastUpdate = new Date().toLocaleString();
  } catch (error) {
    myIpInfo.status = 'error';
    myIpInfo.ip = '获取失败';
  }
};

// 根据 IP 或域名执行查询
const handleSearch = async (target = searchDomainName.value) => {
  if (!target) return;
  isLoading.value = true;
  try {
    // 使用 ip-api.com 接口支持 IP 和 域名查询
    const res = await fetch(`http://ip-api.com/json/${target}?lang=zh-CN&fields=status,message,country,regionName,city,isp,org,as,lat,lon,timezone,proxy,hosting,query`);
    const data = await res.json();

    if (data.status === 'success') {
      result.value = {
        ip: data.query,
        location: `${data.country} ${data.regionName} ${data.city}`,
        isp: data.isp,
        org: data.org || data.as,
        latLon: `${data.lat.toFixed(4)}, ${data.lon.toFixed(4)}`,
        timezone: data.timezone,
        isProxy: data.proxy ? '是' : '否',
        usageType: data.hosting ? '数据中心' : '宽带/移动网络',
        ipType: '原生 IP'
      };
    } else {
      alert('查询失败，请输入正确的 IP 或域名');
    }
  } catch (error) {
    console.error('查询出错:', error);
  } finally {
    isLoading.value = false;
  }
};

// 导出结果
const exportResult = () => {
  if (!result.value) return;
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result.value, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", `ip_result_${result.value.ip}.json`);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

onMounted(() => {
  fetchMyIpInfo();
});
</script>

<template>
  <div class="bg-card-window-body transition-colors duration-300">
    <div class=" mx-auto space-y-6">

      <div class="grid grid-cols-1 lg:grid-cols-5">

        <div class="lg:col-span-3 space-y-6 shadow-sm">
          <div class="p-6 transition-all">
            <label class="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-3">IP 地址查询</label>
            <div class="flex gap-2">
              <input
                  v-model="searchDomainName"
                  @keyup.enter="handleSearch()"
                  type="text"
                  placeholder="请输入 IP 地址或域名，例如：8.8.8.8 或 google.com"
                  class="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-zinc-800 dark:text-zinc-100 transition-all"
              >
              <button
                  @click="handleSearch()"
                  :disabled="isLoading"
                  class="px-8 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {{ isLoading ? '查询中...' : '查询' }}
              </button>
            </div>
            <p class="mt-3 text-xs text-slate-400 dark:text-zinc-500 font-mono">支持 IPv4、IPv6 地址</p>
          </div>
          <div class="p-6 transition-all">
            <label class="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-3">域名查询</label>
            <div class="flex gap-2">
              <input
                  v-model="searchIp"
                  @keyup.enter="handleSearch()"
                  type="text"
                  placeholder="请输入 IP 地址或域名，例如：8.8.8.8 或 google.com"
                  class="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-zinc-800 dark:text-zinc-100 transition-all"
              >
              <button
                  @click="handleSearch()"
                  :disabled="isLoading"
                  class="px-8 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {{ isLoading ? '查询中...' : '查询' }}
              </button>
            </div>
            <p class="mt-3 text-xs text-slate-400 dark:text-zinc-500 font-mono">全球域名查询</p>
          </div>
        </div>

        <div class="lg:col-span-2">
          <div class=" p-6 shadow-sm border-l border-slate-100 dark:border-zinc-800 h-full">
            <div class="flex justify-between items-center mb-6">
              <h2 class="font-bold text-slate-800 dark:text-zinc-200">我的公网 IP</h2>
              <button @click="fetchMyIpInfo" class="text-blue-500 text-xs flex items-center gap-1 hover:text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4"
                     :class="{'animate-spin': myIpInfo.status === 'checking'}" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                刷新
              </button>
            </div>
            <div class="mb-6">
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1 break-all">{{ myIpInfo.ip }}</div>
              <span
                  class="px-2 py-0.5 text-xs rounded-md"
                  :class="myIpInfo.status === 'normal' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-600'"
              >
                {{ myIpInfo.status === 'normal' ? '正常' : '检测中' }}
              </span>
            </div>
            <div class="space-y-3 text-sm border-t border-slate-50 dark:border-zinc-800 pt-4">
              <div class="flex justify-between gap-2">
                <span class="text-slate-400 dark:text-zinc-500 shrink-0">归属地</span>
                <span class="text-slate-700 dark:text-zinc-300 text-right">{{ myIpInfo.location }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400 dark:text-zinc-500">运营商</span>
                <span class="text-slate-700 dark:text-zinc-300">{{ myIpInfo.isp }}</span>
              </div>
              <div class="mt-4 pt-2">
                <span class="text-slate-400 dark:text-zinc-600 text-[10px] font-mono">{{ myIpInfo.lastUpdate }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <transition name="fade">
        <div class=" p-6 md:p-8  relative">
          <div class="absolute top-6 right-6">
            <button @click="exportResult"
                    class="text-blue-600 dark:text-blue-400 text-sm flex items-center gap-1 hover:underline">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              导出结果
            </button>
          </div>

          <h2 class="text-sm font-bold text-slate-500 dark:text-zinc-400 mb-6 uppercase tracking-wider">查询结果</h2>

          <div class="flex flex-col lg:flex-row gap-8 lg:gap-16">
            <div class="flex items-center gap-6 min-w-fit">
              <div
                  class="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-2xl shrink-0 shadow-inner">
                IP
              </div>
              <div>
                <div class="text-3xl font-bold text-slate-800 dark:text-zinc-100">{{ result.ip }}</div>
                <div class="text-slate-500 dark:text-zinc-400">{{ result.org }}</div>
              </div>
            </div>

            <div class="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4 text-sm">
              <div v-for="(val, label) in {
                'IP 地址': result.ip,
                '归属地': result.location,
                '运营商': result.isp,
                '时区': result.timezone,
                '经纬度': result.latLon,
                '使用类型': result.usageType
              }" :key="label" class="flex justify-between border-b border-slate-50 dark:border-zinc-800/50 pb-2">
                <span class="text-slate-400 dark:text-zinc-500">{{ label }}</span>
                <span class="text-slate-700 dark:text-zinc-300 font-medium">{{ val }}</span>
              </div>

              <div class="flex justify-between border-b border-slate-50 dark:border-zinc-800/50 pb-2">
                <span class="text-slate-400 dark:text-zinc-500">是否代理</span>
                <span :class="result.isProxy === '是' ? 'text-red-500' : 'text-green-500'"
                      class="font-bold">{{ result.isProxy }}</span>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <section class=" p-6   transition-all">
        <h2 class="text-sm font-bold text-slate-500 dark:text-zinc-400 mb-6 uppercase tracking-wider">常用IP</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center">
          <div
              v-for="ip in commonIps"
              :key="ip.label"
              @click="handleSearch(ip.label)"
              class="p-3 border border-slate-100 dark:border-zinc-800 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer group"
          >
            <div class="font-bold text-slate-800 dark:text-zinc-300 group-hover:text-blue-600 transition-colors">
              {{ ip.label }}
            </div>
            <div class="text-[10px] text-slate-400 dark:text-zinc-500">{{ ip.desc }}</div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
