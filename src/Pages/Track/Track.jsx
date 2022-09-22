import React,{useEffect} from 'react'
import TrackCard from './TrackCard/TrackCard'
import './Track.scss';

import { useAnimation,motion} from "framer-motion";
import { useInView } from 'react-intersection-observer';
const Track = () => {
  const { ref, inView } = useInView({threshold:0.2 });
  const animation1=useAnimation()
  useEffect(() => {
    if(!inView){
      animation1.start({
        x:1000
      })
    }
    if(inView){
      animation1.start({
        x:0,transition:{duration:1}
      })
    }
    console.log("hi",inView);
  },[inView])
  return (
    <div>
        <div id="track">
            <div className="container" ref={ref} animate={animation1}>
              <h1>The Fast Track To Your Next Job</h1>
              <p>We ensure your next step is a step forward. That's why we have a  marketplace of jobs that cut-off the boring processes.</p>
              <motion.div className="box" ref={ref} animate={animation1}>
                <TrackCard cHeading="Create Your Account" cDetails="Build your reputation with a universal profile that works across hundreds of different employers" />
                <TrackCard cHeading="Explore Your Options" cDetails="Select your preferences (task, salary, location, etc.) and discover jobs most relevant to you."/>
                <TrackCard cHeading="Talk With Recruiter" cDetails="Message multiple recruiter while keeping all communication in one, convenient place."/>
              </motion.div>
            </div>
        </div>
    </div>
  )
}

export default Track