import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';  
import Home from './Home.jsx'
import Register from './Register.jsx'
import Login from './Login.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
