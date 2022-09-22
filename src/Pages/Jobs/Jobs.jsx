import React,{useEffect,useState} from 'react'
import JobsCard from './JobsCard/JobsCard'
import "./Jobs.scss"
// const api=[
//     {
//     company:"Discords",
//     date:"7 Mar", 
//     role:"Finance Manager", 
//     time:"Full-Time", 
//     group:"Tech",
//     location:"Manhatten,NY",
//     jobDetails:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore dolorum labore, fuga distinctio quisquam recusandae!"
//     },
//     {
//     company:"Discord",
//     date:"7 Mar", 
//     role:"Finance Manager", 
//     time:"Full-Time", 
//     group:"Tech",
//     location:"Manhatten,NY",
//     jobDetails:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore dolorum labore, fuga distinctio quisquam recusandae!"
//     },
//     {
//     company:"Discord",
//     date:"7 Mar", 
//     role:"Finance Manager", 
//     time:"Full-Time", 
//     group:"Tech",
//     location:"Manhatten,NY",
//     jobDetails:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore dolorum labore, fuga distinctio quisquam recusandae!"
//     },
//     {
//     company:"Discord",
//     date:"7 Mar", 
//     role:"Finance Manager", 
//     time:"Full-Time", 
//     group:"Tech",
//     location:"Manhatten,NY",
//     jobDetails:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore dolorum labore, fuga distinctio quisquam recusandae!"
//     },
//     {
//     company:"Discord",
//     date:"7 Mar", 
//     role:"Finance Manager", 
//     time:"Full-Time", 
//     group:"Tech",
//     location:"Manhatten,NY",
//     jobDetails:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore dolorum labore, fuga distinctio quisquam recusandae!"
//     },
//     {
//     company:"Discord",
//     date:"7 Mar", 
//     role:"Finance Manager", 
//     time:"Full-Time", 
//     group:"Tech",
//     location:"Manhatten,NY",
//     jobDetails:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore dolorum labore, fuga distinctio quisquam recusandae!"
//     },
//     {
//     company:"Discord",
//     date:"7 Mar", 
//     role:"Finance Manager", 
//     time:"Full-Time", 
//     group:"Tech",
//     location:"Manhatten,NY",
//     jobDetails:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore dolorum labore, fuga distinctio quisquam recusandae!"
//     },
//     {
//     company:"Discord",
//     date:"7 Mar", 
//     role:"Finance Manager", 
//     time:"Full-Time", 
//     group:"Tech",
//     location:"Manhatten,NY",
//     jobDetails:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore dolorum labore, fuga distinctio quisquam recusandae!"
//     },
//     {
//     company:"Discord",
//     date:"7 Mar", 
//     role:"Finance Manager", 
//     time:"Full-Time", 
//     group:"Tech",
//     location:"Manhatten,NY",
//     jobDetails:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore dolorum labore, fuga distinctio quisquam recusandae!"
//     },
//     {
//     company:"Discord",
//     date:"7 Mar", 
//     role:"Finance Manager", 
//     time:"Full-Time", 
//     group:"Tech",
//     location:"Manhatten,NY",
//     jobDetails:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore dolorum labore, fuga distinctio quisquam recusandae!"
//     },
//     {
//     company:"Discord",
//     date:"7 Mar", 
//     role:"Finance Manager", 
//     time:"Full-Time", 
//     group:"Tech",
//     location:"Manhatten,NY",
//     jobDetails:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore dolorum labore, fuga distinctio quisquam recusandae!"
//     },
// ]
const Jobs = () => {
    // API_URLapi/recent_jobs
    const [jobs, setJobs] = useState([])
    useEffect(() => {
      const showJobs=async()=>{
        try {
          const res= await fetch("API_URLapi/recent_jobs")
          const data = await res.json()
          setJobs(data.jobs.slice(0,6))
          console.log(data.jobs.slice(0,5))
        } catch (error) {
          console.log(error);
        }
      }
      showJobs()
    }, [])
    const timeCalculate = (updateTime) => {
      const curruntYear = new Date().getFullYear();
      const curruntMonth = new Date().getMonth();
      const curruntDate = new Date().getDate();
      const updateYear = new Date(updateTime).getFullYear();
      const updateMonth = new Date(updateTime).getMonth();
      const updateDate = new Date(updateTime).getDate();
  
      if (curruntYear - updateYear > 0) {
        return `${curruntYear - updateYear} YEAR AGO`;
      } else if (curruntMonth - updateMonth > 0) {
        return `${curruntMonth - updateMonth} Months Ago`;
      } else if (curruntDate - updateDate >= 7 && curruntDate - updateDate < 31) {
        return `${Math.floor((curruntDate - updateDate) / 7)} WEEK AGO`;
      } else if (curruntDate - updateDate < 7 && curruntDate - updateDate > 0) {
        return `${curruntDate - updateDate} DAY AGO`;
      } else if (curruntDate - updateDate === 0) {
        return `TODAY`;
      }
    };
  return (
    <div>
        <div id="jobs">
            <div className="container">
                <h1>Newest Job Listing</h1>
                <p>Narrow down your application and let the most appealing and matching companies show off</p>
                <div className="box">
                    {
                        jobs.map((e)=>{
                          return(
                              <JobsCard company={e.company_name} date={e.address1} role={e.job_title} time={e.job_type} group={e.workplace} location={e.address2} jobDetails={e.company_description} logo={e.company_logo} created={timeCalculate(e.created_at)}/>
                          )
                        })
                    }
                </div>
                <a href="https://app.hiringblocks.xyz/log-in" className='find'>Find More</a>
            </div>
        </div>
    </div>
  )
}

export default Jobs

                        {/* api.map((e)=>{
                            return(
                                <JobsCard company={e.company} date={e.date} role={e.role} time={e.time} group={e.group} location={e.location} jobDetails={e.jobDetails}/>
                            )
                        }) */}