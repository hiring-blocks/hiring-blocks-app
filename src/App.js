import React from 'react'
import About from './Pages/About/About'
import Catagories from './Pages/Catagories/Catagories'
import Footer from './Pages/Footer/Footer'
import Highlights from './Pages/Highlights/Highlights'
import Home from './Pages/Home/Home'
import Jobs from './Pages/Jobs/Jobs'
import Navbar from './Pages/Navbar/Navbar'
import Process from './Pages/Process/Process'
import Testimonials from './Pages/Testimonials/Testimonials'
import Track from './Pages/Track/Track'

const App = () => {
  return (
    <div>
      <Navbar/>
      <Home/>
      <Catagories/>
      <Track/>
      <Highlights/>
      <Process/>
      <About/>
      <Jobs/>
      <Testimonials/>
      <Footer/>
    </div>
  )
}

export default App

