// generate stub index.html files for dev entry
import { execSync } from 'child_process'
import { r, port, isDev, log, fastRefresh, preambleCode } from './utils'
import fs from 'fs-extra'
import chokidar from 'chokidar'

/**
 * Stub index.html to use Vite in development
 */
export async function stubIndexHtml() {
  const views = ['options', 'popup', 'background']

  const preambleCodeScriptTag = fastRefresh
    ? `<script type="module">${preambleCode}</script>`
    : ''

  for (const view of views) {
    await fs.ensureDir(r(`extension/dist/${view}`))
    let data = await fs.readFile(r(`src/${view}/index.html`), 'utf-8')
    data = data
      .replace(
        /<!-- react-hmr -->/g,
        `<base href="http://localhost:${port}" />
        <script type="module" src="/@vite/client"></script>
        ${preambleCodeScriptTag}`,
      )
      .replace(
        /".\/main.((js|jsx|ts|tsx)?)"/g,
        (_, ext) => `"./${view}/main.${ext}"`,
      )
      .replace(
        '<div id="root"></div>',
        '<div id="root">Vite server did not start</div>',
      )

    await fs.writeFile(r(`extension/dist/${view}/index.html`), data, 'utf-8')
    log('PRE', `stub ${view}`)
  }
}

export function writeManifest() {
  execSync('npx esno ./scripts/manifest.ts', { stdio: 'inherit' })
}

writeManifest()

if (isDev) {
  stubIndexHtml()
  chokidar.watch(r('src/**/*.html')).on('change', () => {
    stubIndexHtml()
  })
  chokidar.watch([r('src/manifest.ts'), r('package.json')]).on('change', () => {
    writeManifest()
  })
}
