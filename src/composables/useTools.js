import { computed } from "vue"
import { toolsJson } from "@/data/tools"

export function useTools() {

    // 分类列表
    const categories = computed(() => {
        return [{
            category: '全部工具',
            icon: '全部'
        }, ...toolsJson.map(c => {
            return {
                category: c.category,
                icon: c.icon
            }
        })]
    })

    // 扁平化工具列表（用于搜索/收藏）
    const flatTools = computed(() => {
        return toolsJson.flatMap(group =>
            group.tools.map(tool => ({
                ...tool,
                category: group.category
            }))
        )
    })

    return {
        categories,
        flatTools,
        toolsJson
    }
}