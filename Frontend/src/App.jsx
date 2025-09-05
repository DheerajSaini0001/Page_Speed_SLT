import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Accessibility from './Component/Accessibility'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Accessibility/>
    </>
  )
}

export default App
