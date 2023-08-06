import React, { useEffect, useState } from 'react'
import axiosClient from '../axios-client'
import { useStateContext } from '../contexts/ContextProvider';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Users() {
    console.log('heye')
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const {setNotification} = useStateContext()

    useEffect( () => {
        getUsers()
    }, [])

    const onDelete = (u) => {
        if(!window.confirm("Are you sure you want to delete user?")){
            return
        }

        axiosClient.delete(`/users/${u.id}`)
        .then( () => {
            //TODO show notifications
            setNotification('User deleted')
            getUsers()
        })
    }

    const getUsers = () => {
        console.log('getUsers')
        setLoading(true)
        axiosClient.get('/users')
        .then( ({data}) => {
            console.log('users',data)
            setUsers(data.data)
            setLoading(false)

        } )
        .catch( () => {
            setLoading(false)
        })
    }

  return (
    <div>
        <div style={{display:'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h1>Users</h1>
            <Link to='/users/new' className='btn-add'>Add New</Link>
        </div>
        <div className='card animated fadeInDown'>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Created On</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                {loading &&
                <tbody>
                    <tr>
                        <td colSpan='5' className='text-center'>
                            Loading...
                        </td>
                    </tr>
                </tbody>}

                {
                !loading &&
                    <tbody>
                        {users.map( u =>(
                            <tr>
                                <td>{u.id}</td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.created_at}</td>
                                <td>
                                    <Link className='btn-edit' to={'/users/'+u.id}>Edit</Link>
                                    &nbsp;
                                    <button onClick={ev => onDelete(u)} className='btn-delete'>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                }
            </table>
        </div>
    </div>
  )
}
