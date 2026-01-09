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
                themeColor: 'primary'
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

// 颜色映射表
const colorMap = {
    primary: {
        bg: 'bg-primary-500',
        base: 'bg-primary-50 text-primary-600',
        hover: 'group-hover:bg-primary-600 group-hover:text-white',
        titleHover: 'group-hover:text-primary-600'
    },
    red: {
        bg: 'bg-red-500',
        base: 'bg-red-50 text-red-600',
        hover: 'group-hover:bg-red-600 group-hover:text-white',
        titleHover: 'group-hover:text-red-600'
    },
    orange: {
        bg: 'bg-orange-500',
        base: 'bg-orange-50 text-orange-600',
        hover: 'group-hover:bg-orange-600 group-hover:text-white',
        titleHover: 'group-hover:text-orange-600'
    },
    amber: {
        bg: 'bg-amber-500',
        base: 'bg-amber-50 text-amber-600',
        hover: 'group-hover:bg-amber-600 group-hover:text-white',
        titleHover: 'group-hover:text-amber-600'
    },
    yellow: {
        bg: 'bg-yellow-500',
        base: 'bg-yellow-50 text-yellow-600',
        hover: 'group-hover:bg-yellow-600 group-hover:text-white',
        titleHover: 'group-hover:text-yellow-600'
    },
    lime: {
        bg: 'bg-lime-500',
        base: 'bg-lime-50 text-lime-600',
        hover: 'group-hover:bg-lime-600 group-hover:text-white',
        titleHover: 'group-hover:text-lime-600'
    },
    green: {
        bg: 'bg-green-500',
        base: 'bg-green-50 text-green-600',
        hover: 'group-hover:bg-green-600 group-hover:text-white',
        titleHover: 'group-hover:text-green-600'
    },
    emerald: {
        bg: 'bg-emerald-500',
        base: 'bg-emerald-50 text-emerald-600',
        hover: 'group-hover:bg-emerald-600 group-hover:text-white',
        titleHover: 'group-hover:text-emerald-600'
    },
    teal: {
        bg: 'bg-teal-500',
        base: 'bg-teal-50 text-teal-600',
        hover: 'group-hover:bg-teal-600 group-hover:text-white',
        titleHover: 'group-hover:text-teal-600'
    },
    cyan: {
        bg: 'bg-cyan-500',
        base: 'bg-cyan-50 text-cyan-600',
        hover: 'group-hover:bg-cyan-600 group-hover:text-white',
        titleHover: 'group-hover:text-cyan-600'
    },
    sky: {
        bg: 'bg-sky-500',
        base: 'bg-sky-50 text-sky-600',
        hover: 'group-hover:bg-sky-600 group-hover:text-white',
        titleHover: 'group-hover:text-sky-600'
    },
    blue: {
        bg: 'bg-blue-500',
        base: 'bg-blue-50 text-blue-600',
        hover: 'group-hover:bg-blue-600 group-hover:text-white',
        titleHover: 'group-hover:text-blue-600'
    },
    indigo: {
        bg: 'bg-indigo-500',
        base: 'bg-indigo-50 text-indigo-600',
        hover: 'group-hover:bg-indigo-600 group-hover:text-white',
        titleHover: 'group-hover:text-indigo-600'
    },
    violet: {
        bg: 'bg-violet-500',
        base: 'bg-violet-50 text-violet-600',
        hover: 'group-hover:bg-violet-600 group-hover:text-white',
        titleHover: 'group-hover:text-violet-600'
    },
    purple: {
        bg: 'bg-purple-500',
        base: 'bg-purple-50 text-purple-600',
        hover: 'group-hover:bg-purple-600 group-hover:text-white',
        titleHover: 'group-hover:text-purple-600'
    },
    fuchsia: {
        bg: 'bg-fuchsia-500',
        base: 'bg-fuchsia-50 text-fuchsia-600',
        hover: 'group-hover:bg-fuchsia-600 group-hover:text-white',
        titleHover: 'group-hover:text-fuchsia-600'
    },
    pink: {
        bg: 'bg-pink-500',
        base: 'bg-pink-50 text-pink-600',
        hover: 'group-hover:bg-pink-600 group-hover:text-white',
        titleHover: 'group-hover:text-pink-600'
    },
    rose: {
        bg: 'bg-rose-500',
        base: 'bg-rose-50 text-rose-600',
        hover: 'group-hover:bg-rose-600 group-hover:text-white',
        titleHover: 'group-hover:text-rose-600'
    }
}

export {toolsJson, toolsComponent, colorMap};

