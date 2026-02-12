import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.tsx', 'resources/js/app.js', 'resources/css/app.css'],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    server: {
        host: 'sims4lots.test',
        detectTls: true, 
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
})
