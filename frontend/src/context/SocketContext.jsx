import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocketContext=()=>{
    return useContext(SocketContext);
}

export const SocketContextProvider=({children})=>{
    const [socket , setSocket]= useState(null);
    const [onlineUser,setOnlineUser]=useState([]);
    const {authUser} = useAuth();
    useEffect(()=>{
        if(authUser){
            // console.log('Connecting socket for user:', authUser._id);
            const socket = io("http://localhost:3000",{
                query:{
                    userId:authUser?._id,
                }
            })
            
            socket.on('connect', () => {
                // console.log('Socket connected:', socket.id);
            });
            
            socket.on('disconnect', () => {
                // console.log('Socket disconnected');
            });
            
            socket.on("getOnlineUsers",(users)=>{
                // console.log('Online users:', users);
                setOnlineUser(users)
            });
            
            setSocket(socket);
            return()=>socket.close();
        }else{
            if(socket){
                socket.close();
                setSocket(null); 
            }
        }
    },[authUser]);
    return(
    <SocketContext.Provider value={{socket , onlineUser}}>
        {children}
    </SocketContext.Provider>
    )
}