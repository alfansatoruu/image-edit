import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PengolahanGambar from './PengolahanGambar.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PengolahanGambar />
  </StrictMode>,
)
