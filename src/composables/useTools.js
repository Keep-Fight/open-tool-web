import {ref, computed} from 'vue'
import {categories, tools as toolsData} from '@/data/tools'
import {useFavoriteStore} from '@/stores/favoriteStore'
import {colorMap, textColorMap} from '@/data/colorMap'

export function useTools() {
    const favoriteStore = useFavoriteStore()

    // 搜索关键词
    const searchQuery = ref('')

    // 当前选中的分类
    const activeCategory = ref('all')

    // 是否只显示收藏
    const showFavoritesOnly = ref(false)

    // 所有分类
    const allCategories = computed(() => categories)

    // 目录菜单，包含工具数量统计
    const menus = computed(() => {
        return categories.map(cat => {
            let count
            if (cat.id === 'all') {
                // 全部工具分类
                count = toolsData.length
            } else {
                count = toolsData.filter(tool => tool.category.includes(cat.title)).length
            }
            return {
                ...cat,
                count,
                active: activeCategory.value === cat.id
            }
        })
    })

    // 工具列表，添加收藏标识和颜色字段
    const colorKeys = Object.keys(colorMap)
    const colorLength = colorKeys.length
    const tools = computed(() => {
        let index = 0
        toolsData.forEach(tool => {
            tool.color = colorMap[colorKeys[(index++) % colorLength]]
            tool.titleColor = textColorMap[colorKeys[(index - 1) % colorLength]]
            tool.isFavorite = favoriteStore.isFav(tool.id)
        })
        return toolsData;
    })

    // 根据当前条件过滤后的工具列表
    const filteredTools = computed(() => {
        let result = tools.value

        // 收藏过滤
        if (showFavoritesOnly.value) {
            result = result.filter(tool => tool.isFavorite)
        }

        // 分类过滤
        if (activeCategory.value !== 'all') {
            const category = categories.find(c => c.id === activeCategory.value)
            if (category) {
                result = result.filter(tool => tool.category.includes(category.title))
            }
        }

        // 搜索过滤
        if (searchQuery.value.trim()) {
            const query = searchQuery.value.toLowerCase()
            result = result.filter(tool =>
                tool.title.toLowerCase().includes(query) ||
                tool.description.toLowerCase().includes(query) ||
                tool.tags.some(tag => tag.toLowerCase().includes(query))
            )
        }

        console.log(result)
        return result
    })

    // 收藏夹数量
    const favoriteCount = computed(() => favoriteStore.count)

    // 切换收藏状态
    const toggleFavorite = (toolId) => {
        favoriteStore.toggle(toolId)
    }

    // 切换分类
    const selectCategory = (categoryId) => {
        activeCategory.value = categoryId
        showFavoritesOnly.value = false
    }

    // 显示收藏夹
    const showFavorites = () => {
        showFavoritesOnly.value = true
    }

    // 重置筛选条件
    const resetFilters = () => {
        searchQuery.value = ''
        activeCategory.value = 'all'
        showFavoritesOnly.value = false
    }

    return {
        // 状态
        searchQuery,
        activeCategory,
        showFavoritesOnly,
        // 计算属性
        allCategories,
        menus,
        tools,
        filteredTools,
        favoriteCount,
        // 方法
        toggleFavorite,
        selectCategory,
        showFavorites,
        resetFilters
    }
}
