<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
      @click.self="handleCancel"
    >
      <div class="bg-white dark:bg-[#121214] rounded-xl border border-slate-200 dark:border-[#27272a] shadow-xl w-full max-w-sm overflow-hidden">
        <div class="p-5">
          <h3 class="font-semibold text-[15px] text-slate-800 dark:text-[#f1f1f1] mb-2">{{ title }}</h3>
          <p class="text-sm text-slate-500 dark:text-[#a1a1aa]">{{ message }}</p>
        </div>
        <div class="flex border-t border-slate-100 dark:border-[#27272a]">
          <button
            @click="handleCancel"
            class="flex-1 px-4 py-3 text-[13px] font-medium text-slate-600 dark:text-[#a1a1aa] hover:bg-slate-50 dark:hover:bg-[#1c1c1f] transition-colors cursor-pointer"
          >
            取消
          </button>
          <button
            @click="handleConfirm"
            class="flex-1 px-4 py-3 text-[13px] font-medium text-red-500 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '确认操作'
  },
  message: {
    type: String,
    default: '确定要执行此操作吗？'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const isOpen = ref(false)

const open = () => {
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

const handleConfirm = () => {
  emit('confirm')
  close()
}

const handleCancel = () => {
  emit('cancel')
  close()
}

defineExpose({ open, close })
</script>
