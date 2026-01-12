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
                iconPath: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
                themeColor: 'sky'
            },
            {
                id: 'json-formatter',
                title: 'JSON 格式化/校验',
                description: '美化混乱的 JSON 数据，验证其格式是否正确，支持折叠和展开。',
                iconPath: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
                themeColor: 'green'
            }
        ]
    },
    {
        id: 'text',
        name: '文本与图像',
        color: 'blue',
        tools: [
            {
                id: 'word-count',
                title: '字数统计',
                description: '在线计算文本的字符数、单词数、段落数以及中文字数。',
                iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                themeColor: 'cyan'
            }
        ]
    }
]

// 工具组件的定义
const toolsComponent = {
    'base-converter': defineAsyncComponent(() => import('../components/tools/BaseConverter.vue')),
    'json-formatter': defineAsyncComponent(() => import('../components/tools/JsonFormatter.vue'))
}

export {toolsJson, toolsComponent};

