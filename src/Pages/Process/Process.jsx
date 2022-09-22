import React from 'react'
import ProcessCard from './ProcessCard'
import "./Process.scss"
const Process = () => {
  return (
    <div id='process'>
        <div className="container">
            <h1>Our Distinct Process</h1>
            <div className="line"></div>
            <div className="box">
                <ProcessCard num="1" title="Strategy for your company" para="Planning from the ground up: setting out committed timelines, delivery dates and full reporting accountabilities designed to suit your needs"/>
                <ProcessCard num="2" title="Job Advertising" para="Utilising social media, job boards, targeted search and our regional internal databases"/>
                <ProcessCard num="3" title="Preliminary Screening" para="Doing the hygine check and shortlisting the right candidates for you"/>
                <ProcessCard num="4" title="Employer Branding" para="Effective promotion and representation of your brand at all stages of the process"/>
                <ProcessCard num="5" title="Video Interviewing" para="Understanding the Cultural Fitment of candidates"/>
                <ProcessCard num="6" title="Positive Candidate Experience" para="Supporting the candidates in a smooth transition from their previous company to yours"/>
            </div>
        </div>
    </div>
  )
}

export default Process