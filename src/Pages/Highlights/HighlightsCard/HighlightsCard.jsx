import React from 'react'
import { ImDisplay,ImStarEmpty } from "react-icons/im";
import { BsHandbag,BsChatSquareText  } from "react-icons/bs";
import { FiUserCheck,FiUsers } from "react-icons/fi";
const HighlightsCard = (props) => {
  return (
    <div className='HighlightsCard'>
        <div className="background"></div>
        {props.hName==="No more vetting talent"?<FiUserCheck className='icon'/>:props.hName==="Your brand ambassador"?<BsHandbag className='icon'/>:props.hName==="Untapped Pool of Candidates"?<FiUsers className='icon'/>:props.hName==="No email noise"?<BsChatSquareText className='icon'/>:<ImDisplay className='icon'/>}
        <h2>{props.hName}</h2>
        <p>{props.hDetails}</p>
    </div>
  )
}

export default HighlightsCard