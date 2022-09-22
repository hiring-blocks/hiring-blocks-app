import React,{useEffect } from 'react'
import { MdOutlineAttachMoney,MdAccessibilityNew,MdOutlineSearch,MdTrendingUp,MdOutlineCodeOff  } from "react-icons/md";
import { ImPencil2} from "react-icons/im";
import { useAnimation,motion} from "framer-motion";
import { useInView } from 'react-intersection-observer';

const Card = (props) => {
  const { ref, inView } = useInView({threshold:0.2 });
  const animation=useAnimation()
  useEffect(() => {
    if(!inView){
      animation.start({
        y:-100,scale:0
      })
    }
    if(inView){
      animation.start({
        y:0,scale:1
      })
    }
    console.log("hi",inView);
  },[inView])
  
  return (
    <motion.div className='card' ref={ref} animate={animation}>
        {
            props.cname==="Finance & Accounting"?<MdOutlineAttachMoney className='icon'/>: props.cname==="Find More"?<MdOutlineSearch className='icon'/>:props.cname==="Sales & Marketing"?<MdTrendingUp className='icon'/>:props.cname==="Design"?<ImPencil2 className='icon'/>:props.cname==="Technology & Analytics"?<MdOutlineCodeOff className='icon'/>:<MdAccessibilityNew className='icon'/>
        }
        <h2>{props.cname}</h2>
    </motion.div>
  )
}

export default Card