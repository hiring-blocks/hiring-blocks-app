import React from 'react'
import HighlightsCard from './HighlightsCard/HighlightsCard'
import "./Highlights.scss"
import iphone from './a.png';
// import iphone from './iphone.png';
import ss from './a.gif';
// import ss from './ss.png';
import { motion } from "framer-motion"
const Highlights = () => {
  return (
    <div id='Highlights'>
        <div className="container">
            <div className="imgBox">
                <div className="ssc">
                    <img src={ss} className="ss"/>
                </div>
                <img src={iphone} className="iphone"/>
            </div>
            <div className="textBox">
                <h1>Perfect for Candidates. Beautiful for Employers.</h1>
                <div className="box">
                    <div className="left">
                        <HighlightsCard hName="No more vetting talent" hDetails="we at Hiring Blocks handle it for you."/>
                        <HighlightsCard hName="Your brand ambassador" hDetails="You Don't need Virat Kohli, you need Hiring Blocks. We will be Your Brand Ambassadors."/>
                    </div>
                    <div className="right">
                        <HighlightsCard hName="Untapped Pool of Candidates" hDetails="Duplicate, who? Connect with the Untapped Pool of Candidates."/>
                        <HighlightsCard hName="No email noise" hDetails="we bring only the best profiles"/>
                    </div>
                </div>

            </div>
        </div>
    </div>
  )
}

export default Highlights