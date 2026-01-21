<template>
  <li>
    <!-- 文件/目录行 -->
    <div
        class="flex items-center justify-between cursor-pointer px-2 py-1 rounded hover:bg-gray-200"
        :class="{'bg-gray-300 font-semibold': node.path === activePath}"
        @click.stop="handleClick"
    >
      <span class="flex items-center space-x-1">
        <!-- 目录箭头 -->
        <svg
            v-if="node.directory"
            class="w-4 h-4 transition-transform duration-200"
            :class="{'rotate-90': open}"
            fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
        <span>{{ node.name }}</span>
      </span>
    </div>

    <!-- 子目录 -->
    <ul
        v-if="node.directory"
        ref="childList"
        class="overflow-hidden transition-all duration-300"
        :style="{height: open ? childHeight + 'px' : '0px'}"
    >
      <TreeNode
          v-for="child in node.children"
          :key="child.path"
          :node="child"
          :active-path="activePath"
          @select="$emit('select', $event)"
      />
    </ul>
  </li>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'

const props = defineProps({
  node: { type: Object, required: true },
  activePath: { type: String, default: '' }
})

const emit = defineEmits(['select'])
const open = ref(false)
const childHeight = ref(0)
const childList = ref(null)

// 点击文件/目录
function handleClick() {
  if (props.node.directory) toggle()
  else emit('select', props.node.path)
}

// 展开/折叠目录
function toggle() {
  open.value = !open.value
  nextTick(() => {
    if (childList.value) {
      childHeight.value = open.value
          ? childList.value.scrollHeight
          : 0
    }
  })
}

// 判断子目录是否包含目标路径
function containsPath(node, path) {
  if (!node.children) return false
  for (const child of node.children) {
    if (child.path === path) return true
    if (child.directory && containsPath(child, path)) return true
  }
  return false
}

// watch activePath 自动展开当前文件目录
watch(() => props.activePath, (newPath) => {
  if (props.node.directory && containsPath(props.node, newPath)) {
    if (!open.value) toggle()
  }
})

onMounted(() => {
  // 初始化展开
  if (props.node.directory && containsPath(props.node, props.activePath)) {
    open.value = true
    nextTick(() => {
      if (childList.value) {
        childHeight.value = childList.value.scrollHeight
      }
    })
  }
})
</script>
