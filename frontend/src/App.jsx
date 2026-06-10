import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentUser from './Hooks/useGetCurrentUser'
import { useSelector } from 'react-redux'
import Home from './pages/Home'
import useGetCity from './Hooks/useGetCity'
import useGetMyShop from './Hooks/useGetMyShop'
import CreateEditShop from './pages/createEditShop'


export const serverUrl = "http://localhost:8080"

function App() {
  const {userData} = useSelector(state=>state.user)
  useGetCurrentUser()
  useGetCity()
  useGetMyShop
  return (
    <Routes>
      <Route path='/signup' element={!userData?<SignUp/>:<Navigate to={"/"}/>}/>
      <Route path='/signin' element={!userData?<SignIn/>:<Navigate to={"/"}/>}/>
      <Route path='/forgot-password' element={!userData?<ForgotPassword/>:<Navigate to={"/"}/>}/>
      <Route path='/' element={userData?<Home/>:<Navigate to={"/signin"}/>}/>
      <Route path='/create-edit-shop' element={userData?<CreateEditShop/>:<Navigate to={"/signin"}/>}/>
    </Routes>
  )
}

export default App