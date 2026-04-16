import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import svgLoader from 'vite-svg-loader'
import path from 'path'

export default defineConfig({
    plugins: [
        vue(),
        tailwindcss(),
        svgLoader()
    ],
    base: '/',
    server: {
        port: 3000,
        open: true,
        proxy: {
            '/api': {
                target: 'https://opentoolbox.cn',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '/api') // 保留 /api
            }
        }
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        minify: 'esbuild',
        sourcemap: false,
    },
    resolve: {
        alias: {
            // 配置 @ 指向 src 目录
            '@': path.resolve(__dirname, 'src')
        }
    }
})
