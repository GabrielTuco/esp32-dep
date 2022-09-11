import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { StoreContext } from '../context/StoreProvider';
import { types } from '../context/StoreReducer';
import { FiEdit2 } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";
import { IoClose } from 'react-icons/io5';
import jwtDecode from 'jwt-decode';
import url_base from "../config/variables"

export const User = (props) => {
    
    const [store, dispatch] = useContext(StoreContext);
    const {user,actualHost, cameras, token} = store;
    const [edit, setEdit] = useState(false);
    const [error, setError] = useState("");

    const onEdit = async()=>{
        const user = document.getElementById('userEdit')
        const actualpass = document.getElementById('actualPasswordEdit')
        const newpass = document.getElementById('newPasswordEdit')
        
        
        if(user.value=="" || actualpass.value =="" || newpass.value == ""){
            setError('*Debe llenar todos los campos')
            return false;
        }

        if(newpass.value.length<6){
          setError('*La nueva contraseña debe ser mayor a 6 caracteres')
          return false;
      }


        try {
            const {uid}= jwtDecode(token)
            const body = JSON.stringify({
              aid: uid,
              id: props.id,
              user:user.value,
              actualpassword: actualpass.value,
              newpassword:newpass.value,
            })
            props.change(true)
            const response = await fetch(`${url_base}/api/users`,{
              method:'PUT',
              body,
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
            })
            
            if(response.status == 404){
              props.change(false)
              alert("Error: Server not found")
              return
            }
            else if (response.status == 400){
              props.change(false)
              const data = await response.json()
              setError(data.msg)
              return
      
            } else{
              const data = await response.json(); 
              props.change(false)
              const {users} = data;   
              dispatch({
                type: types.UpdateUsers,
                body: users
              });  
              
              setError('')
            }
          } catch (error) {
            props.change(false)
          }

    }
    
    const onDelete = async()=>{
      if (confirm("¿Esta seguro de eliminar este usuario?")){
        try {
          const {uid}= jwtDecode(token)
          const body = JSON.stringify({
            id: props.id,
            aid: uid,
          })
          props.change(true)
          const response = await fetch(`${url_base}/api/users`,{
            method:'DELETE',
            body,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
          })
          
          if(response.status == 404){
            props.change(false)
            alert("Error: Server not found")
            
          }
          else if (response.status == 400){
            props.change(false)
            const data = await response.json()
            console.log(data.msg)
            
            return
    
          } else{
            
            const data = await response.json(); 
            props.change(false)
            const {users} = data;   
            dispatch({
              type: types.UpdateUsers,
              body: users
            });  
            
            setError('')
          }
        } catch (error) {
          
          props.change(false)
        }
      }
    }
  return (
    <Container>
        <Box >
            {   edit?
                <BoxInput>
                    <Input  id="userEdit" placeholder='Nombre del usuario' defaultValue={props.user}></Input>
                    <Input type="password" id="actualPasswordEdit" placeholder='Contraseña actual' ></Input>
                    <Input type="password" id="newPasswordEdit" placeholder='Contraseña nueva' ></Input>
                </BoxInput>:
                <div style={{width: "175px"}}>
                    <Word>Usuario: {props.user}</Word>
                </div>
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
                    <Box2 onClick={()=>{setEdit(!edit)}}>
                        <FiEdit2 size="1.1em"/>
                    </Box2>
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
}

const Container = styled.div`
    height: 100%;
    margin: 0px 10px;
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