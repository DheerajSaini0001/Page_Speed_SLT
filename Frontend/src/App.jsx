import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Navbar from './Component/Navbar'
import Sidebar from './Component/Sidebar'
import DarkCard from './Component/DarkCard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    
    <Navbar/>
   <DarkCard/>
    </>
  )
}

export default App
