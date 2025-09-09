import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Sidebar from './Component/Sidebar'
import DarkCard from './Component/DarkCard'
import Technical_Performance from './Component/Technical_Performance'
import On_Page_SEO from './Component/On_Page_SEO'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    
   <DarkCard/>
   {/* <Technical_Performance/> */}
   {/* <On_Page_SEO/> */}
    </>
  )
}

export default App
