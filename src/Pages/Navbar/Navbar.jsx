import React from 'react'
import "./Navbar.scss"
import logo from './logo.png';
import logo1 from './b.png';
import { motion } from "framer-motion"

const Navbar = () => {
  return (
    <div>
        <div id="Navbar">
            <motion.div className="container" initial={{y:-1000}} animate={{y:0}} transition={{duration:1}}>
                <div className="left">
                    <img src={logo} alt="" className='b1'/>
                    <img src={logo1} alt="" className='b2'/>
                    <h1 className='b3'>Hiring Blocks</h1>
                </div>
                <div className="right">
                    <motion.a href="#about" className='a' initial={{scale:0}} animate={{scale:1}} transition={{duration:1.4}}>About</motion.a>
                    <motion.a href="#" className='a' initial={{scale:0}} animate={{scale:1}} transition={{duration:1.6}}>Contact</motion.a>
                    <a href="https://app.hiringblocks.xyz" className='link'>Login</a>
                </div>
            </motion.div>
        </div>
    </div>
  )
}

export default Navbar