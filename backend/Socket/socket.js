import {Server} from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: process.env.NODE_ENV === 'production' 
            ? ['https://chatapp-frontend.onrender.com'] 
            : ['http://localhost:5173', 'http://localhost:5174'],
        methods:["GET","POST"],
        credentials: true
    }
});

export const getReciverSocketId = (receverId)=>{
    return userSocketmap[receverId];
};

const userSocketmap={}; //{userId,socketId}
io.on('connection',(socket)=>{
    const userId = socket.handshake.query.userId;
    console.log('User connected:', userId, 'Socket ID:', socket.id);

    if(userId !== "undefine") userSocketmap[userId] = socket.id;
    console.log('Current user socket map:', userSocketmap);
    io.emit("getOnlineUsers",Object.keys(userSocketmap))

    // WebRTC Call Events
    socket.on('call-user', (data) => {
        const { to, from, callType, callerInfo } = data;
        console.log('Call initiated from:', from, 'to:', to, 'type:', callType);
        const recipientSocketId = userSocketmap[to];
        console.log('Recipient socket ID:', recipientSocketId);
        
        if (recipientSocketId) {
            console.log('Sending incoming call to:', recipientSocketId);
            io.to(recipientSocketId).emit('incoming-call', {
                from,
                callType,
                callerInfo
            });
        } else {
            console.log('Recipient not online or socket not found');
        }
    });

    socket.on('accept-call', (data) => {
        const { to } = data;
        const callerSocketId = userSocketmap[to];
        
        if (callerSocketId) {
            io.to(callerSocketId).emit('call-accepted', {
                from: userId
            });
        }
    });

    socket.on('reject-call', (data) => {
        const { to } = data;
        const callerSocketId = userSocketmap[to];
        
        if (callerSocketId) {
            io.to(callerSocketId).emit('call-rejected', {
                from: userId
            });
        }
    });

    socket.on('end-call', (data) => {
        const { to } = data;
        const recipientSocketId = userSocketmap[to];
        
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('call-ended', {
                from: userId
            });
        }
    });

    // WebRTC Signaling Events
    socket.on('offer', (data) => {
        const { offer, to } = data;
        const recipientSocketId = userSocketmap[to];
        
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('offer', {
                offer,
                from: userId
            });
        }
    });

    socket.on('answer', (data) => {
        const { answer, to } = data;
        const callerSocketId = userSocketmap[to];
        
        if (callerSocketId) {
            io.to(callerSocketId).emit('answer', {
                answer,
                from: userId
            });
        }
    });

    socket.on('ice-candidate', (data) => {
        const { candidate, to } = data;
        const recipientSocketId = userSocketmap[to];
        
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('ice-candidate', {
                candidate,
                from: userId
            });
        }
    });

    socket.on('disconnect',()=>{
        delete userSocketmap[userId],
        io.emit('getOnlineUsers',Object.keys(userSocketmap))
    });
});

export {app , io , server}