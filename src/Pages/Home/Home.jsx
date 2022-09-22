import React from 'react'
import "./Home.scss"
import hero1 from "./google.png"
import hero from "./abc.png"
// import hero from "./a.png"
import { motion } from "framer-motion"
const Home = () => {
  return (
    <div>
        <div id="home">
            <div className="container">
                <motion.div className="textBox" initial={{x:-1000}} animate={{x:0}} transition={{duration:1}}>
                    <h1>Find a Job With Your Interests and Abilities</h1>
                    <p>Hiring Blocks: Hire in the easiest and decentralized manner.</p>
                    <p>Explore thousands of job opportunitines with all the information you need. It's your future. Come Find it.</p>
                </motion.div>
                <motion.div className="imgBox" initial={{x:1000}} animate={{x:0}} transition={{duration:1}}>
                    <img src={hero} alt="" />
                </motion.div>
            </div>
            <div className="extra">
                {/* <img src={hero1} alt="" className='hero1'/> */}
            </div>
        </div>
    </div>
  )
}

export default Home

// git remote add origin1 https://github.com/vinayakkalra/hiring-blocks.git
// git push origin1