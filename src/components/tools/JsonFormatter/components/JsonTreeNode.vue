<template>
  <div class="code-font text-sm leading-6">
    <template v-if="isObject || isArray">
      <div class="flex items-start group">
        <button
            @click="collapsed = !collapsed"
            class="mt-1.5 mr-1 cursor-pointer hover:bg-slate-200 rounded transition-colors"
        >
          <component
              :is="collapsed ? ChevronRight : ChevronDown"
              class="w-3 h-3 text-slate-400"
          />
        </button>

        <div class="flex-1">
          <span v-if="nodeKey" class="text-rose-500">"{{ nodeKey }}"</span>
          <span v-if="nodeKey" class="text-slate-800">: </span>
          <span class="text-slate-800">{{ isArray ? '[' : '{' }}</span>

          <span v-if="collapsed" @click="collapsed = false" class="cursor-pointer text-slate-400 hover:text-blue-500">
            ... {{ isArray ? ']' : '}' }}
            <span class="text-xs bg-slate-100 px-1 rounded ml-1">{{ Object.keys(data).length }} items</span>
          </span>

          <div v-show="!collapsed" class="pl-6 border-l border-slate-200 ml-1.5 mt-1">
            <div v-for="(value, key, index) in data" :key="key">
              <JsonTreeNode
                  :node-key="isArray ? '' : key"
                  :data="value"
                  :is-last="index === Object.keys(data).length - 1"
              />
            </div>
          </div>

          <div v-if="!collapsed" class="text-slate-800">
            {{ isArray ? ']' : '}' }}{{ isLast ? '' : ',' }}
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="pl-4">
        <span v-if="nodeKey" class="text-rose-500">"{{ nodeKey }}"</span>
        <span v-if="nodeKey" class="text-slate-800">: </span>
        <span :class="valueClass">{{ formatValue(data) }}</span>
        <span v-if="!isLast" class="text-slate-800">,</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ChevronDown, ChevronRight } from 'lucide-vue-next';

const props = defineProps({
  nodeKey: String,
  data: [Object, Array, String, Number, Boolean, null],
  isLast: Boolean
});

const collapsed = ref(false);

const isObject = computed(() => props.data !== null && typeof props.data === 'object' && !Array.isArray(props.data));
const isArray = computed(() => Array.isArray(props.data));

const valueClass = computed(() => {
  if (typeof props.data === 'string') return 'text-emerald-600';
  if (typeof props.data === 'number') return 'text-orange-500';
  if (typeof props.data === 'boolean') return 'text-blue-500 font-medium';
  if (props.data === null) return 'text-slate-400 italic';
  return 'text-slate-800';
});

const formatValue = (val) => {
  if (typeof val === 'string') return `"${val}"`;
  if (val === null) return 'null';
  return val;
};
</script>