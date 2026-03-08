import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import container from 'markdown-it-container';
import {createHighlighter} from 'shiki';

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
});

// 1. 标题锚点
md.use(anchor, {permalink: anchor.permalink.headerLink()});

// 2. 自定义容器 (::: tip)
md.use(container, 'tip', {
    render: (tokens, idx) => {
        const m = tokens[idx].info.trim().match(/^tip\s*(.*)$/);
        if (tokens[idx].nesting === 1) {
            return `<div class="custom-block tip"><p class="custom-block-title">${m[1] || '提示'}</p>\n`;
        }
        return '</div>\n';
    }
});

// 3. 异步代码高亮处理
let highlighter;
const SUPPORTED_LANGS = ['java', 'javascript', 'typescript', 'scss', 'css', 'json', 'yaml', 'sql', 'xml', 'html', 'bash', 'python'];
export async function renderMarkdown(content) {
    if (!highlighter) {
        highlighter = await createHighlighter({
            themes: ['github-light'],
            langs: SUPPORTED_LANGS,
            theme: 'github-light'
        });
    }

    // 自定义代码块渲染逻辑：未找到对应语言时使用通用text
    md.options.highlight = (code, lang) => {
        // 1. 校验语言是否支持（空值/不支持均替换为text）
        const targetLang = lang && SUPPORTED_LANGS.includes(lang.toLowerCase())
            ? lang.toLowerCase()
            : 'text';

        // 2. 可选：给未识别语言的代码块添加注释提示（增强体验）
        let codeToRender = code;
        if (targetLang === 'text' && lang) {
            codeToRender = `${code}`;
        }

        // 3. 渲染代码块（通用text格式无语法高亮，仅纯文本）
        return highlighter.codeToHtml(codeToRender, {
            lang: targetLang,
            theme: 'github-light',
            lineNumbers: true // 添加行号
        });
    };

    return md.render(content);
}