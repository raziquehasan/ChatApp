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


// CORS middleware for API calls
app.use((req, res, next) => {
    const allowedOrigins = [
        'https://chatapp-frontend-s5sc.onrender.com',
        'http://localhost:5173', 
        'http://localhost:5174'
    ];
    
    const origin = req.headers.origin;
    console.log('Request origin:', origin);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        // Always allow the frontend domain for production
        res.setHeader('Access-Control-Allow-Origin', 'https://chatapp-frontend-s5sc.onrender.com');
    }
    
    // Also set for undefined origins (direct API calls)
    if (!origin) {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

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

// API-only backend - no static file serving needed
// Frontend will be deployed separately as static site

const PORT = process.env.PORT || 3000

server.listen(PORT,()=>{
    dbConnect();
    console.log(`Working at ${PORT}`);
})