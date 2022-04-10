import { dirname, relative } from 'path'
import { readFile } from 'fs'
import autoImport from 'unplugin-auto-import/vite'
import { r, port, isDev, fastRefresh } from './scripts/utils'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import type { UserConfig } from 'vite'

export const sharedConfig: UserConfig = {
  root: r('src'),
  resolve: {
    alias: {
      '@/': `${r('src')}/`,
    },
  },
  define: {
    __DEV__: isDev,
  },
  plugins: [
    react({ fastRefresh }),
    autoImport({
      include: [/\.[tj]sx?$/],
      imports: [
        {
          'webextension-polyfill': [['*', 'browser']],
        },
      ],
      // Filepath to generate corresponding .d.ts file.
      // Defaults to './src/auto-imports.d.ts' when `typescript` is installed locally.
      // Set `false` to disable.
      dts: r('src/auto-imports.d.ts'),
    }),
    // rewrite assets to use relative path
    {
      name: 'assets-rewrite',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml(html, { path }) {
        return html.replace(
          /"\/assets\//g,
          `"${relative(dirname(path), '/assets')}/`,
        )
      },
    },
  ],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: 'load-js-files-as-jsx',
          setup(build) {
            build.onLoad({ filter: /src\\\.*\.js/ }, async args => ({
              loader: 'jsx',
              contents: void (await readFile(
                args.path,
                { encoding: 'utf8' },
                () => {},
              )),
            }))
          },
        },
      ],
    },
    include: ['react', 'react-dom', 'webextension-polyfill'],
  },
}

export default defineConfig(({ command }) => ({
  ...sharedConfig,
  base: command === 'serve' ? `http://localhost:${port}/` : '/dist/',
  server: {
    port,
    hmr: {
      host: 'localhost',
    },
  },
  build: {
    outDir: r('extension/dist'),
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    // https://developer.chrome.com/docs/webstore/program_policies/#:~:text=Code%20Readability%20Requirements
    terserOptions: {
      mangle: false,
    },
    rollupOptions: {
      input: {
        background: r('src/background/index.html'),
        options: r('src/options/index.html'),
        popup: r('src/popup/index.html'),
      },
    },
  },
}))
