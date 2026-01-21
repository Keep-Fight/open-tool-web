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

export async function renderMarkdown(content) {
    await initHighlighter();

    // 自定义代码块渲染逻辑
    md.options.highlight = (code, lang) => {
        // 1. 处理 Mermaid
        if (lang === 'mermaid') {
            return `<pre class="mermaid-container">${code}</pre>`;

        }

        // 2. 处理代码高亮
        const validLang = highlighter.getLoadedLanguages().includes(lang) ? lang : 'text';
        const highlighted = highlighter.codeToHtml(code, { lang: validLang, theme: 'github-light' });

        // 3. 注入“复制”按钮和语言标签的包装层
        return `
      <div class="code-block-wrapper group">
        <div class="code-header">
          <span class="code-lang">${lang || 'text'}</span>
          <button class="copy-btn" onclick="copyCode(this)">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <span class="copy-text">Copy</span>
          </button>
        </div>
        ${highlighted}
      </div>`;
    };

    return md.render(content);
}
