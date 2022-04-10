import logo from '@/assets/logo.svg'
import { useStorageLocal } from '@/hooks/useStorageLocal'
import './Options.css'

const Options = () => {
  const [value, setValue] = useStorageLocal<string>({ key: 'webext-demo' })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>This is the Options page</p>
        <p>
          <b>Change Storage Value and Check Popup</b>
        </p>
        <input value={value ?? ''} onChange={e => setValue(e.target.value)} />
        <p>
          Powered by{' '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer">
            Vite
          </a>
        </p>
      </header>
    </div>
  )
}

export default Options
