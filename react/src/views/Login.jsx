import React from 'react'
import { useRef, useState } from 'react';
import axiosClient from '../axios-client';
import { useStateContext } from '../contexts/ContextProvider';


export default function Login() {


  const emailRef = useRef();
  const passwordRef = useRef();
  const [errors, seterrors] = useState(null)
  const {setUser, setToken} = useStateContext()


  const onSubmit = (ev) => {
    ev.preventDefault()
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value
    }
    console.log(payload)
    axiosClient.post('/login', payload)
    .then( ({data}) => {
        console.log('data',data)
      setUser(data.user)
      setToken(data.token)
    } )
    .catch( err => {
      const response = err.response
      if(response && response.status ===422){
        if(response.data.errors){
            seterrors(response.data.errors)
        }
      }
    })
  }

  return (
    <form onSubmit={onSubmit}>
      <h1 className='title'>
        Login into your account
      </h1>

        { errors && <div className='alert'>
        {Object.keys(errors).map(key => (
            <p>{errors[key][0]}</p>
        ))}
        </div>
        }
      <input ref={emailRef} type='email' placeholder='Email'/>
      <input ref={passwordRef} type='password' placeholder='Password'/>
      <button className='btn btn-block'>Login</button>
      <p className='message'>
        Not Registered? <a href='/signup'>Signup</a>
      </p>
    </form>
  )
}
