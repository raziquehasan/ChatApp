import React, { useEffect } from "react";
import {Outlet , Navigate} from 'react-router-dom'
import { useAuth } from "../context/AuthContext";

export const VerifyUser = ()=>{
    const {authUser} = useAuth();
    
    useEffect(() => {
        console.log('VerifyUser - authUser:', authUser);
    }, [authUser]);
    
    return authUser ? <Outlet/> : <Navigate to={'/login'} replace/>
}