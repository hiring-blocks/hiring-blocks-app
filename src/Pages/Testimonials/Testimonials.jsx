import React,{useEffect} from 'react'
import "./Testimonials.scss"
import img from './img2.jpg';
import img1 from './a.jpeg';

import { useAnimation,motion} from "framer-motion";
import { useInView } from 'react-intersection-observer';

import Carousel from 'react-material-ui-carousel'
const Testimonials = () => {
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
      animation1.start({
        x:0,transition:{duration:1}
      })
    }
    if(!inView){
      animation2.start({
        x:-500
      })
    }
    if(inView){
      animation2.start({
        x:0,transition:{duration:1}
      })
    }
    console.log("hi",inView);
  },[inView])
  return (
    <div id='Testimonials'>
        <div className="container" ref={ref} animate={animation2}>
            <motion.div className="imgBox" ref={ref} animate={animation2}>
                <img src={img} alt="" />
            </motion.div>
            <motion.div className="textBox" ref={ref} animate={animation1}>
                  <h5>Testimonials</h5>
                  <h1>What Our Clients Say About Us</h1>
              <Carousel swipe={true} autoPlay={true} cycleNavigation={true} animation="slide" interval={5000} duration={1000}>
                <div className='testimonialsCard'>
                  <p>"Hiring Blocks worked with me during my job transition & helped me to grab the opportunity in company which were seeking candidates relevant to my skill set. During the whole process, Hiring Blocks contacted me with updated feedback frequently."</p>
                  <div className="peoples">
                    <img src={img1} alt="" />
                    <h5>Sachin Rathi</h5>
                  </div>
                </div>
                <div className='testimonialsCard'>
                  <p>"Hiring Blocks provides excellent customer service and keeps the candidate informed at all recruitment stages with full transparency. Success and Excellence is guaranteed with them. keep up the good work Hiring Blocks, I wish you success in all endeavors."</p>
                  <div className="peoples">
                    <img src={img} alt="" />
                    <h5>Suveer Vatysyayan</h5>
                  </div>
                </div>
              </Carousel>
            </motion.div>
        </div>
    </div>
  )
}

export default Testimonials