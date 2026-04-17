import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import container from 'markdown-it-container';
import {createHighlighter} from 'shiki';


//************************************【生成mdHtml】************************************* */
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
const SUPPORTED_LANDS = ['java', 'javascript', 'typescript', 'scss', 'css', 'json', 'yaml', 'sql', 'xml', 'html', 'bash', 'python'];

export async function renderMarkdown(content) {
    if (!highlighter) {
        highlighter = await createHighlighter({
            themes: ['github-light','github-dark'],
            langs: SUPPORTED_LANDS
        });
    }

    // 自定义代码块渲染逻辑：未找到对应语言时使用通用text
    md.options.highlight = (code, lang) => {
        // 1. 校验语言是否支持（空值/不支持均替换为text）
        const targetLang = lang && SUPPORTED_LANDS.includes(lang.toLowerCase())
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
            themes: {
                light: 'github-light',
                dark: 'github-dark',
            }
        });
    };

    return  cleanMdHtml(md.render(content));
}


//************************************【生成mdHtml】************************************* */
/**
 * 清理标题中的Markdown语法（优先移除加粗，可扩展其他语法）
 * @param {string} text - 原始标题文本
 * @returns {string} 清理后的纯文本
 */
export const cleanMarkdownSyntax = (text) => {
    return text
        .replace(/\*\*([^*]+)\*\*/g, '$1') // 移除加粗标记 **内容** → 内容
        .replace(/\*([^*]+)\*/g, '$1')     // 可选：移除斜体标记 *内容* → 内容
        .replace(/\_([^_]+)\_/g, '$1')     // 可选：移除下划线斜体 _内容_ → 内容
        .replace(/\`([^`]+)\`/g, '$1')
        .trim();
};

/**
 * 解析Markdown标题生成目录
 * @param mdContent
 * @returns {*[]} 目录列表
 */
export const parseTocFromMd = (mdContent) => {
    const tocList = [];
    if (!mdContent) {
        return tocList;
    }

    // 正则匹配并移除所有代码块（```xxx``` 或 `xxx`）
    const mdWithoutCodeBlocks = mdContent
        // 移除多行代码块（```开头，```结尾，支持跨行）
        .replace(/```[\s\S]*?```/g, '');

    // 匹配非代码块内的Markdown标题（h1-h6）
    const headingRegex = /^(#{1,6})\s+(.*?)$/gm;

    let match;
    let index=0
    while ((match = headingRegex.exec(mdWithoutCodeBlocks)) !== null) {
        const level = match[1].length; // 标题层级（1-6）
        const rawText = match[2].trim(); // 原始标题文本（含加粗等标记）

        // 核心：清理Markdown加粗标记
        const cleanText = cleanMarkdownSyntax(rawText);

        // 生成唯一锚点ID（兼容特殊字符）
        const slug = encodeURI(cleanText);
        const anchorId = `md-toc-${slug}-${level}-${index++}`;

        // 存入目录列表
        tocList.push({
            id: anchorId,
            text: cleanText,
            level
        });
    }
    return tocList;
};

/**
 * 清洗Md的HTML文件，添加锚点ID
 * @param renderedHtml 清理前的HTML
 * @returns {*} 清洗后的HTML
 */
export const cleanMdHtml = (renderedHtml) => {
    // 替换渲染后的HTML标题，添加锚点ID（同步清理标记）
    let index=0
    return renderedHtml.replace(
        /<h([1-6])(\s+[^>]*)?>(.*?)<\/h\1>/g,
        (match, level, attrs, text) => {
            // 先清理标题内的HTML标签，再清理Markdown加粗标记
            let cleanText = text.replace(/<[^>]*>/g, '').trim();
            cleanText = cleanMarkdownSyntax(cleanText);

            const slug = encodeURI(cleanText);
            const anchorId = `md-toc-${slug}-${level}-${index++}`;
            return `<h${level} id="${anchorId}"${attrs || ''}>${text}</h${level}>`;
        }
    );

}