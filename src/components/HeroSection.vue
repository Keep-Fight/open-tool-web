<template>
  <section class="relative pt-24 pb-32 px-8 overflow-hidden">
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.08)_0%,transparent_70%)]"></div>
    </div>
    <div class="max-w-4xl mx-auto text-center relative z-10">
      <h1 class="text-5xl md:text-7xl font-extrabold font-headline tracking-tight text-on-surface mb-6">
        Open Toolbox <span class="text-primary">(开放工具箱)</span>
      </h1>
      <p class="text-lg md:text-xl text-on-surface-variant font-body mb-12 max-w-2xl mx-auto">
        A free, open-source toolbox for developer and designer efficiency. Precision instruments for your daily digital workflow.
      </p>

      <div class="relative max-w-2xl mx-auto group">
        <div class="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <span class="material-symbols-outlined text-outline dark:text-on-surface-variant">search</span>
        </div>
        <input
            class="w-full pl-14 pr-6 py-5 bg-surface-container-low dark:bg-surface-container border border-transparent dark:border-outline-variant rounded-2xl dark:rounded-xl text-on-surface placeholder:text-outline dark:placeholder:text-on-surface-variant focus:ring-2 dark:focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest dark:focus:border-primary shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-none transition-all outline-none text-lg"
            placeholder="Search for tools (e.g., JSON formatter, image compressor)..."
            type="text"
        />
      </div>
    </div>
  </section>
</template>
