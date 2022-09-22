import React,{useEffect} from 'react'
import "./About.scss"
import img from './img.jpg';


import { useAnimation,motion} from "framer-motion";
import { useInView } from 'react-intersection-observer';
const About = () => {
  const { ref, inView } = useInView({threshold:0.2 });
  const animation1=useAnimation()
  const animation2=useAnimation()
  useEffect(() => {
    if(!inView){
      animation1.start({
        x:500
      })
    }
    if(inView){
      animation2.start({
        x:0,transition:{duration:1}
      })
    }
    if(!inView){
      animation2.start({
        x:-500
      })
    }
    if(inView){
      animation1.start({
        x:0,transition:{duration:1}
      })
    }
    console.log("hi",inView);
  },[inView])
  // const [jobs, setJobs] = useState([])
  useEffect(() => {
    const showJobs=async()=>{
      try {
        const res= await fetch("API_URLapi/totalCompanies")
        const data = await res.json()
        // setJobs(data.jobs)
        console.log(data)
      } catch (error) {
        console.log(error);
      }
    }
    showJobs()
  }, [])
  return (
    <div id='about'>
        <div className="container" ref={ref} animate={animation1}>
            <motion.div className="imgBox" ref={ref} animate={animation2}>
              <img src={img} alt="" />
            </motion.div>
            <motion.div className="textBox" ref={ref} animate={animation1}>
                <h5>About Us</h5>
                <h1>We Provide a Place to Find Trusted Jobs</h1>
                <p>We are a team of people who take talent very seriously. From the front office to the boardroom and from the designer’s chair to the programmer’s cube, hiring blocks aims at cutting the noise and matching trusted jobs with the right talent.</p>
                <div className="ratings">
                  <div className="rating">
                    <h2>600+</h2>
                    <h3>Joined Our Network</h3>
                  </div>
                  <div className="rating">
                    <h2>3+</h2>
                    <h3>years of experience </h3>
                  </div>
                  <div className="rating">
                    <h2>40+</h2>
                    <h3>Clients Partnered with us</h3>
                  </div>
                </div>
            </motion.div>
        </div>
    </div>
  )
}

export default About