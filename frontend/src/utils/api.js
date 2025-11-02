// API configuration utility
export const getApiUrl = () => {
    return import.meta.env.VITE_API_URL || 'https://chatapp-backend-obn4.onrender.com';
};

export const getSocketUrl = () => {
    return import.meta.env.VITE_SOCKET_URL || 'https://chatapp-backend-obn4.onrender.com';
};
