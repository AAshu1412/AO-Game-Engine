import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BabylonProvider } from './babylon/useBabylon.jsx'

createRoot(document.getElementById('root')).render(
  <BabylonProvider>
  <StrictMode>
    <App />
  </StrictMode>
  </BabylonProvider>,
)
