import {defineAsyncComponent} from 'vue'

// 工具数据的定义
const toolsJson = [
    {
        category: '开发人员工具',
        icon: 'dev-tools',
        tools: [
            {
                id: 'json-formatter',
                title: 'JSON 格式化/校验',
                description: '美化混乱的 JSON 数据，验证其格式是否正确，支持折叠和展开。',
                component: defineAsyncComponent(() => import('../components/tools/JsonFormatter/index.vue')),
                iconName: 'json-formatter',
                tags: ['json', '格式化', '编码']
            },
            {
                id: 'sql-formatter',
                title: 'Mybatis Log转SQL',
                description: '支持各种常见类型（String, Integer, Timestamp, Boolean 等）',
                component: defineAsyncComponent(() => import('../components/tools/SqlFormatter/index.vue')),
                iconName: 'sql-formatter',
                tags: ['sql', '格式化', '编码']
            },
            {
                id: 'color-picker',
                title: '颜色选择器',
                description: '可进行颜色选择，支持文本和背景的颜色对比功能',
                component: defineAsyncComponent(() => import('../components/tools/ColorPicker/index.vue')),
                iconName: 'color-picker',
                tags: ['颜色', '选择器'],
            }
        ]
    },
    {
        category: '文本与图像',
        icon: 'text-image',
        tools: [
            {
                id: 'id-generation',
                title: 'ID生成',
                description: '支持UUID、雪花ID、雪花UUID',
                component: defineAsyncComponent(() => import("../components/tools/IdGenerator/index.vue")),
                iconName: 'id-generation'
            }
        ]
    }
]

export {toolsJson};

