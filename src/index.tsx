/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'
import App from './App'
import { AppStateProvider } from './AppState'
import { initWelshman } from './config/welshman'

// Initialize Welshman configuration
initWelshman();

const root = document.getElementById('root')

render(() => (
  <AppStateProvider>
    <App />
  </AppStateProvider>
), root!)
