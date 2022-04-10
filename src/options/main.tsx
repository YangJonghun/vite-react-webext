import Options from './Options'
import * as ReactDOM from 'react-dom/client'
import '../styles'

const container = document.getElementById('root')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<Options />)
}
