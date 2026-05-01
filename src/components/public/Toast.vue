<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-48 max-w-80',
            toast.type === 'success' && 'bg-emerald-500 text-white',
            toast.type === 'error' && 'bg-rose-500 text-white',
            toast.type === 'info' && 'bg-blue-500 text-white'
          ]"
        >
          <CheckIcon v-if="toast.type === 'success'" class="w-4 h-4 flex-shrink-0" />
          <XIcon v-else-if="toast.type === 'error'" class="w-4 h-4 flex-shrink-0" />
          <InfoIcon v-else class="w-4 h-4 flex-shrink-0" />
          <span class="text-sm font-medium">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { Check as CheckIcon, X as XIcon, Info as InfoIcon } from 'lucide-vue-next';
import { useToast } from '@/composables/useToast.ts';

const { toasts } = useToast();
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease;
}
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
