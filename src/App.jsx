
// import { ConfigurationBar } from './Components/ConfigurationBar'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import "./App.css"

import StoreProvider from './context/StoreProvider'
import { AppRouter } from './router/AppRouter'

function App() {
  
  return (

      <StoreProvider>
        <HashRouter>
          <AppRouter />
        </HashRouter>
      </StoreProvider>

  )
}

export default App
