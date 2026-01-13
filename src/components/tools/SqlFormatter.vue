<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <h2 class="text-2xl font-black">MyBatis Log转SQL</h2>

      <div class="flex flex-wrap gap-2">
        <button @click="convertSql"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20">
          还原 SQL
        </button>
        <button @click="copyResult"
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all">
          {{ copied ? '已复制!' : '复制 SQL' }}
        </button>
        <button @click="clearAll"
                class="px-4 py-2 border border-gray-200 dark:border-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl text-sm font-bold transition-all">
          清空
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6">
      <div class="space-y-2">
        <label class="text-xs font-bold text-gray-400 uppercase tracking-wider">粘贴 MyBatis 日志</label>
        <textarea
            v-model="rawLog"
            placeholder="在此粘贴包含 Preparing: 和 Parameters: 的日志内容..."
            class="w-full h-48 p-4 font-mono text-sm border-none rounded-2xl focus:ring-2 dark:bg-gray-900 bg-gray-50 focus:ring-blue-500 outline-none resize-none transition-colors"
        ></textarea>
      </div>

      <div class="space-y-2">
        <label class="text-xs font-bold text-gray-400 uppercase tracking-wider">可执行 SQL</label>
        <div class="relative">
          <div v-if="error" class="mb-2 text-red-500 text-xs font-mono">
            {{ error }}
          </div>
          <pre
              class="w-full min-h-[200px] p-4 font-mono text-sm bg-blue-50/50 dark:bg-blue-900/20 dark:text-blue-300 text-blue-700 overflow-auto rounded-2xl whitespace-pre-wrap break-all border border-blue-100 dark:border-blue-900/30"
          >{{ resultSql || '等待解析...' }}</pre>
        </div>
      </div>
    </div>

    <div :class="[' p-4 rounded-xl text-sm text-gray-500 dark:bg-gray-800 bg-gray-200 transition']">
      <p class="font-bold mb-1">使用说明：</p>
      <ul class="list-disc ml-4 space-y-1">
        <li>直接复制控制台打印的 MyBatis 日志全文即可。</li>
        <li>程序会自动匹配 <code class="text-blue-500">Preparing:</code> 和 <code
            class="text-blue-500">Parameters:</code> 关键字。
        </li>
        <li>支持各种常见类型（String, Integer, Timestamp, Boolean 等）。</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'

const rawLog = ref('')
const resultSql = ref('')
const error = ref('')
const copied = ref(false)

const convertSql = () => {
  error.value = ''
  const log = rawLog.value

  if (!log.includes('Preparing:') || !log.includes('Parameters:')) {
    error.value = '日志格式不正确：未找到 Preparing 或 Parameters 行'
    return
  }

  try {
    // 1. 提取 Preparing (SQL 模板)
    const sqlMatch = log.match(/Preparing:\s+(.+)/)
    if (!sqlMatch) throw new Error('解析 Preparing 行失败')
    let sql = sqlMatch[1]

    // 2. 提取 Parameters (参数列表)
    const paramMatch = log.match(/Parameters:\s+(.+)/)
    if (!paramMatch) {
      // 如果没有参数，直接返回 SQL
      resultSql.value = sql + ';'
      return
    }

    const paramsStr = paramMatch[1]
    // 3. 解析参数。MyBatis 参数格式通常为: value1(Type1), value2(Type2)
    // 这里使用正则匹配，考虑括号内可能有逗号的情况
    const params = paramsStr.split(/,\s(?=[^,]+\(\w+\))/).map(p => {
      const match = p.match(/(.+)\((\w+)\)/)
      if (match) {
        let val = match[1].trim()
        const type = match[2].toLowerCase()

        // 4. 根据类型处理格式
        if (['string', 'timestamp', 'date', 'time'].includes(type) || val === 'null') {
          if (val !== 'null') val = `'${val}'`
        }
        return val
      }
      return p.trim()
    })

    // 5. 替换 SQL 中的问号
    let index = 0
    const finalSql = sql.replace(/\?/g, () => {
      return params[index++] || '?'
    })

    resultSql.value = finalSql + ';'
  } catch (e) {
    error.value = '解析失败：' + e.message
  }
}

const copyResult = async () => {
  if (!resultSql.value) return
  try {
    await navigator.clipboard.writeText(resultSql.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    alert('复制失败')
  }
}

const clearAll = () => {
  rawLog.value = ''
  resultSql.value = ''
  error.value = ''
}
</script>
