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

async function initHighlighter() {
    if (!highlighter) {
        highlighter = await createHighlighter({
            themes: ['github-light'],
            langs: ['java', 'javascript', 'typescript', 'scss', 'css', 'json', 'yaml', 'sql', 'xml', 'html', 'bash', 'python']
        });
    }
}

export async function renderMarkdown(content) {
    // 确保 highlighter 只创建一次（单例模式）
    if (!highlighter) {
        highlighter = await createHighlighter({
            themes: ['github-light'],
            langs: ['java', 'javascript', 'typescript', 'scss', 'css', 'json', 'yaml', 'sql', 'xml', 'html', 'bash', 'python']
        });
    }

    // 自定义代码块渲染逻辑
    md.options.highlight = (code, lang) => {
        return highlighter.codeToHtml(code, {
            lang: lang || 'text',
            theme: 'github-light'
        });
    };

    return md.render(content);
}
