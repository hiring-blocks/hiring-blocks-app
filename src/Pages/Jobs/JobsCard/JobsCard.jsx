import React from 'react'
import logo from '../logo.svg';
import { AiOutlineClockCircle } from "react-icons/ai";

const JobsCard = (props) => {
  return (
    <div className='smBox'>
        <div className="top">
            <div className="left">
                <img src={props.logo} alt="image" />
                <h2>{props.company}</h2>
            </div>
            {/* <h5>{props.date}</h5> */}
        </div>
        <h4>{props.role}</h4>
        <div className="tags">
            <span>{props.time}</span>
            <span>{props.group}</span>
        </div>
        <h3>{props.location}</h3>
        {/* <p>{props.jobDetails}</p> */}
        <div className="down">
            <h6 className='para'><AiOutlineClockCircle/>{props.created}</h6>
            <a href="https://app.hiringblocks.xyz/find-jobs" className='link'>Apply</a>
        </div>
    </div>
  )
}

export default JobsCard