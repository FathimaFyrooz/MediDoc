import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Details from './Components/Details'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Details/>
    </>
  )
}

export default App
