import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate()
    const {setAuthUser} = useAuth();
    const [loading , setLoading] = useState(false);
    const [inputData , setInputData] = useState({})

    const handelInput=(e)=>{
        setInputData({
            ...inputData , [e.target.id]:e.target.value
        })
    }
console.log(inputData);
    const selectGender=(selectGender)=>{
        setInputData((prev)=>({
            ...prev , gender:selectGender === inputData.gender ? '' : selectGender
        }))
    }

    const handelSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true)
        if(inputData.password !== inputData.confpassword.toLowerCase()){
            setLoading(false)
            return toast.error("Password Dosen't match")
        }
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://chatapp-backend-obn4.onrender.com';
            const register = await axios.post(`${apiUrl}/api/auth/register`,inputData);
            const data = register.data;
            console.log('Register response:', data);
            
            if(data.success === false){
                setLoading(false)
                toast.error(data.message)
                return;
            }
            
            // Success case
            toast.success(data?.message || 'Registration successful!')
            localStorage.setItem('chatapp',JSON.stringify(data))
            setAuthUser(data)
            setLoading(false)
            navigate('/')
        } catch (error) {
            setLoading(false)
            console.log(error);
            toast.error(error?.response?.data?.message)
        }
    }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 py-8'>
        <div className='w-full max-w-lg mx-4'>
            <div className='bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8'>
                <div className='text-center mb-8'>
                    <h1 className='text-4xl font-bold text-white mb-2'>
                        Create Account
                    </h1>
                    <p className='text-gray-300'>Join our community today</p>
                </div>
                
                <form onSubmit={handelSubmit} className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <label className='text-white font-medium text-sm'>
                                Full Name
                            </label>
                            <input
                                id='fullname'
                                type='text'
                                onChange={handelInput}
                                placeholder='Enter full name'
                                required
                                className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200'
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-white font-medium text-sm'>
                                Username
                            </label>
                            <input
                                id='username'
                                type='text'
                                onChange={handelInput}
                                placeholder='Enter username'
                                required
                                className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200'
                            />
                        </div>
                    </div>
                    
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
                            className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200'
                        />
                    </div>
                    
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <label className='text-white font-medium text-sm'>
                                Password
                            </label>
                            <input
                                id='password'
                                type="password"
                                onChange={handelInput}
                                placeholder="Enter your password"
                                autoComplete="new-password"
                                required
                                className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200'
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-white font-medium text-sm'>
                                Confirm Password
                            </label>
                            <input
                                id='confpassword'
                                type='password'
                                onChange={handelInput}
                                placeholder='Confirm password'
                                required
                                className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200'
                            />
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <label className='text-white font-medium text-sm'>
                            Gender
                        </label>
                        <div className='flex gap-6 p-4 bg-white/5 rounded-lg'>
                            <label className='flex items-center space-x-3 cursor-pointer'>
                                <input 
                                    type='radio'
                                    name='gender'
                                    onChange={() => selectGender('male')}
                                    checked={inputData.gender === 'male'}
                                    className='w-4 h-4 text-green-500 bg-transparent border-2 border-white/30 focus:ring-green-500 focus:ring-2'
                                />
                                <span className='text-white'>Male</span>
                            </label>
                            <label className='flex items-center space-x-3 cursor-pointer'>
                                <input 
                                    type='radio'
                                    name='gender'
                                    onChange={() => selectGender('female')}
                                    checked={inputData.gender === 'female'}
                                    className='w-4 h-4 text-green-500 bg-transparent border-2 border-white/30 focus:ring-green-500 focus:ring-2'
                                />
                                <span className='text-white'>Female</span>
                            </label>
                        </div>
                    </div>

                    <button 
                        type='submit'
                        disabled={loading}
                        className='w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mt-6'
                    >
                        {loading ? (
                            <div className='flex items-center justify-center'>
                                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                                Creating Account...
                            </div>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>
                
                <div className='mt-8 text-center'>
                    <p className='text-gray-300'>
                        Already have an account?{' '}
                        <Link 
                            to={'/login'} 
                            className='text-green-400 hover:text-green-300 font-semibold transition-colors duration-200'
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Register