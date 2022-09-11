import React, { useContext, useState, useRef, memo } from 'react'
import styled from 'styled-components'
import { StoreContext } from '../context/StoreProvider';
import { types } from '../context/StoreReducer';
import ButtonOnOff from './ButtonOnOff'
import { FiEdit2 } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";
import { IoClose } from 'react-icons/io5';
import jwtDecode from 'jwt-decode';
import url_base from "../config/variables"
import { isValidIP } from '../helpers';


export const Camera = memo(({ id, ip, name, change }) => {

    const [store, dispatch] = useContext(StoreContext); //Context

    const {user,actualHost, cameras, token, type} = store; //Store reducer

    const [edit, setEdit] = useState(false);
    const [error, setError] = useState("");

    const nameRef = useRef(null);
    const ipRef = useRef(null);
    
    const onSelected = ()=>{
        if( actualHost !== ip )
          dispatch({
              type: types.ChangeActualHost,
              body: ip
        });
    };

    const onEdit = async()=>{
        //const name = document.getElementById('nameEdit')
        //const ip = document.getElementById('ipEdit')
        onSelected()
        
        if(nameRef.current.value=="" || ipRef.current.value ==""){
            setError('*Debe llenar todos los campos')
            return false;
        }
        if(!isValidIP(ipRef.current.value)){
            setError('*Formato de la dirección IP es incorrecta')
            return false;
        }
        if(nameRef.current.value==name && ipRef.current.value == ip ){
            setError('*Debe cambiar algun campo')
            return false;
        }

        try {
            const { uid }= jwtDecode( token )
            const body = JSON.stringify({
              uid,
              id: id,
              name:nameRef.current.value,
              ip:ipRef.current.value,
            })
            console.log(body);
            change(true)
            const response = await fetch(`${url_base}/api/camera`,{
              method:'PUT',
              body,
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
            })
            
            if(response.status == 404){
              change(false)
              alert("Error: Server not found")
              
            }
            else if (response.status == 400){
              change(false)
              const data = await response.json()
              console.log(data);
              setError(data.msg)
              return
      
            } else {
              
              const data = await response.json(); 
              change(false)
              const { cameras } = data;   
              dispatch({
                type: types.UpdateCameras,
                body: cameras
              });  
              
              setError('')
            }
        } catch (error) {
            console.error(error)
            change(false)
        }

    }
    
    const onDelete = async()=>{
      if (confirm("¿Esta seguro de eliminar esta camara?")){
        try {
          const {uid}= jwtDecode(token)
          const body = JSON.stringify({
            id: id,
            uid
          })
          change(true)
          const response = await fetch(`${url_base}/api/camera`,{
            method:'DELETE',
            body,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
          })
          
          if(response.status == 404){
            change(false)
            alert("Error: Server not found")
            
          }
          else if (response.status == 400){
            change(false)
            const data = await response.json()
            console.log(data.msg)
            
            return
    
          } else{
            
            const data = await response.json(); 
            change(false)
            const {cameras} = data;   
            dispatch({
              type: types.UpdateCameras,
              body: cameras
            });  
            
            setError('')
          }
        } catch (error) {
          console.error(error)
          change(false)
        }
      }
    }

  return (
    <Container onClick={ onSelected } isSelected={ actualHost === ip }>
        <Box >
            { (edit) 
              ? (<BoxInput>
                    <Input ref={ nameRef }  id="nameEdit" placeholder='Nombre de la camara' defaultValue={ name }></Input>
                    <Input ref={ ipRef } id="ipEdit" placeholder='IP de la camara (x.x.x.x)' defaultValue={ ip }></Input>
                </BoxInput>
                )
              : (<div style={{width: "175px"}}>
                    <Word>Nombre: { name }</Word>
                    <Word style={{ marginLeft: "40px" }}>IP: { ip }</Word>
                </div>)
            }
            {
                edit?
                <div>
                    <Box2 onClick={()=> {setEdit(!edit);setError('')}}>
                        <IoClose size="1.5em"/>
                    </Box2>
                    <Box2 onClick={onDelete}>
                        <IoTrashOutline size="1.5em"/>
                    </Box2>
                </div>:
                <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                    {type?
                    <Box2 onClick={()=>{setEdit(!edit); onSelected()}}>
                        <FiEdit2 size="1.1em"/>
                    </Box2>:<></>}
                    <ButtonOnOff host={ip}   />
                </div>
            }
            
        </Box>
        <Error>
              {error}
        </Error>
        {
            edit?
            <BoxButtonAdd hidden={!edit} onClick={onEdit}>
                <ButtonAdd>
                    Aceptar        
                </ButtonAdd>
            </BoxButtonAdd>:
            <></>
        }
        
    </Container>
  )
})
const Container = styled.div`
    height: 100%;
    margin: 0px 10px;
    background-color: ${ props => props.isSelected ? "#4b4b4b" : ""};
    justify-content: space-between;
    border-radius:10px;
    align-items: center;
    padding: 8px 3%;
    
    &:hover{
        background-color: #4b4b4b;
    }
`

const Box = styled.div`
    display: flex;
    justify-content: space-between;
    border-radius:10px;
    align-items: center;
`

const Word = styled.p`
    font-family:  Geneva, Tahoma, sans-serif;
    color: white;
    box-sizing: border-box;
    padding: 0 5px ;
    margin: 0px;
    font-size: .9375rem;
`
const Box2= styled.div`
    height: 30px;
    width: 30px;
    border-radius: 50%;
    display: flex;
    align-items:center;
    justify-content: center;
    
    
    &:hover{
        background-color: #585858;
    }
`
const BoxInput= styled.div`
  margin-top: auto;
  margin-bottom: auto;
`

const Input = styled.input`
  height: 10px;
  display: flex;
  padding: 10px;
  box-sizing: border-box;
  border-style: none;
  border-radius: 4px;
  border: solid 1px #cacaca;
  margin: 5px 0px;
  font-size: 14px;
  &:focus{
    outline: solid 2px #000000;
   
  }
`

const BoxButtonAdd= styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 0px;
    
`

const ButtonAdd= styled.div`
    height: 30px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 16px;
    
    background-color: #ff3034;
    border-radius: 10px;
    &:hover{
        background-color: #fc4d50;
    }    
`
const Error = styled.p`
  color: #ff3b3b;
  font-size: 12px;
  text-align: left;
  margin: 3px 2px;
`