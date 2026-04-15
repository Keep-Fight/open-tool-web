<template>
  <!-- 修改 top-16 为 top-0，h-[calc(100vh-4rem)] 为 h-[100vh] -->
  <aside class="hidden xl:block w-64 sticky top-0 h-[100vh] py-16 px-8 bg-[#f8f9ff] dark:bg-[#121214] border-l border-slate-200/60 dark:border-[#27272a]">
    <h4 class="font-headline text-[10px] font-black uppercase tracking-[0.2em] text-[#0b1c30] dark:text-[#f1f1f1] mb-8">
      On This Page
    </h4>
    <nav class="space-y-4">
      <a href="#" class="block text-sm font-bold text-primary border-l-2 border-primary pl-4 transition-all">快速开始</a>
      <a href="#" class="block text-sm text-[#424656] dark:text-[#a1a1aa] pl-4 border-l-2 border-transparent hover:text-primary transition-all">安装指南</a>
      <a href="#" class="block text-sm text-[#424656] dark:text-[#a1a1aa] pl-4 border-l-2 border-transparent hover:text-primary transition-all">参数定义</a>
      <a href="#" class="block text-sm text-[#424656] dark:text-[#a1a1aa] pl-4 border-l-2 border-transparent hover:text-primary transition-all">进阶架构</a>
    </nav>

    <div class="mt-12 p-6 bg-primary/5 rounded-xl border border-primary/10">
      <p class="text-[10px] font-black text-primary uppercase tracking-widest mb-3">Beta Feature</p>
      <h5 class="text-xs font-bold text-[#0b1c30] dark:text-[#f1f1f1] mb-2">可视化编辑器</h5>
      <p class="text-[10px] leading-relaxed text-[#424656] dark:text-[#a1a1aa]">尝试在编辑器选项卡中使用我们全新的拖放式架构工具。</p>
      <button class="mt-4 text-[10px] font-bold text-primary flex items-center gap-1 group">
        立即尝试
        <span class="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">open_in_new</span>
      </button>
    </div>
  </aside>
</template>