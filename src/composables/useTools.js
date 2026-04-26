import {computed} from "vue"
import {categories, tools} from "@/data/tools"

export function useTools() {

    // TODO 目录菜单（来自分类泪飙），增强功能，统计工具数量
    const menus = computed(() => {
    })

    // TODO 工具列表，添加收藏夹标识字段、根据colorMap，循环设置color字段
    const tools = computed(() => {

    })

    return {
        menus,
        tools
    }
}