<template>
  <div class="select-none">
    <div
        v-for="node in nodes"
        :key="node.path"
        class="flex flex-col"
    >
      <div
          @click="handleNodeClick(node)"
          :class="[
          'flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-gray-100 transition-colors rounded-sm',
          selectedPath === node.path ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
        ]"
          :style="{ paddingLeft: `${depth * 1.25 + 0.75}rem` }"
      >
        <component
            :is="node.directory ? (expandedNodes.has(node.path) ? ChevronDown : ChevronRight) : FileText"
            :size="16"
            class="shrink-0 opacity-70"
        />
        <span class="truncate text-sm">{{ node.name }}</span>
      </div>

      <MdFileTree
          v-if="node.directory && expandedNodes.has(node.path)"
          :nodes="node.children"
          :depth="depth + 1"
          :selectedPath="selectedPath"
          @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ChevronRight, ChevronDown, FileText } from 'lucide-vue-next';

const props = defineProps({
  nodes: Array,
  depth: { type: Number, default: 0 },
  selectedPath: String
});

const emit = defineEmits(['select']);
const expandedNodes = ref(new Set());

const handleNodeClick = (node) => {
  if (node.directory) {
    if (expandedNodes.value.has(node.path)) {
      expandedNodes.value.delete(node.path);
    } else {
      expandedNodes.value.add(node.path);
    }
  } else {
    emit('select', node.path);
  }
};
</script>
