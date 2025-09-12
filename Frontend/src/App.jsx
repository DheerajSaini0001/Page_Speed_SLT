import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DarkCard from './Component/DarkCard'
import About from './Component/About'
import  {Routes,Route} from "react-router-dom"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      <Route path='/' element={<DarkCard/>} />
      <Route path='/about' element={  <About/>} />
    </Routes>
    </>
  )
}

export default App
