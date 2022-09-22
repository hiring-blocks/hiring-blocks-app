import React,{useEffect} from 'react'
import img1 from '../1.png';
import img2 from '../2.png';
import img3 from '../3.png';

import { useAnimation,motion} from "framer-motion";
import { useInView } from 'react-intersection-observer';
const TrackCard = (props) => {
  const { ref, inView } = useInView({threshold:0.2 });
  const animation1=useAnimation()
  useEffect(() => {
    if(!inView){
      animation1.start({
        y:-100,scale:0
      })
    }
    if(inView){
      animation1.start({
        y:0,scale:1
      })
    }
    console.log("hi",inView);
  },[inView])
  return (
    <motion.div className='sbox' ref={ref} animate={animation1}>
      {
        props.cHeading==="Create Your Account"?<div className="imgBox"><img src={img1} alt="" /></div>:props.cHeading==="Explore Your Options"?<div className="imgBox"><img src={img2} alt="" /></div>:<div className="imgBox"><img src={img3} alt="" /></div>
      }

        <h2>{props.cHeading}</h2>
        <h3>{props.cDetails}</h3>
    </motion.div>
  )
}

export default TrackCard