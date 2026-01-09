<template>
  <h2 class="text-2xl font-black mb-8">进制转换工具</h2>
  <div class="grid gap-6">
    <div v-for="base in [10, 2, 8, 16]" :key="base">
      <label class="block text-sm font-bold text-gray-400 mb-2 uppercase">{{ base }} 进制</label>
      <input
          v-model="values[base]"
          @input="convert(base)"
          type="text"
          class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-lg"
      >
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
const values = reactive({ 10: '', 2: '', 8: '', 16: '' })

const convert = (fromBase) => {
  const input = values[fromBase]
  if (!input) {
    Object.keys(values).forEach(k => values[k] = '')
    return
  }
  const decimalValue = parseInt(input, fromBase)
  if (isNaN(decimalValue)) return

  values[10] = decimalValue.toString(10)
  values[2] = decimalValue.toString(2)
  values[8] = decimalValue.toString(8)
  values[16] = decimalValue.toString(16).toUpperCase()
}
</script>
