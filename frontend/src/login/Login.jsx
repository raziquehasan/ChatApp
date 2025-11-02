import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const Login = () => {

    const navigate = useNavigate();
    const {setAuthUser} = useAuth();

    const [userInput, setUserInput] = useState({});
    const [loading, setLoading] = useState(false)

    const handelInput = (e) => {
        setUserInput({
            ...userInput, [e.target.id]: e.target.value
        })
    }
    console.log(userInput);

    const handelSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const login = await axios.post(`/api/auth/login`, userInput);
            const data = login.data;
            console.log('Login response:', data);
            
            if (data.success === false) {
                setLoading(false)
                toast.error(data.message);
                return;
            }
            
            // Success case
            toast.success(data.message || 'Login successful!')
            localStorage.setItem('chatapp', JSON.stringify(data));
            setAuthUser(data);
            setLoading(false);
            
            // Force navigation after a small delay
            setTimeout(() => {
                navigate('/', { replace: true });
            }, 100);
        } catch (error) {
            setLoading(false)
            console.log('Login error:', error);
            toast.error(error?.response?.data?.message || 'Login failed!')
        }
    }
    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900'>
            <div className='w-full max-w-md mx-4'>
                <div className='bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8'>
                    <div className='text-center mb-8'>
                        <h1 className='text-4xl font-bold text-white mb-2'>
                            Welcome Back
                        </h1>
                        <p className='text-gray-300'>Sign in to your account</p>
                    </div>
                    
                    <form onSubmit={handelSubmit} className='space-y-6'>
                        <div className='space-y-2'>
                            <label className='text-white font-medium text-sm'>
                                Email Address
                            </label>
                            <input
                                id='email'
                                type='email'
                                onChange={handelInput}
                                placeholder='Enter your email'
                                required
                                className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                            />
                        </div>
                        
                        <div className='space-y-2'>
                            <label className='text-white font-medium text-sm'>
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                onChange={handelInput}
                                placeholder="Enter your password"
                                required
                                autoComplete="current-password"
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                        
                        <button 
                            type='submit'
                            disabled={loading}
                            className='w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {loading ? (
                                <div className='flex items-center justify-center'>
                                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                                    Signing in...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                    
                    <div className='mt-8 text-center'>
                        <p className='text-gray-300'>
                            Don't have an account?{' '}
                            <Link 
                                to={'/register'} 
                                className='text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200'
                            >
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login