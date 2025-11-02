import express from "express"
import dotenv from 'dotenv'
import dbConnect from "./DB/dbConnect.js";
import authRouter from  './rout/authUser.js'
import messageRouter from './rout/messageRout.js'
import userRouter from './rout/userRout.js'
import cookieParser from "cookie-parser";
import path from "path";

import {app , server} from './Socket/socket.js'

const __dirname = path.resolve();

dotenv.config();


app.use(express.json());
app.use(cookieParser())

// API Routes
app.use('/api/auth',authRouter)
app.use('/api/message',messageRouter)
app.use('/api/user',userRouter)

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        message: "ChatApp Backend API is running! 🚀",
        status: "success",
        endpoints: {
            auth: "/api/auth",
            messages: "/api/message", 
            users: "/api/user"
        },
        timestamp: new Date().toISOString()
    });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
    });
}

const PORT = process.env.PORT || 3000

server.listen(PORT,()=>{
    dbConnect();
    console.log(`Working at ${PORT}`);
})