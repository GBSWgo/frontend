import { Routes, Route } from 'react-router-dom'
import './App.css'

import MainPage from './pages/MainPage/MainPage'
import StartPage from './pages/StartPage/StarPage'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import ChatPage from './pages/ChatPage/ChatPage'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<StartPage />} />
      <Route path='/main' element={<MainPage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/chat' element={<ChatPage />} />
    </Routes>
  )
}

export default App