import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Signup from './components/Signup';
import Login from './components/Login';
import Search from './components/Search';
import { Route,createBrowserRouter,createRoutesFromElements,RouterProvider } from 'react-router-dom'
import React from "react";
import './index.css';
import MainLayout from './layouts/Mainlayout';
import AllEntries from './components/AllEntries';
import Home from './components/Home';


const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout/>}>
    <Route path="/home" element={<Home/>}/>
    <Route path="/entry" element={<Hero/>} />  
    <Route path="/signup" element={<Signup/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/search" element={<Search/>}/>
    <Route path="/allEntries" element={<AllEntries/>}/>
    </Route>
    
  )
)

const App = () => {
  return <RouterProvider router={router}/>
  
}

export default App;
