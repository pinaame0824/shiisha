import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    base: '/shiisha/', // GitHub Pagesのリポジトリ名に合わせて設定
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                blog: resolve(__dirname, 'blog/index.html'),
                post1: resolve(__dirname, 'blog/posts/post-1.html'),
                flavors: resolve(__dirname, 'flavors/index.html'),
                reserve: resolve(__dirname, 'reserve/index.html'),
            },
        },
    },
})
