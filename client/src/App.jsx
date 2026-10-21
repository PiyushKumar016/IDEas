//external routes
import './App.css'
import { Routes ,Route } from 'react-router-dom'
// internal Routes
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Compiler from './pages/Compiler'
import Navbar from './shared/Navbar'
import Outlets from './routes/Outlets'
import { EditorContextProvider } from './contexts/editorPanelContext.jsx'
import { TabsContextProvider } from './contexts/tabsContext.jsx'
import { AuthProvider } from './contexts/authcontext.jsx'

function App() {
  return(
    <>
      <AuthProvider>
        <EditorContextProvider>
          <TabsContextProvider>
            <Navbar/>
            <Outlets/>
          </TabsContextProvider>
        </EditorContextProvider>
      </AuthProvider>
    </>
  )
}

export default App
