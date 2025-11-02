import React, { useEffect } from "react";
import {Outlet , Navigate} from 'react-router-dom'
import { useAuth } from "../context/AuthContext";

export const VerifyUser = ()=>{
    const {authUser} = useAuth();
    
    useEffect(() => {
        console.log('VerifyUser - authUser:', authUser);
        console.log('VerifyUser - localStorage chatapp:', localStorage.getItem('chatapp'));
    }, [authUser]);
    
    // Add a small delay to ensure auth state is properly set
    if (authUser === undefined) {
        return <div>Loading...</div>;
    }
    
    return authUser ? <Outlet/> : <Navigate to={'/login'} replace/>
}