<template>
  <main class="flex-1 bg-white dark:bg-[#0a0a0b] min-w-0">
    <div class="max-w-4xl mx-auto px-8 md:px-12 py-16">

      <div class="mb-12">
        <div class="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-4">
          <span class="material-symbols-outlined text-sm">auto_awesome</span>
          Technical Guide
        </div>
        <h1 class="text-4xl md:text-5xl font-black font-headline text-[#0b1c30] dark:text-[#f1f1f1] mb-6 leading-tight">
          Getting Started with <span class="text-primary">Open Toolbox</span>
        </h1>
        <p class="text-lg text-[#424656] dark:text-[#a1a1aa] leading-relaxed">
          了解如何使用 Open Toolbox 架构原语配置您的数字工作区。本指南涵盖了初始设置、依赖管理以及您的第一个工具部署。
        </p>
      </div>

      <div class="p-6 bg-[#eff4ff] dark:bg-[#1c1c1f] rounded-xl border border-primary/10 mb-12 flex items-center gap-6">
        <div class="w-12 h-12 shrink-0 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <span class="material-symbols-outlined text-2xl">terminal</span>
        </div>
        <div>
          <h4 class="font-bold text-[#0b1c30] dark:text-[#f1f1f1] mb-1">环境要求</h4>
          <p class="text-sm text-[#424656] dark:text-[#a1a1aa]">在继续之前，请确保已安装 Node.js v18+ 和 Git 环境。</p>
        </div>
      </div>

      <article class="prose prose-slate dark:prose-invert max-w-none
                      prose-headings:font-headline prose-headings:font-bold prose-headings:text-[#0b1c30] dark:prose-headings:text-[#f1f1f1]
                      prose-p:text-[#424656] dark:prose-p:text-[#a1a1aa] prose-p:leading-8
                      prose-code:bg-[#eff4ff] dark:prose-code:bg-[#121214] prose-code:text-primary prose-code:px-1.5 prose-code:rounded
                      prose-pre:bg-[#0b1c30] dark:prose-pre:bg-[#1c1c1f] prose-pre:rounded-xl">

        <h2>安装指南</h2>
        <p>我们推荐使用 <code>pnpm</code> 以获得更快的依赖解析速度和更小的磁盘占用。</p>
        <pre class="language-bash"><code>$ pnpm install -g @open-toolbox/cli
$ otbx init my-project</code></pre>

        <h2>核心参数定义</h2>
        <div class="overflow-x-auto my-8">
          <table class="w-full text-left border-collapse">
            <thead class="bg-[#eff4ff] dark:bg-[#1c1c1f] text-[#0b1c30] dark:text-[#f1f1f1]">
            <tr>
              <th class="p-4 font-bold border-b border-slate-200 dark:border-[#27272a]">参数</th>
              <th class="p-4 font-bold border-b border-slate-200 dark:border-[#27272a]">类型</th>
              <th class="p-4 font-bold border-b border-slate-200 dark:border-[#27272a]">描述</th>
            </tr>
            </thead>
            <tbody class="text-[#424656] dark:text-[#a1a1aa]">
            <tr class="border-b border-slate-100 dark:border-[#27272a]">
              <td class="p-4 font-mono text-primary">root_dir</td>
              <td class="p-4">String</td>
              <td class="p-4">自定义二进制文件的根目录。</td>
            </tr>
            </tbody>
          </table>
        </div>

        <blockquote class="border-l-4 border-primary bg-slate-50 dark:bg-[#1c1c1f] p-6 italic rounded-r-xl my-8">
          "Open Toolbox 采用锁步部署机制，确保每个组件都能通过全局注册表的验证。"
        </blockquote>
      </article>

      <div class="mt-20 pt-12 border-t border-slate-200 dark:border-[#27272a] flex justify-between">
        <button class="group text-left">
          <div class="text-[10px] uppercase tracking-widest text-slate-400 mb-2">Previous</div>
          <div class="flex items-center gap-2 font-bold text-primary group-hover:-translate-x-1 transition-transform">
            <span class="material-symbols-outlined">arrow_back</span> 设计哲学
          </div>
        </button>
        <button class="group text-right">
          <div class="text-[10px] uppercase tracking-widest text-slate-400 mb-2">Next</div>
          <div class="flex items-center gap-2 font-bold text-primary group-hover:translate-x-1 transition-transform">
            CLI 参考指南 <span class="material-symbols-outlined">arrow_forward</span>
          </div>
        </button>
      </div>
    </div>
  </main>
</template>