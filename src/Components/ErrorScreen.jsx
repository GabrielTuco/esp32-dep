import React from 'react'

import styled from 'styled-components'
import { IoMdRefresh } from  "react-icons/io";
export const ErrorScreen = (props) => {
  return (
    <Box {...props}>
        <Loading size="6em" color='black'/>
    </Box>
  )
}

const Box= styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(248, 248, 248, 0.11);
  z-index: 1000000;
  &:hover{
    background-color: rgba(248, 248, 248, 0.123);
    svg{
      fill: #ff0000;
    }
  }
`

const Loading= styled(IoMdRefresh)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 101;
`
