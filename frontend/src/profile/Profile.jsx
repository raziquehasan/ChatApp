import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaUser, FaEnvelope, FaEdit, FaSave, FaTimes, FaSignOutAlt, FaArrowLeft, FaCamera, FaUpload } from 'react-icons/fa';

const Profile = () => {
    const { authUser, setAuthUser } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [formData, setFormData] = useState({
        fullname: authUser?.fullname || '',
        username: authUser?.username || '',
        email: authUser?.email || ''
    });

    // Debug: Log authUser to see what data is available
    // console.log('AuthUser data:', authUser);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size should be less than 5MB');
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        setUploadingPhoto(true);
        const formData = new FormData();
        formData.append('profilePhoto', file);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://chatapp-backend-obn4.onrender.com';
            const response = await axios.post(`${apiUrl}/api/user/upload-profile-photo`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            const data = response.data;
            if (data.success !== false) {
                const updatedUser = { ...authUser, profilepic: data.profilePicUrl };
                setAuthUser(updatedUser);
                localStorage.setItem('chatapp', JSON.stringify(updatedUser));
                toast.success('Profile photo updated successfully!');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to upload photo');
        }
        setUploadingPhoto(false);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await axios.put('/api/user/update-profile', formData);
            const data = response.data;
            
            if (data.success !== false) {
                setAuthUser({ ...authUser, ...formData });
                localStorage.setItem('chatapp', JSON.stringify({ ...authUser, ...formData }));
                toast.success('Profile updated successfully!');
                setIsEditing(false);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to update profile');
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://chatapp-backend-obn4.onrender.com';
            await axios.post(`${apiUrl}/api/auth/logout`);
            localStorage.removeItem('chatapp');
            setAuthUser(null);
            toast.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            toast.error('Failed to logout');
        }
    };

    const handleCancel = () => {
        setFormData({
            fullname: authUser?.fullname || '',
            username: authUser?.username || '',
            email: authUser?.email || ''
        });
        setIsEditing(false);
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4'>
            <div className='max-w-2xl mx-auto'>
                {/* Header */}
                <div className='flex items-center justify-between mb-8'>
                    <Link 
                        to='/' 
                        className='flex items-center space-x-2 text-white hover:text-gray-300 transition-colors duration-200'
                    >
                        <FaArrowLeft className='w-5 h-5' />
                        <span>Back to Chat</span>
                    </Link>
                    <h1 className='text-3xl font-bold text-white'>My Profile</h1>
                    <div></div>
                </div>

                {/* Profile Card */}
                <div className='bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden'>
                    {/* Profile Header */}
                    <div className='bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center'>
                        <div className='relative w-24 h-24 mx-auto mb-4'>
                            {authUser?.profilepic ? (
                                <img 
                                    src={authUser.profilepic} 
                                    alt="Profile" 
                                    className='w-24 h-24 rounded-full object-cover border-4 border-white/30'
                                />
                            ) : (
                                <div className='w-24 h-24 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30'>
                                    <FaUser className='w-12 h-12 text-white' />
                                </div>
                            )}
                            
                            {/* Photo Upload Button */}
                            <label className='absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-2 cursor-pointer transition-colors duration-200 shadow-lg'>
                                <FaCamera className='w-4 h-4 text-white' />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className='hidden'
                                    disabled={uploadingPhoto}
                                />
                            </label>
                            
                            {uploadingPhoto && (
                                <div className='absolute inset-0 bg-black/50 rounded-full flex items-center justify-center'>
                                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white'></div>
                                </div>
                            )}
                        </div>
                        <h2 className='text-2xl font-bold text-white mb-2'>
                            {authUser?.fullname}
                        </h2>
                        <p className='text-purple-100'>@{authUser?.username}</p>
                    </div>

                    {/* Profile Content */}
                    <div className='p-8'>
                        <div className='space-y-6'>
                            {/* Full Name */}
                            <div className='space-y-2'>
                                <label className='flex items-center space-x-2 text-white font-medium'>
                                    <FaUser className='w-4 h-4' />
                                    <span>Full Name</span>
                                </label>
                                {isEditing ? (
                                    <input
                                        type='text'
                                        name='fullname'
                                        value={formData.fullname}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200'
                                    />
                                ) : (
                                    <div className='px-4 py-3 bg-white/5 rounded-lg text-white'>
                                        {authUser?.fullname}
                                    </div>
                                )}
                            </div>

                            {/* Username */}
                            <div className='space-y-2'>
                                <label className='flex items-center space-x-2 text-white font-medium'>
                                    <FaUser className='w-4 h-4' />
                                    <span>Username</span>
                                </label>
                                {isEditing ? (
                                    <input
                                        type='text'
                                        name='username'
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200'
                                    />
                                ) : (
                                    <div className='px-4 py-3 bg-white/5 rounded-lg text-white'>
                                        @{authUser?.username}
                                    </div>
                                )}
                            </div>

                            {/* Email */}
                            <div className='space-y-2'>
                                <label className='flex items-center space-x-2 text-white font-medium'>
                                    <FaEnvelope className='w-4 h-4' />
                                    <span>Email</span>
                                </label>
                                {isEditing ? (
                                    <input
                                        type='email'
                                        name='email'
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200'
                                    />
                                ) : (
                                    <div className='px-4 py-3 bg-white/5 rounded-lg text-white'>
                                        {authUser?.email}
                                    </div>
                                )}
                            </div>

                            {/* Gender */}
                            <div className='space-y-2'>
                                <label className='text-white font-medium'>Gender</label>
                                <div className='px-4 py-3 bg-white/5 rounded-lg text-white capitalize'>
                                    {authUser?.gender || 'Not specified'}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='mt-8 flex flex-col sm:flex-row gap-4'>
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className='flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        <FaSave className='w-4 h-4' />
                                        <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className='flex-1 flex items-center justify-center space-x-2 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 transform hover:scale-105'
                                    >
                                        <FaTimes className='w-4 h-4' />
                                        <span>Cancel</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className='flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-105'
                                    >
                                        <FaEdit className='w-4 h-4' />
                                        <span>Edit Profile</span>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className='flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105'
                                    >
                                        <FaSignOutAlt className='w-4 h-4' />
                                        <span>Logout</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
