<template>
  <section class="py-24 px-8">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 text-center">
        <router-link to="/notes" class="flex flex-col items-center">
          <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary mb-6 dark:border dark:border-outline-variant">
            <span class="material-symbols-outlined text-4xl">markdown</span>
          </div>
          <h4 class="text-lg font-bold font-headline mb-2 uppercase tracking-wider text-primary">开放学习笔记</h4>
          <p class="text-on-surface-variant text-sm font-body leading-relaxed max-w-xs">个人笔记，记录学习笔记，分享给所有人</p>
        </router-link>
        <router-link to="/files" class="flex flex-col items-center">
          <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary mb-6 dark:border dark:border-outline-variant">
            <span class="material-symbols-outlined text-4xl">picture_as_pdf</span>
          </div>
          <h4 class="text-lg font-bold font-headline mb-2 uppercase tracking-wider text-primary">开放学习文件</h4>
          <p class="text-on-surface-variant text-sm font-body leading-relaxed max-w-xs">通过网络收集到的各类学习资料，分享给所有人</p>
        </router-link>
      </div>
    </div>
  </section>
</template>
