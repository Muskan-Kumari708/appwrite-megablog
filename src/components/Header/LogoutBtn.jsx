import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'

function LogOutBtn({ className = '' }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout())
            navigate('/')
        })
    }

    return (
        <button
           className={`inline-block px-4 lg:px-6 py-2 duration-200 hover:bg-stone-700 hover:text-amber-400 rounded-full ${className}`}
            onClick={logoutHandler}
        >
            Logout
        </button>
    )
}

export default LogOutBtn