import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'RelaxLifeKit',
      fileName: (format) => `relax-life-kit.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'electron'],
      output: {
        globals: {
          vue: 'Vue',
          electron: 'electron'
        }
      }
    }
  }
}) 