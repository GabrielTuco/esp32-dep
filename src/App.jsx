
// import { ConfigurationBar } from './Components/ConfigurationBar'
import { BrowserRouter } from 'react-router-dom'
import "./App.css"

import StoreProvider from './context/StoreProvider'
import { AppRouter } from './router/AppRouter'

function App() {
  
  return (

      <StoreProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </StoreProvider>

  )
}

export default App
