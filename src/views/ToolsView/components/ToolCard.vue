<script setup>
import {Star} from "lucide-vue-next"
import {colorMap} from "@/data/colorMap"
import {useRouter} from "vue-router"

const props = defineProps({
  id: String,
  title: String,
  description: String,
  icon: [Object, String],
  iconName: String,
  color: String,
  titleColor: String,
  tags: Array,
  isFavorite: Boolean
})

const emit = defineEmits(['toggleFavorite'])

const router = useRouter()

const goToTool = () => {
  router.push(`/tools/${props.id}`)
}

const handleToggleFavorite = (e) => {
  e.stopPropagation()
  emit('toggleFavorite', props.id)
}
</script>

<template>
  <div
      class="group p-6 rounded-3xl border transition-all duration-300 relative h-full flex flex-col
             bg-surface-container-lowest border-outline-variant/10 hover:-translate-y-1 card-glow cursor-pointer"
      @click="goToTool">

    <button
      class="absolute top-5 right-5 transition z-10"
      :class="isFavorite ? 'text-yellow-400' : 'text-outline hover:text-yellow-400'"
      @click="handleToggleFavorite">
      <Star class="w-5 h-5" :class="isFavorite ? 'fill-yellow-400' : ''"/>
    </button>

    <div :class="`${color} w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shrink-0`">
      <component
          :is="icon"
          class="w-8 h-8"
          v-bind="{name: iconName}"
      />
    </div>

    <h3 :class="['text-lg font-bold mb-2 shrink-0', titleColor]">
      {{ title }}
    </h3>

    <p class="text-sm leading-relaxed mb-6 text-on-surface-variant flex-1">
      {{ description }}
    </p>

    <div class="flex gap-2 flex-wrap shrink-0">
      <span v-for="tag in tags"
            :key="tag"
            class="px-2.5 py-1 rounded-md text-[11px] font-medium bg-surface-container-low text-on-surface-variant">
        {{ tag }}
      </span>
    </div>

  </div>
</template>
