import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import {NavLink, useNavigate} from 'react-router-dom'
import { IoIosArrowRoundBack } from "react-icons/io";
import { StoreContext } from '../context/StoreProvider'
import url_base from "../config/variables"
import { LoadingScreen } from '../Components/LoadingScreen';
import { useForm } from '../hooks/useForm';
import { types } from '../context/StoreReducer';

export const Register = () => {
    const navigate = useNavigate();
    const [store, dispatch] = useContext(StoreContext);
    const [isLoading, setLoading] = useState(false);

    const {user, password, password2, msg, onInputChange, onSetNewState }= useForm({
      user: '', 
      password: '', 
      password2: '', 
      msg:''
    });

    
    const onPressRegister = async () => {
      
      if(user=='' || password=='' || password2=='') {
        onSetNewState('msg','*Debe llenar todos los campos')
        return false;
      }
      if(password.length<6){
        onSetNewState('msg','La contraseña debe ser mayor a 6 caracteres')
        return false;
      }
      if(password != password2){
        onSetNewState('msg','*Las contraseñas deben ser iguales')
        return false;
      }

      const body = {
        user: user,
        password: password,
        type: true
      }
      setLoading(true)
      const response = await fetch(`${ url_base }/api/users`,{
          method:'POST',
          body:JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' }
      })
      
      if(response.status == 404){
        setLoading(false)
        alert("Error: Server not found")
        
      }
      else if (response.status == 400){
        setLoading(false)
        const data = await response.json()
        onSetNewState('msg',data.msg)  
        return

      } else{
        navigate('/MainPage');
        dispatch({
          type: types.Register,
          body: {
            user:user,  
            type: true
        }});
      }
      
    }
  
    return (
      <Container>
        <Box>
          <ArrowBack to="/login"> 
            <IoIosArrowRoundBack style={{color: 'black', height: '30px', width: '30px', position: 'absolute', left: 15, top: 15}}/>
          </ArrowBack>
          <Title>Crear Cuenta</Title>
          <Subtitle>Creará una cuenta de administrador</Subtitle>
          <div style={{display: 'block', textAlign: 'center'}}>

            <InputLogin 
            onChange={ onInputChange } 
            placeholder="Usuario" 
            name="user" 
            required />

            <InputLogin 
            onChange={ onInputChange } 
            type="password" 
            placeholder="Constraseña" 
            name="password"  
            required />

            <InputLogin 
            onChange={ onInputChange } 
            type="password" 
            placeholder="Confirmar contraseña" 
            name="password2" 
            required />

            <ButtonLogin type ="submit" value="Aceptar" onClick={onPressRegister} />

          </div>
          <Error>{msg}</Error>
        </Box>
        {
          isLoading ? <LoadingScreen/>: <></>
        }
      </Container>
    )
}

const Container = styled.div`
  display: flex; 
  align-content: center; 
  height: 100vh;
`

const Box= styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  margin:auto;
  background-color: white;
  padding: 48px 40px 36px;
  max-height: 500px;
  max-width: 448px;
  height: 100vh;
  width: 100%;
  border-radius: 10px;
  
`
const Title = styled.p`
  color: black;
  text-align: center;
  font-size: 24px;
  margin-bottom: 30px;
`
const Subtitle = styled.p`
  color: black;
  text-align: center;
  font-size: 14px;


`

const InputLogin= styled.input`
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border-style: none;
  border-radius: 4px;
  border: solid 1px #cacaca;
  height: 54px;
  margin-bottom: 20px;
  font-size: 14px;
  &:focus{
    outline: solid 2px #3578E5;
   
  }
  
`
const ButtonLogin= styled.input`
  height: 49px;
  width: 100px;
  color: white;
  font-size: 16px;
  border-style: none;
  border-radius: 4px;
  background-color: black;
  &:hover{
    background-color: #494949;
   
  }
  
`
const ArrowBack = styled(NavLink)`
    svg{
        border-radius: 50%;
        &:hover{
            background-color: #dfdfdf;
        }
        

    }
`
const Error = styled.p`
  color: red;
  font-size: 12px;

`