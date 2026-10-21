import React from 'react'
import { Routes , Route } from 'react-router-dom'
import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import Projects from '../pages/Projects'
import Compiler from '../pages/Compiler'
import Project from '../pages/Project'
import SignUp from '../pages/SignUp'
import Login from '../pages/Login'
import { ProtectedRoute, PublicOnlyRoute } from '../components/AuthRoute'

function Outlets() {
  return (
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route element={<PublicOnlyRoute/>}>
          <Route path='/signup' element={<SignUp/>} />
          <Route path='/login' element={<Login/>} />
        </Route>
        <Route element={<ProtectedRoute/>}>
          <Route path='/Dashboard' element={<Dashboard/>}/>
          <Route path='/project/:id' element={<Project/>} />
          <Route path='/Projects' element={<Projects/>}/>
        </Route>
        <Route path='/Compiler' element={<Compiler/>}/>
    </Routes>
  )
}

export default Outlets
