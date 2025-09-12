import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DarkCard from './Component/DarkCard'
import About from './Component/About'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   <DarkCard/>
   {/* <About/> */}
    </>
  )
}

export default App
