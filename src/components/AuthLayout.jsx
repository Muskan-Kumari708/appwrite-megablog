import React, { useEffect } from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

export default function Protected({children, authentication = true}){
    const navigate = useNavigate()
    const authStatus = useSelector((state)=> state.auth.status)
    const shouldRedirect = authStatus !== null && authStatus !== authentication
    const canRender = authStatus === null ? !authentication : authStatus === authentication

    useEffect(()=>{
        if (shouldRedirect) navigate(authentication ? "/login" : "/")
    },[shouldRedirect,navigate,authentication])

    return canRender ? <>{children}</> : null

}
