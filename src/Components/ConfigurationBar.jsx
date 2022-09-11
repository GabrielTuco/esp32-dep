import React, { useEffect, useState } from 'react'
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarContent,  } from 'react-pro-sidebar';
import styled from 'styled-components'

import { Camera } from '../Components/Camera';
import { TbDeviceComputerCamera } from 'react-icons/tb';
import { LoadingScreen } from './LoadingScreen';
import { ErrorScreen } from './ErrorScreen';

import 'react-pro-sidebar/dist/css/styles.css';
import menu from '../images/IconConfiguration.svg'
import close from '../images/Recurso 1.svg'

import '../index.css'

export const ConfigurationBar = (props) => {
 
  // let enrollButton
  let agc 
  let agcGain 
  let gainCeiling
  let aec
  let exposure 
  let awb 
  let wb
  let detect
  let recognize 
  let framesize 
  
  const [isSelected, setIsSelected] = useState(true);
  const [isLoading, setLoading] = useState(0);
  const [refresh, setRefresh] = useState(false);

  var baseHost = "http://"+ props.host

  const hide = el => {
    el.classList.add('hidden')
  }
  const show = el => {
    el.classList.remove('hidden')
  }

  const disable = el => {
    el.classList.add('disabled')
    el.disabled = true
  }

  const enable = el => {
    el.classList.remove('disabled')
    el.disabled = false
  }
  
  const updateValue = (element, value, updateRemote) => {
    updateRemote = updateRemote == null ? true : updateRemote
    let initialValue
    if (element.type === 'checkbox') {
      initialValue = element.checked
      value = !!value
      element.checked = value
    } else {
      initialValue = element.value
      element.value = value
    }

    if (updateRemote && initialValue !== value) {
      updateConfig(element);
    } else if(!updateRemote){
      if(element.id === "aec"){
        value ? hide(exposure) : show(exposure)
      } else if(element.id === "agc"){
        if (value) {
          show(gainCeiling)
          hide(agcGain)
        } else {
          hide(gainCeiling)
          show(agcGain)
        }
      } else if(element.id === "awb_gain"){
        value ? show(wb) : hide(wb)
      } else if(element.id === "face_recognize"){
        value ? enable(props.enrollButtonRef.current) : disable(props.enrollButtonRef.current)
      }
      }
  }
  
    const updateConfig = ( element ) => {
      let value
      switch (element.type) {
        case 'checkbox':
          value = element.checked ? 1 : 0
          break
        case 'range':
        case 'select-one':
          value = element.value
          break
        case 'button':
        case 'submit':
          value = '1'
          break
        default:
          return
      }
  
      const query = `${baseHost}/control?var=${element.id}&val=${value}`
  
      fetch(query)
        .then(response => {
          console.log(`request to ${query} finished, status: ${response.status}`)
        })
    }
    useEffect(() => {
      setLoading(1)
      agc = document.getElementById('agc')
      agcGain = document.getElementById('agc_gain-group')
      gainCeiling = document.getElementById('gainceiling-group')
      aec = document.getElementById('aec')
      exposure = document.getElementById('aec_value-group')
      awb = document.getElementById('awb_gain')
      wb = document.getElementById('wb_mode-group')
      detect = document.getElementById('face_detect')
      recognize = document.getElementById('face_recognize')
      framesize = document.getElementById('framesize')

      console.log(baseHost )
      fetch(`${baseHost}/status`).then(
        (response) => response.json()
      )
      .then(function (state) {
        setLoading(0)
        document
          .querySelectorAll('.default-action')
          .forEach(el => {
            updateValue(el, state[el.id], false)
          })
      }).catch((error)=>{
        console.error(error)
        setLoading(2)
      })
    }, [props.host,refresh])


    useEffect(() => {
      //setLoading(1)
      document
        .querySelectorAll('.close')
        .forEach(el => {
          el.onclick = () => {
            hide(el.parentNode)
          }
        })
      
      // enrollButton = document.getElementById('face_enroll')
      props.enrollButtonRef.current.onclick = () => {
        updateConfig(props.enrollButtonRef.current)
      }
    
      // Attach default on change action
      document
        .querySelectorAll('.default-action')
        .forEach(el => {
          el.onchange = () => updateConfig(el)
        })
    
      // Custom actions
      // Gain
      agc = document.getElementById('agc')
      agcGain = document.getElementById('agc_gain-group')
      gainCeiling = document.getElementById('gainceiling-group')
      agc.onchange = () => {
        updateConfig(agc)
        if (agc.checked) {
          show(gainCeiling)
          hide(agcGain)
        } else {
          hide(gainCeiling)
          show(agcGain)
        }
      }
    
      // Exposure
      aec = document.getElementById('aec')
      exposure = document.getElementById('aec_value-group')
      aec.onchange = () => {
        updateConfig(aec)
        aec.checked ? hide(exposure) : show(exposure)
      }
    
      // AWB
      awb = document.getElementById('awb_gain')
      wb = document.getElementById('wb_mode-group')
      awb.onchange = () => {
        updateConfig(awb)
        awb.checked ? show(wb) : hide(wb)
      }
    
      // Detection and framesize
      detect = document.getElementById('face_detect')
      recognize = document.getElementById('face_recognize')
      framesize = document.getElementById('framesize')
    
      framesize.onchange = () => {
        updateConfig(framesize)
        if (framesize.value > 5) {
          updateValue(detect, false)
          updateValue(recognize, false)
        }
      }
    
      detect.onchange = () => {
        if (framesize.value > 5) {
          alert("Please select CIF or lower resolution before enabling this feature!");
          updateValue(detect, false)
          return;
        }
        updateConfig(detect)
        if (!detect.checked) {
          disable(props.enrollButtonRef.current)
          updateValue(recognize, false)
        }
      }
    
      recognize.onchange = () => {
        if (framesize.value > 5) {
          alert("Please select CIF or lower resolution before enabling this feature!");
          updateValue(recognize, false)
          return;
        }
        updateConfig(recognize)
        if (recognize.checked) {
          enable(props.enrollButtonRef.current)
          updateValue(detect, true)
        } else {
          disable(props.enrollButtonRef.current)
        }
      }
    }, [])
    
    const Screen= () => {
      switch (isLoading){
        case 0: return(<></>)
        case 1: return (<LoadingScreen/>)
        case 2: return (<ErrorScreen onClick={()=>{setRefresh(!refresh)}}></ErrorScreen>)

      }  
    }
    
    
      return (
        <SideBarDiv>
          <ProSidebar collapsed={isSelected} collapsedWidth="0px" width="320px">
            <SidebarHeader>
                
                  <User>  
                      <h2 style={{textAlign: 'center', width: '90%'}}>Configuration - {props.host}</h2> 
                      <Close hidden={isSelected} onClick={()=> {setIsSelected(!isSelected)}}>
                          <img height="50%" style={{margin:"auto"}} src={close}></img>
                      </Close>
                  </User>
                
            </SidebarHeader>
            <Menu>
              <SubMenu title="Camara" icon={<TbDeviceComputerCamera size="1.8em"/>}>
              <Screen/>
                <input type="checkbox" id="nav-toggle-cb" defaultChecked="checked"/>
                <nav id="menu">
                    <div className="input-group" id="framesize-group">
                        <label htmlFor="framesize">Resolution</label>
                        <select id="framesize" width="10px" className="default-action" defaultChecked="0">
                            <option value="10">UXGA(1600x1200)</option>
                            <option value="9">SXGA(1280x1024)</option>
                            <option value="8">XGA(1024x768)</option>
                            <option value="7">SVGA(800x600)</option>
                            <option value="6">VGA(640x480)</option>
                            <option value="5">CIF(400x296)</option>
                            <option value="4">QVGA(320x240)</option>
                            <option value="3">HQVGA(240x176)</option>
                            <option value="0">QQVGA(160x120)</option>
                        </select>
                    </div>
                    <div className="input-group" id="quality-group">
                        <label htmlFor="quality">Quality</label>
                        <div className="range-min">10</div>
                        <input type="range" id="quality" min="10" max="63" defaultValue="10" className="default-action"/>
                        <div className="range-max">63</div>
                    </div>
                    <div className="input-group" id="brightness-group">
                        <label htmlFor="brightness">Brightness</label>
                        <div className="range-min">-2</div>
                        <input type="range" id="brightness" min="-2" max="2" defaultValue="0" className="default-action"/>
                        <div className="range-max">2</div>
                    </div>
                    <div className="input-group" id="contrast-group">
                        <label htmlFor="contrast">Contrast</label>
                        <div className="range-min">-2</div>
                        <input type="range" id="contrast" min="-2" max="2" defaultValue="0" className="default-action"/>
                        <div className="range-max">2</div>
                    </div>
                    <div className="input-group" id="saturation-group">
                        <label htmlFor="saturation">Saturation</label>
                        <div className="range-min">-2</div>
                        <input type="range" id="saturation" min="-2" max="2" defaultValue="0" className="default-action"/>
                        <div className="range-max">2</div>
                    </div>
                    <div className="input-group" id="special_effect-group">
                        <label htmlFor="special_effect">Special Effect</label>
                        <select id="special_effect" className="default-action" defaultChecked="0">
                            <option value="0">No Effect</option>
                            <option value="1">Negative</option>
                            <option value="2">Grayscale</option>
                            <option value="3">Red Tint</option>
                            <option value="4">Green Tint</option>
                            <option value="5">Blue Tint</option>
                            <option value="6">Sepia</option>
                        </select>
                    </div>
                    <div className="input-group" id="awb-group">
                        <label htmlFor="awb">AWB</label>
                        <div className="switch">
                            <input id="awb" type="checkbox" className="default-action" defaultChecked="checked"/>
                            <label className="slider" htmlFor="awb"></label>
                        </div>
                    </div>
                    
                    <div className="input-group" id="awb_gain-group">
                        <label htmlFor="awb_gain">AWB Gain</label>
                        <div className="switch">
                            <input id="awb_gain" type="checkbox" className="default-action" defaultChecked="checked"/>
                            <label className="slider" htmlFor="awb_gain"></label>
                        </div>
                    </div>
                    <div className="input-group" id="wb_mode-group">
                        <label htmlFor="wb_mode">WB Mode</label>
                        <select id="wb_mode" className="default-action" defaultChecked="0">
                            <option value="0" >Auto</option>
                            <option value="1">Sunny</option>
                            <option value="2">Cloudy</option>
                            <option value="3">Office</option>
                            <option value="4">Home</option>
                        </select>
                    </div>
                    <div className="input-group" id="aec-group">
                        <label htmlFor="aec">AEC SENSOR</label>
                        <div className="switch">
                            <input id="aec" type="checkbox" className="default-action" defaultChecked="checked"/>
                            <label className="slider" htmlFor="aec"></label>
                        </div>
                    </div>
                    <div className="input-group" id="aec2-group">
                        <label htmlFor="aec2">AEC DSP</label>
                        <div className="switch">
                            <input id="aec2" type="checkbox" className="default-action" defaultChecked="checked"/>
                            <label className="slider" htmlFor="aec2"></label>
                        </div>
                    </div>
                    <div className="input-group" id="ae_level-group">
                        <label htmlFor="ae_level">AE Level</label>
                        <div className="range-min">-2</div>
                        <input type="range" id="ae_level" min="-2" max="2" defaultValue="0" className="default-action"/>
                        <div className="range-max">2</div>
                    </div>
                    <div className="input-group" id="aec_value-group">
                        <label htmlFor="aec_value">Exposure</label>
                        <div className="range-min">0</div>
                        <input type="range" id="aec_value" min="0" max="1200" defaultValue="204" className="default-action"/>
                        <div className="range-max">1200</div>
                    </div>
                    <div className="input-group" id="agc-group">
                        <label htmlFor="agc">AGC</label>
                        <div className="switch">
                            <input id="agc" type="checkbox" className="default-action" defaultChecked="checked"/>
                            <label className="slider" htmlFor="agc"></label>
                        </div>
                    </div>
                    <div className="input-group hidden" id="agc_gain-group">
                        <label htmlFor="agc_gain">Gain</label>
                        <div className="range-min">1x</div>
                        <input type="range" id="agc_gain" min="0" max="30" defaultValue="5" className="default-action"/>
                        <div className="range-max">31x</div>
                    </div>
                    <div className="input-group" id="gainceiling-group">
                        <label htmlFor="gainceiling">Gain Ceiling</label>
                        <div className="range-min">2x</div>
                        <input type="range" id="gainceiling" min="0" max="6" defaultValue="0" className="default-action"/>
                        <div className="range-max">128x</div>
                    </div>
                    <div className="input-group" id="bpc-group">
                        <label htmlFor="bpc">BPC</label>
                        <div className="switch">
                            <input id="bpc" type="checkbox" className="default-action"/>
                            <label className="slider" htmlFor="bpc"></label>
                        </div>
                    </div>
                    <div className="input-group" id="wpc-group">
                        <label htmlFor="wpc">WPC</label>
                        <div className="switch">
                            <input id="wpc" type="checkbox" className="default-action" defaultChecked="checked"/>
                            <label className="slider" htmlFor="wpc"></label>
                        </div>
                    </div>
                    <div className="input-group" id="raw_gma-group">
                        <label htmlFor="raw_gma">Raw GMA</label>
                        <div className="switch">
                            <input id="raw_gma" type="checkbox" className="default-action" defaultChecked="checked"/>
                            <label className="slider" htmlFor="raw_gma"></label>
                        </div>
                    </div>
                    <div className="input-group" id="lenc-group">
                        <label htmlFor="lenc">Lens Correction</label>
                        <div className="switch">
                            <input id="lenc" type="checkbox" className="default-action" defaultChecked="checked"/>
                            <label className="slider" htmlFor="lenc"></label>
                        </div>
                    </div>
                    <div className="input-group" id="hmirror-group">
                        <label htmlFor="hmirror">H-Mirror</label>
                        <div className="switch">
                            <input id="hmirror" type="checkbox" className="default-action" defaultChecked="checked"/>
                            <label className="slider" htmlFor="hmirror"></label>
                        </div>
                    </div>
                    <div className="input-group" id="vflip-group">
                        <label htmlFor="vflip">V-Flip</label>
                        <div className="switch">
                            <input id="vflip" type="checkbox" className="default-action" defaultChecked="checked"/>
                            <label className="slider" htmlFor="vflip"></label>
                        </div>
                    </div>
                    <div className="input-group" id="dcw-group">
                        <label htmlFor="dcw">DCW (Downsize EN)</label>
                        <div className="switch">
                            <input id="dcw" type="checkbox" className="default-action" defaultChecked="checked"/>
                            <label className="slider" htmlFor="dcw"></label>
                        </div>
                    </div>
                    <div className="input-group" id="colorbar-group">
                        <label htmlFor="colorbar">Color Bar</label>
                        <div className="switch">
                            <input id="colorbar" type="checkbox" className="default-action"/>
                            <label className="slider" htmlFor="colorbar"></label>
                        </div>
                    </div>
                    <div className="input-group" id="face_detect-group">
                        <label htmlFor="face_detect">Face Detection</label>
                        <div className="switch">
                            <input id="face_detect" type="checkbox" className="default-action"/>
                            <label className="slider" htmlFor="face_detect"></label>
                        </div>
                    </div>
                    <div className="input-group" id="face_recognize-group">
                        <label htmlFor="face_recognize">Face Recognition</label>
                        <div className="switch">
                            <input id="face_recognize" type="checkbox" className="default-action"/>
                            <label className="slider" htmlFor="face_recognize"></label>
                        </div>
                    </div>
                    
                </nav>
                
              </SubMenu>
              
            </Menu>
                
        </ProSidebar>
        <ButtonSidebar onClick={()=> {setIsSelected(!isSelected)}} hidden={!isSelected}>
        <img height="100%" width="60%" src={menu} ></img>
    </ButtonSidebar>
</SideBarDiv>        
)}

const SideBarDiv= styled.div`
    height: 100%;
    display: flex;
    position: absolute;
    right: 0;
`   

const User= styled.div`
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  display:flex;
  align-items:center;
  align-content: center;
  justify-content: space-between;
  padding: 0 4%;
`
const ButtonSidebar= styled.div`
    height: 50px;
    width: 50px;
    text-align: center;
    
    &:hover{
        background-color: #323232;
    }
`
const Close= styled.div`
    height: 30px;
    width: 30px;
    border-radius: 50%;
    display: flex;
       
    &:hover{
        background-color: #585858;
    }
`