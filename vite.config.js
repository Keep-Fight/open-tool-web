import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import svgLoader from 'vite-svg-loader'
import path from 'path'

export default ({ mode }) => {
    const env = loadEnv(mode, process.cwd())

    const isDev = env.VITE_USE_PROXY === 'true'

    return defineConfig({
        plugins: [
            vue(),
            tailwindcss(),
            svgLoader()
        ],

        server: isDev
            ? {
                proxy: {
                    '/api': {
                        target: 'http://localhost:8080', // 本地后端
                        changeOrigin: true,
                        rewrite: path => path.replace(/^\/api/, '')
                    }
                }
            }
            : undefined,
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
}