import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DarkCard from './Component/DarkCard'
import About from './Component/About'
import  {Routes,Route} from "react-router-dom"
import RawData from './Metrices/RawData'
import { Download } from 'lucide-react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      <Route path='/' element={<DarkCard/>} />
      <Route path='/about' element={ <About/>} />
    </Routes>
    
    {/* <Download/> */}
    {/* <RawData/> */}
    </>
  )
}

export default App
