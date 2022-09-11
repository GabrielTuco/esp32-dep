import React, { useEffect, useState } from 'react'

const ButtonOnOff = ({ host }) => {
  
  const [ color, setColor ] = useState("#3d3d3d");

  const fetchStatus = () => {

    fetch(`http://${ host }/status`)
      .then(() => { setColor("#2db355") })
      .catch(()=>{ setColor("#e62f1f") })

  }

  useEffect(() => {
    
    fetchStatus();

  }, [])
  
  

  return (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 115.96 115.96"
    height="25px"
    
  >
    <g data-name="Capa 2">
      <g data-name="Capa 1">
        <circle
          cx={57.98}
          cy={57.98}
          r={57.98}
          style={{
            fill: "#4a494a",
          }}
        />
        <circle
          cx={57.98}
          cy={57.98}
          r={44.55}
          style={{
            fill: `${color}`,
          }}
        />
      </g>
    </g>
  </svg>)
}

export default ButtonOnOff
