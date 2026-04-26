import {defineAsyncComponent} from 'vue'
import SvgIcon from "@/components/public/SvgIcon.vue";
import {Braces, CheckSquare, Code2, LayoutGrid, Palette, Repeat, Type, Image, QrCode} from "lucide-vue-next";
import GoogleIcon from "@/components/public/GoogleIcon.vue";

// 工具分类的定义
const categories = [
    {
        id: 'all',
        title: '全部工具',
        icon: LayoutGrid
    },
    {
        id: 'dev',
        title: '开发工具',
        icon: Code2
    },
    {
        id: 'text',
        title: '文本工具',
        icon: Type
    },
    {
        id: 'image',
        title: '图片工具',
        icon: Image
    },
    {
        id: 'convert',
        title: '转换工具',
        icon: Repeat
    },
    {
        id: 'format',
        title: '格式化工具',
        icon: CheckSquare
    },
    {
        id: 'design',
        title: '设计工具',
        icon: Palette
    },
    {
        id: 'network',
        title: '网络工具',
        icon: SvgIcon,
        iconName: 'network'
    }
]


// 工具数据的定义
const tools = [
    {
        id: 'json-formatter',
        title: 'JSON 格式化/校验',
        description: '格式化 JSON 字符串，验证其格式是否正确，支持折叠和展开。',
        component: defineAsyncComponent(() => import('../components/tools/JsonFormatter/index.vue')),
        category: ['格式化工具'],
        tags: ['json', '格式化'],
        icon: Braces,
        iconName: ''
    },
    {
        id: 'color-picker',
        title: '颜色选择器',
        description: '可进行颜色选择，支持文本和背景的颜色对比功能',
        component: defineAsyncComponent(() => import('../components/tools/UnDone/index.vue')),
        category: ['设计工具'],
        tags: ['颜色', '选择器'],
        icon: SvgIcon,
        iconName: 'color-picker'
    },
    {
        id: 'id-generation',
        title: 'ID 生成',
        description: '支持UUID、雪花ID、雪花UUID',
        component: defineAsyncComponent(() => import("../components/tools/UnDone/index.vue")),
        category: ['开发工具'],
        tags: ['ID', '生成器', 'UUID'],
        icon: SvgIcon,
        iconName: 'id-generation'
    },
    {
        id: 'base64-converter',
        title: 'Base64 转换',
        description: 'Base64转换工具，支持文本和图片的转换',
        component: defineAsyncComponent(() => import('../components/tools/UnDone/index.vue')),
        category: ['文本工具'],
        tags: ['base64', '转换'],
        icon: GoogleIcon,
        iconName: 'code_xml'
    },
    {
        id: 'ip-query',
        title: 'IP 查询',
        description: 'IP查询工具，查询IP地址信息',
        component: defineAsyncComponent(() => import('../components/tools/UnDone/index.vue')),
        category: ['网络工具'],
        tags: ['ip', '查询'],
        icon: SvgIcon,
        iconName: 'ip-query'
    },
    {
        id: 'timestamp-converter',
        title: '时间戳转换',
        description: '时间戳转换工具，支持时间戳和日期的转换',
        component: defineAsyncComponent(() => import('../components/tools/UnDone/index.vue')),
        category: ['开发工具', '转换工具'],
        tags: ['时间戳', '转换'],
        icon: SvgIcon,
        iconName: 'timestamp-converter'
    },
    {
        id: 'text-encryption',
        title: '文本 加密/解密',
        description: '文本加密解密工具，支持AES、RSA、DES、MD5、SHA1、SHA256、SHA512、HEX',
        component: defineAsyncComponent(() => import('../components/tools/UnDone/index.vue')),
        category: ['开发工具', '文本工具'],
        tags: ['文本', '加密', '解密'],
        icon: SvgIcon,
        iconName: 'text-encryption'
    },
    {
        id: 'string-converter',
        title: '字符串转换',
        description: '字符串转换工具，支持字符串的转换',
        component: defineAsyncComponent(() => import('../components/tools/UnDone/index.vue')),
        category: ['开发工具', '转换工具','文本工具'],
        tags: ['字符串', '转换'],
        icon: SvgIcon,
        iconName: 'string-converter'
    },
    {
        id: 'qr-code',
        title: '二维码生成',
        description: '二维码生成工具，支持二维码的生成',
        component: defineAsyncComponent(() => import('../components/tools/UnDone/index.vue')),
        category: ['图片工具'],
        tags: ['二维码', '生成'],
        icon: QrCode,
        iconName: ''
    }
]

export {categories, tools};
