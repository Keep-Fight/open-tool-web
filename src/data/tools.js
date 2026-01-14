import {defineAsyncComponent} from 'vue'

// 工具数据的定义
const toolsJson = [
    {
        id: 'dev',
        name: '开发人员工具',
        color: 'blue',
        tools: [
            {
                id: 'base-converter',
                title: '进制转换',
                description: '支持二进制、八进制、十进制、十六进制等常见进制之间的在线实时转换。',
                iconName: 'base-converter',
            },
            {
                id: 'json-formatter',
                title: 'JSON 格式化/校验',
                description: '美化混乱的 JSON 数据，验证其格式是否正确，支持折叠和展开。',
                iconName: 'json-formatter',
            },
            {
                id: 'sql-formatter',
                title: 'Mybatis Log转SQL',
                description: '支持各种常见类型（String, Integer, Timestamp, Boolean 等）',
                iconName: 'sql-formatter',
            },
            {
                id: 'color-picker',
                title: '颜色选择器',
                description: '可进行颜色选择，支持文本和背景的颜色对比功能',
                iconName: 'color-picker',
            }
        ]
    },
    {
        id: 'text',
        name: '文本与图像',
        color: 'blue',
        tools: [
            {
                id: 'id-generation',
                title: 'ID生成',
                description: '支持UUID、雪花ID、雪花UUID',
                iconName: 'id-generation'
            }
        ]
    }
]

// 工具组件的定义
const toolsComponent = {
    'base-converter': defineAsyncComponent(() => import('../components/tools/BaseConverter.vue')),
    'json-formatter': defineAsyncComponent(() => import('../components/tools/JsonFormatter.vue')),
    'sql-formatter': defineAsyncComponent(()=>import('../components/tools/SqlFormatter.vue')),
    'id-generation': defineAsyncComponent(()=>import("../components/tools/IdGenerator.vue")),
    'color-picker' : defineAsyncComponent( ()=>import("../components/tools/ColorPicker.vue"))
}

export {toolsJson, toolsComponent};

