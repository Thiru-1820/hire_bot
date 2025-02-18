import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import GenerateMCQ from './sections/GenerateMCQ'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <GenerateMCQ/>
    </>
  )
}

export default App
