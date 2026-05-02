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
        category: ['开发工具','格式化工具'],
        tags: ['json', '格式化'],
        icon: Braces,
        iconName: ''
    },
    {
        id: 'color-picker',
        title: '颜色选择器',
        description: '可进行颜色选择，支持文本和背景的颜色对比功能',
        component: defineAsyncComponent(() => import('../components/tools/ColorPicker/index.vue')),
        category: ['设计工具'],
        tags: ['颜色', '选择器'],
        icon: SvgIcon,
        iconName: 'color-picker'
    },
    {
        id: 'id-generation',
        title: 'ID 生成',
        description: '支持 UUID(v4)、雪花ID、雪花UUID',
        component: defineAsyncComponent(() => import("../components/tools/IdGenerator/index.vue")),
        category: ['开发工具'],
        tags: ['ID', '生成器', 'UUID'],
        icon: SvgIcon,
        iconName: 'id-generation'
    },
    {
        id: 'base64-converter',
        title: 'Base64 图片转换',
        description: '支持Base64字符串和图片的相互转换',
        component: defineAsyncComponent(() => import('../components/tools/Base64Converter/index.vue')),
        category: ['文本工具','图片工具','转换工具'],
        tags: ['base64', '转换'],
        icon: GoogleIcon,
        iconName: 'code_xml'
    },
    {
        id: 'ip-query',
        title: 'IP 查询',
        description: 'IP查询工具，查询IP地址信息',
        component: defineAsyncComponent(() => import('../components/tools/IpQuery/index.vue')),
        category: ['网络工具'],
        tags: ['ip', '查询'],
        icon: SvgIcon,
        iconName: 'ip-query'
    },
    {
        id: 'timestamp-converter',
        title: '时间戳转换',
        description: '时间戳转换工具，支持时间戳和日期的转换',
        component: defineAsyncComponent(() => import('../components/tools/TimestampConverter/index.vue')),
        category: ['开发工具', '转换工具'],
        tags: ['时间戳', '转换'],
        icon: SvgIcon,
        iconName: 'timestamp-converter'
    },
    {
        id: 'string-converter',
        title: '字符串转换',
        description: '支持 字符串、十六进制、十进制、二进制、Base64、URL 编码 之间的相互转换',
        component: defineAsyncComponent(() => import('../components/tools/StringConverter/index.vue')),
        category: ['开发工具', '转换工具', '文本工具'],
        tags: ['字符串', '转换'],
        icon: SvgIcon,
        iconName: 'string-converter'
    },
    {
        id: 'qr-code',
        title: '二维码生成',
        description: '支持生成带有文本信息和logo的二维码，并能下载为图片',
        component: defineAsyncComponent(() => import('../components/tools/QrCode/index.vue')),
        category: ['图片工具'],
        tags: ['二维码', '生成'],
        icon: QrCode,
        iconName: ''
    }, {
        id: 'prompt-template',
        title: '提示词模板',
        description: '支持自定义提示词模板，并进行变量替换',
        component: defineAsyncComponent(() => import('../components/tools/PromptTemplate/index.vue')),
        category: ['开发工具'],
        tags: ['提示词', '模板'],
        icon: SvgIcon,
        iconName: 'prompt-template'
    },
    {
        id: 'secret-key-generator',
        title: '密钥生成',
        description: '支持 AES、DES/3DES、RC4/RC5、IDEA、Blowfish、SM4、RSA、ECC、SM2等加密算法的密钥生成',
        component: defineAsyncComponent(() => import('../components/tools/SecretKeyGenerator/index.vue')),
        category: ['开发工具'],
        tags: ['密钥', '生成'],
        icon: SvgIcon,
        iconName: 'secret-key-generator'
    }
]

export {categories, tools};
