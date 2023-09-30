import React from 'react'
import { Routes, Route } from 'react-router-dom'
import css from './styles/app.module.scss'
import './styles/constants.scss'
import './styles/global.scss'
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar/Navbar'
import Home from './components/Home/Home'
import ProductsHub from './components/ProductsHub/ProductsHub'
import EmailVerify from './components/EmailVerify/EmailVerify'
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import { UserProvider } from './context/userContext'
import Profile from './components/Profile/Profile'
import { Sidebar } from './components/Sidebar/Sidebar'

const App = () => {
  return (
    <div className={css.mainContainer}>
      <UserProvider>
        <Navbar />
        <div className={css.container}>
          <Toaster />
          <Sidebar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/ProductsHub' element={<ProductsHub />} />
            <Route path='user/:id/verify/:token' element={<EmailVerify />} />
            <Route path='profile' element={<Profile />} />

          </Routes>
        </div>
      </UserProvider>
    </div>
  )
}

export default App