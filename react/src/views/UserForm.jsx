import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosClient from '../axios-client'
import { useStateContext } from '../contexts/ContextProvider';


export default function UserForm() {


    const {id} = useParams()
    const [loading, setLoading] = useState(false)
    const [errors, seterrors] = useState(null)
    const {setNotification} = useStateContext()
    const navigate = useNavigate()
    const [user, setUser] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })
    console.log('user',user.id)
    if(id){
        useEffect( () => {
            if(user.id === null){
                axiosClient.get(`/users/${id}`)
                .then( ({data}) => {
                    setLoading(false)
                    setUser(data)
                } )
                .catch( () => {
                    setLoading(false)
                })
            }
        }, [])
    }

    const onSubmit = (ev) => {
        ev.preventDefault()
        console.log(localStorage.getItem('ACCESS_TOKEN'))
        if(user.id){
            axiosClient.put(`/users/${user.id}`, user)
            .then( (data) => {
                console.log(data)
                //todo show notifications
                setNotification('User successfully updated')
                navigate('/users')
            } )
            .catch( err => {
                const response = err.response
                if(response && response.status ===422){
                  console.log(response.data.errors)
                  seterrors(response.data.errors)
                }
              })
        }else{
            axiosClient.post(`/users`, user)
            .then( (data) => {
                console.log(data)
                //todo show notifications
                setNotification('User successfully created')
                navigate('/users')
            } )
            .catch( err => {
                const response = err.response
                if(response && response.status ===422){
                  console.log(response.data.errors)
                  seterrors(response.data.errors)
                }
              })
        }
    }

  return (
    <>
    {user.id && <h1>Update User: {user.name}</h1>}
    {!user.id && <h1>New User</h1>}
    <div className='card animated fadeInDown'>
        {loading && (
            <div className='text-center'>Loading...</div>
        )}
        { errors && <div className='alert'>
        {Object.keys(errors).map(key => (
            <p>{errors[key][0]}</p>
        ))}
        </div>
      }

      {!loading &&
        <form onSubmit={onSubmit}>
            <input value={user.name} onChange={ev => setUser({...user, name:ev.target.value})}  placeholder='name' />
            <input value={user.email}  onChange={ev => setUser({...user, email:ev.target.value})} placeholder='email' />
            <input type='password'  onChange={ev => setUser({...user, password:ev.target.value})}  placeholder='password' />
            <input type='password'  onChange={ev => setUser({...user, password_confirmation:ev.target.value})}  placeholder='password confirmation' />
            <button className='btn'>Save</button>
        </form>}

    </div>
    </>
  )
}
