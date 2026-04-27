<template>
  <div class="code-font text-sm leading-6">
    <template v-if="isObject || isArray">
      <div class="flex items-start group">
        <button
            @click="collapsed = !collapsed"
            class="mt-1.5 mr-1 cursor-pointer hover:bg-outline-variant rounded transition-colors"
        >
          <component
              :is="collapsed ? ChevronRight : ChevronDown"
              class="w-3 h-3 text-on-surface-variant"
          />
        </button>

        <div class="flex-1">
          <span v-if="nodeKey" class="text-rose-500 dark:text-rose-400">"{{ nodeKey }}"</span>
          <span v-if="nodeKey" class="text-on-surface">: </span>
          <span class="text-on-surface">{{ isArray ? '[' : '{' }}</span>

          <span v-if="collapsed" @click="collapsed = false" class="cursor-pointer text-on-surface-variant hover:text-primary">
            ... {{ isArray ? ']' : '}' }}
            <span class="text-xs bg-outline-variant px-1 rounded ml-1">{{ isArray ? data.length : Object.keys(data).length }} items</span>
          </span>

          <div v-show="!collapsed" class="pl-6 border-l border-outline ml-1.5 mt-1">
            <!-- 数组 -->
            <div v-if="isArray">
              <JsonTreeNode
                  v-for="(value, index) in data"
                  :key="`${path}[${index}]`"
                  :node-key="''"
                  :data="value"
                  :is-last="index === data.length - 1"
                  :path="`${path}[${index}]`"
              />
            </div>

            <!-- 对象 -->
            <div v-else>
              <JsonTreeNode
                  v-for="(value, key, index) in data"
                  :key="`${path}.${key}`"
                  :node-key="key"
                  :data="value"
                  :is-last="index === Object.keys(data).length - 1"
                  :path="`${path}.${key}`"
              />
            </div>
          </div>

          <div v-if="!collapsed" class="text-on-surface">
            {{ isArray ? ']' : '}' }}{{ isLast ? '' : ',' }}
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="pl-4">
        <span v-if="nodeKey" class="text-rose-500 dark:text-rose-400">"{{ nodeKey }}"</span>
        <span v-if="nodeKey" class="text-on-surface">: </span>
        <span :class="valueClass">{{ formatValue(data) }}</span>
        <span v-if="!isLast" class="text-on-surface">,</span>
      </div>
    </template>
  </div>
</template>
<script setup>
import { ref, computed, inject, provide } from 'vue';
import { ChevronDown, ChevronRight } from 'lucide-vue-next';

const props = defineProps({
  nodeKey: String,
  data: [Object, Array, String, Number, Boolean, null],
  isLast: Boolean,
  path: {
    type: String,
    default: 'root'
  }
});

// 获取或创建全局折叠状态
const collapsedMap = inject('collapsedMap', null);
const localCollapsedMap = collapsedMap ?? ref({});
provide('collapsedMap', localCollapsedMap);
const collapsed = computed({
  get() {
    return localCollapsedMap.value[props.path] ?? false;
  },
  set(val) {
    localCollapsedMap.value[props.path] = val;
  }
});

const isObject = computed(() => props.data !== null && typeof props.data === 'object' && !Array.isArray(props.data));
const isArray = computed(() => Array.isArray(props.data));

const valueClass = computed(() => {
  if (typeof props.data === 'string') return 'text-emerald-600 dark:text-emerald-400';
  if (typeof props.data === 'number') return 'text-orange-500 dark:text-orange-400';
  if (typeof props.data === 'boolean') return 'text-blue-500 dark:text-blue-400 font-medium';
  if (props.data === null) return 'text-on-surface-variant italic';
  return 'text-on-surface';
});

const formatValue = (val) => {
  if (typeof val === 'string') return `"${val}"`;
  if (val === null) return 'null';
  return val;
};
</script>