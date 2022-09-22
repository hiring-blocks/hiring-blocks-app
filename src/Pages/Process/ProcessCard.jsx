import React from 'react'

const ProcessCard = (props) => {
  return (
    <div className='cbox'>
        <div className="circle">{props.num}</div>
        <h3>{props.title}</h3>
        {/* <p>{props.para}</p> */}
    </div>
  )
}

export default ProcessCard