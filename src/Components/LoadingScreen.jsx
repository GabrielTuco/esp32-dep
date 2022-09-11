import React from 'react'
import ReactLoading from 'react-loading';
import styled from 'styled-components'

export const LoadingScreen = () => {
  return (
    <Box>
        <Loading type="spin" color='black' />
    </Box>
  )
}

const Box= styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(248, 248, 248, 0.205);
  z-index: 1000000;
`

const Loading= styled(ReactLoading)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 101;
`
