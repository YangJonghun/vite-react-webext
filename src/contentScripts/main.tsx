import App from './App'
import * as ReactDOM from 'react-dom/client'
import { onMessage } from 'webext-bridge'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
;(() => {
  console.info('[vite-react-webext] Hello world from content script')

  // communication example: send previous tab title from background page
  onMessage('tab-prev', ({ data }) => {
    console.log(`[vite-react-webext] Navigate from page "${data.title}"`)
  })

  // mount component to context window
  const container = document.createElement('div')
  const root = document.createElement('div')
  const styleEl = document.createElement('link')
  const shadowDOM =
    container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute(
    'href',
    browser.runtime.getURL('dist/contentScripts/style.css'),
  )
  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(root)
  document.body.appendChild(container)
  const reactRoot = ReactDOM.createRoot(root)
  reactRoot.render(<App />)
})()
