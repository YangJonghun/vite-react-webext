import logo from '@/assets/logo.svg'
import { useStorageLocal } from '@/hooks/useStorageLocal'
import { useState } from 'react'
import './Popup.css'

const Popup = () => {
  const [count, setCount] = useState(0)
  const [val] = useStorageLocal<string>({ key: 'webext-demo' })

  const openOptionsPage = () => {
    browser.runtime.openOptionsPage()
  }

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={logo}
          className="App-logo"
          alt="logo"
          onClick={openOptionsPage}
        />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount(count => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          Storage: <b>{val ?? 'not exist'}</b>
        </p>
        <p>
          <button type="button" onClick={openOptionsPage}>
            open option!
          </button>
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer">
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer">
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  )
}

export default Popup
