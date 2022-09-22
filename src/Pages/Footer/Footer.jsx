import React from 'react'
import "./Footer.scss"
import { BsFillBriefcaseFill,BsFillTelephoneFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
const Footer = () => {
  return (
    <div id='footer'>
      <div className="container">
        <div className="textBox">
          <p>From empowering challenger brands to think out of the usual to helping global brands feel closer to home, we leverage technology in a way that brings people closer to products, content, and experiences they love.</p>
        </div>
        <div className="iconBox">
          <div className="icons">
            <BsFillBriefcaseFill className='icon'/>
            <h4>Find Jobs</h4>
          </div>
          <div className="icons">
            <BsFillTelephoneFill className='icon'/>
            <h4>Contact</h4>
          </div>
          <div className="icons">
            <FaUser className='icon'/>
            <h4>Register</h4>
          </div>
        </div>
      </div>
      <h5> 2022 Hiring Blocks. With all rights reserved.</h5>
    </div>
  )
}

export default Footer