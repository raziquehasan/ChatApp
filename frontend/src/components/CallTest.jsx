import React, { useState } from 'react';
import { useSocketContext } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const CallTest = () => {
    const { socket } = useSocketContext();
    const { authUser } = useAuth();
    const [testResult, setTestResult] = useState('');

    const testSocketConnection = () => {
        if (socket) {
            setTestResult(`✅ Socket connected: ${socket.id}`);
            console.log('Socket test:', socket);
        } else {
            setTestResult('❌ Socket not connected');
        }
    };

    const testMediaPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            setTestResult('✅ Media permissions granted');
            stream.getTracks().forEach(track => track.stop()); // Stop the stream
        } catch (error) {
            setTestResult(`❌ Media permission denied: ${error.message}`);
        }
    };

    const testCallEmit = () => {
        if (socket) {
            socket.emit('test-call', { from: authUser._id, message: 'Test call event' });
            setTestResult('✅ Test call event emitted');
        } else {
            setTestResult('❌ Socket not available');
        }
    };

    return (
        <div className='fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50 max-w-xs'>
            <h3 className='font-bold mb-2'>Call Debug Panel</h3>
            <div className='space-y-2'>
                <button 
                    onClick={testSocketConnection}
                    className='w-full bg-blue-500 text-white p-2 rounded text-sm'
                >
                    Test Socket
                </button>
                <button 
                    onClick={testMediaPermissions}
                    className='w-full bg-green-500 text-white p-2 rounded text-sm'
                >
                    Test Media
                </button>
                <button 
                    onClick={testCallEmit}
                    className='w-full bg-purple-500 text-white p-2 rounded text-sm'
                >
                    Test Call Emit
                </button>
            </div>
            {testResult && (
                <div className='mt-2 p-2 bg-gray-100 rounded text-xs'>
                    {testResult}
                </div>
            )}
        </div>
    );
};

export default CallTest;
