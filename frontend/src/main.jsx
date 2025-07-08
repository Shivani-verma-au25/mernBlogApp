import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import store  from './store/store'
import ThemeProvider from './components/ThemeProvider'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

const persister = persistStore(store)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null}  persistor={persister}>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
    </PersistGate>
  </Provider>

)
