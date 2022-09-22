import React,{useEffect} from 'react'
import Card from './Card/Card'
import "./Catagories.scss"

import { useAnimation,motion} from "framer-motion";
import { useInView } from 'react-intersection-observer';
const Catagories = () => {
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
        <div id="catagories">
            <div className="container">
                <h1>Most Demaned Job Catagories</h1>
                <div className="box" ref={ref} animate={animation1}>
                    <Card cname="Technology & Analytics" jobs="214"/>
                    <Card cname="Sales & Marketing" jobs="132"/>
                    <Card cname="Finance & Accounting" jobs="198"/>
                    <Card cname="Design" jobs="183" icon="MdOutlineAttachMoney"/>
                    <Card cname="Find More" jobs="121"/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Catagories