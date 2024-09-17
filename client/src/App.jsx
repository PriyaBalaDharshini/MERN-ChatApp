import React from 'react'
import "./App.css";
import { Routes, Route } from "react-router-dom"
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import backgroundImage from "../public/bg.jpeg"


const backgroundStyle = {
  backgroundImage: `url(${backgroundImage})`, // Set background image
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  minHeight: "100vh",
  display: "flex",

};
const App = () => {
  return (
    <div className='App' style={backgroundStyle}>

      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/chat' element={<ChatPage />} />
      </Routes>

    </div>

  )
}

export default App