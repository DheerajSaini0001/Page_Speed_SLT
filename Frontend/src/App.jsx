import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DarkCard from './Component/DarkCard'
import About from './Pages/AboutPage'
import  {Routes,Route} from "react-router-dom"
import RawData from './Metrices/RawData'
import { Download } from 'lucide-react'
import Homepage from './Pages/Homepage'
import AboutPage from './Pages/AboutPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      <Route path='/' element={<Homepage/>} />
      <Route path='/about' element={ <AboutPage/>} />
    </Routes>
    
    {/* <Download/> */}
    {/* <RawData/> */}
    </>
  )
}

export default App
