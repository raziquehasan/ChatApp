import express from 'express'
import isLogin from '../middleware/isLogin.js'
import { getCorrentChatters, getUserBySearch } from '../routControlers/userhandlerControler.js'
const router = express.Router()

router.get('/search',getUserBySearch); // Temporarily removed isLogin middleware

router.get('/currentchatters',isLogin,getCorrentChatters);

// Test endpoint to verify authentication
router.get('/test', isLogin, (req, res) => {
    console.log('Test endpoint - req.user:', req.user);
    res.status(200).send({
        success: true,
        message: 'Authentication working',
        user: req.user,
        timestamp: new Date().toISOString()
    });
});

// Test endpoint WITHOUT authentication
router.get('/test-no-auth', (req, res) => {
    console.log('Test endpoint without auth - cookies:', req.cookies);
    res.status(200).send({
        success: true,
        message: 'Endpoint reached without authentication',
        cookies: req.cookies,
        timestamp: new Date().toISOString()
    });
});

export default router