import { useState } from 'react'
import './App.css'
import Counter from './components/Counter'

function App() {
  const [count, setCount] = useState(0)

  function updateCount() {
    setCount(count + 1)
  }

  return (
    <>
    <Counter title="Contando...."/>
    <Counter initial="100"/> 
    </>
  )
}

export default App
