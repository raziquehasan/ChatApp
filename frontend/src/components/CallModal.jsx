import React, { useState, useEffect, useRef } from 'react';
import { FaPhone, FaPhoneSlash, FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaTimes } from 'react-icons/fa';
import { useSocketContext } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const CallModal = ({ isOpen, onClose, callType, recipientUser, isIncoming = false, callData = null }) => {
    const { socket } = useSocketContext();
    const { authUser } = useAuth();
    const [callStatus, setCallStatus] = useState(isIncoming ? 'incoming' : 'calling'); // calling, connected, ended
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(callType === 'audio');
    const [callDuration, setCallDuration] = useState(0);
    
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const localStreamRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const callTimerRef = useRef(null);
    const callTimeoutRef = useRef(null);

    // WebRTC configuration
    const rtcConfiguration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ]
    };

    useEffect(() => {
        if (isOpen) {
            initializeCall();
        }
        return () => {
            cleanup();
        };
    }, [isOpen]);

    useEffect(() => {
        if (callStatus === 'connected') {
            startCallTimer();
        }
        return () => {
            if (callTimerRef.current) {
                clearInterval(callTimerRef.current);
            }
        };
    }, [callStatus]);

    const startCallTimer = () => {
        callTimerRef.current = setInterval(() => {
            setCallDuration(prev => prev + 1);
        }, 1000);
    };

    const formatCallDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const initializeCall = async () => {
        try {
            console.log('Initializing call with type:', callType);
            
            // Check if browser supports getUserMedia
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Browser does not support media devices');
            }
            
            // Get user media
            const constraints = {
                audio: true,
                video: callType === 'video'
            };
            
            console.log('Requesting media with constraints:', constraints);
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            console.log('Media stream obtained:', stream);
            localStreamRef.current = stream;
            
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            // Initialize peer connection
            peerConnectionRef.current = new RTCPeerConnection(rtcConfiguration);
            
            // Add local stream to peer connection
            stream.getTracks().forEach(track => {
                peerConnectionRef.current.addTrack(track, stream);
            });

            // Handle remote stream
            peerConnectionRef.current.ontrack = (event) => {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                }
            };

            // Handle ICE candidates
            peerConnectionRef.current.onicecandidate = (event) => {
                if (event.candidate) {
                    socket?.emit('ice-candidate', {
                        candidate: event.candidate,
                        to: recipientUser._id
                    });
                }
            };

            // Socket event listeners
            setupSocketListeners();

            if (!isIncoming) {
                // Initiate call
                // console.log('Initiating call to:', recipientUser._id);
                socket?.emit('call-user', {
                    to: recipientUser._id,
                    from: authUser._id,
                    callType: callType,
                    callerInfo: {
                        fullname: authUser.fullname,
                        profilepic: authUser.profilepic
                    }
                });
                
                // Set timeout for call (30 seconds)
                callTimeoutRef.current = setTimeout(() => {
                    if (callStatus === 'calling') {
                        setCallStatus('ended');
                        setTimeout(() => {
                            onClose();
                        }, 2000);
                    }
                }, 30000);
            }

        } catch (error) {
            console.error('Error initializing call:', error);
            // Don't set call status to ended immediately, let user try again
            alert('Could not access camera/microphone. Please allow permissions and try again.');
            onClose();
        }
    };

    const setupSocketListeners = () => {
        socket?.on('call-accepted', handleCallAccepted);
        socket?.on('call-rejected', handleCallRejected);
        socket?.on('call-ended', handleCallEnded);
        socket?.on('ice-candidate', handleIceCandidate);
        socket?.on('offer', handleOffer);
        socket?.on('answer', handleAnswer);
    };

    const handleCallAccepted = async (data) => {
        // Clear call timeout
        if (callTimeoutRef.current) {
            clearTimeout(callTimeoutRef.current);
            callTimeoutRef.current = null;
        }
        
        setCallStatus('connected');
        
        // Create offer if we're the caller
        if (!isIncoming) {
            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);
            
            socket?.emit('offer', {
                offer: offer,
                to: recipientUser._id
            });
        }
    };

    const handleCallRejected = () => {
        setCallStatus('ended');
        setTimeout(() => {
            onClose();
        }, 2000);
    };

    const handleCallEnded = () => {
        cleanup();
        setCallStatus('ended');
        onClose();
    };

    const handleOffer = async (data) => {
        await peerConnectionRef.current.setRemoteDescription(data.offer);
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        
        socket?.emit('answer', {
            answer: answer,
            to: data.from
        });
        
        setCallStatus('connected');
    };

    const handleAnswer = async (data) => {
        await peerConnectionRef.current.setRemoteDescription(data.answer);
    };

    const handleIceCandidate = async (data) => {
        await peerConnectionRef.current.addIceCandidate(data.candidate);
    };

    const acceptCall = () => {
        socket?.emit('accept-call', {
            to: callData?.from
        });
        setCallStatus('connected');
    };

    const rejectCall = () => {
        socket?.emit('reject-call', {
            to: callData?.from
        });
        onClose();
    };

    const endCall = () => {
        // Cleanup first
        cleanup();
        
        // Emit end call event
        const targetUserId = isIncoming ? callData?.from : recipientUser?._id;
        if (targetUserId) {
            socket?.emit('end-call', {
                to: targetUserId
            });
        }
        
        setCallStatus('ended');
        
        // Close modal immediately
        onClose();
    };

    const toggleMute = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    };

    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOff(!videoTrack.enabled);
            }
        }
    };

    const cleanup = () => {
        // Stop all media tracks
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                track.stop();
            });
            localStreamRef.current = null;
        }
        
        // Close peer connection
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        
        // Clear timer
        if (callTimerRef.current) {
            clearInterval(callTimerRef.current);
            callTimerRef.current = null;
        }
        
        // Clear timeout
        if (callTimeoutRef.current) {
            clearTimeout(callTimeoutRef.current);
            callTimeoutRef.current = null;
        }
        
        // Clear video elements
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
        }
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }
        
        // Remove socket listeners
        socket?.off('call-accepted');
        socket?.off('call-rejected');
        socket?.off('call-ended');
        socket?.off('ice-candidate');
        socket?.off('offer');
        socket?.off('answer');
        
        // Reset states
        setCallStatus('ended');
        setCallDuration(0);
        setIsMuted(false);
        setIsVideoOff(false);
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50'>
            <div className='bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 max-w-4xl w-full mx-4 text-white relative'>
                {/* Close Button */}
                <button
                    onClick={() => {
                        cleanup();
                        onClose();
                    }}
                    className='absolute top-4 right-4 bg-red-600 hover:bg-red-700 p-2 rounded-full transition-colors duration-200'
                >
                    <FaTimes className='w-4 h-4' />
                </button>
                
                {/* Call Header */}
                <div className='text-center mb-6'>
                    <div className='w-24 h-24 mx-auto mb-4'>
                        {recipientUser?.profilepic ? (
                            <img 
                                src={recipientUser.profilepic} 
                                alt={recipientUser.fullname}
                                className='w-24 h-24 rounded-full object-cover'
                            />
                        ) : (
                            <div className='w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center'>
                                <FaPhone className='w-8 h-8' />
                            </div>
                        )}
                    </div>
                    <h2 className='text-2xl font-bold mb-2'>{recipientUser?.fullname}</h2>
                    <p className='text-gray-300'>
                        {callStatus === 'calling' && 'Calling...'}
                        {callStatus === 'incoming' && 'Incoming call'}
                        {callStatus === 'connected' && formatCallDuration(callDuration)}
                        {callStatus === 'ended' && 'Call ended'}
                    </p>
                </div>

                {/* Video Area */}
                {callType === 'video' && (
                    <div className='relative mb-6 bg-gray-800 rounded-lg overflow-hidden' style={{ height: '400px' }}>
                        {/* Remote Video */}
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className='w-full h-full object-cover'
                        />
                        
                        {/* Local Video (Picture in Picture) */}
                        <div className='absolute top-4 right-4 w-32 h-24 bg-gray-700 rounded-lg overflow-hidden'>
                            <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className='w-full h-full object-cover'
                            />
                        </div>
                    </div>
                )}

                {/* Audio Only */}
                {callType === 'audio' && (
                    <div className='flex justify-center mb-6'>
                        <div className='w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center'>
                            <FaVolumeUp className='w-16 h-16' />
                        </div>
                    </div>
                )}

                {/* Call Controls */}
                <div className='flex justify-center space-x-4'>
                    {callStatus === 'incoming' ? (
                        <>
                            <button
                                onClick={acceptCall}
                                className='bg-green-600 hover:bg-green-700 p-4 rounded-full transition-colors duration-200'
                            >
                                <FaPhone className='w-6 h-6' />
                            </button>
                            <button
                                onClick={rejectCall}
                                className='bg-red-600 hover:bg-red-700 p-4 rounded-full transition-colors duration-200'
                            >
                                <FaPhoneSlash className='w-6 h-6' />
                            </button>
                        </>
                    ) : callStatus === 'connected' ? (
                        <>
                            <button
                                onClick={toggleMute}
                                className={`p-4 rounded-full transition-colors duration-200 ${
                                    isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
                                }`}
                            >
                                {isMuted ? <FaMicrophoneSlash className='w-6 h-6' /> : <FaMicrophone className='w-6 h-6' />}
                            </button>
                            
                            {callType === 'video' && (
                                <button
                                    onClick={toggleVideo}
                                    className={`p-4 rounded-full transition-colors duration-200 ${
                                        isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
                                    }`}
                                >
                                    {isVideoOff ? <FaVideoSlash className='w-6 h-6' /> : <FaVideo className='w-6 h-6' />}
                                </button>
                            )}
                            
                            <button
                                onClick={endCall}
                                className='bg-red-600 hover:bg-red-700 p-4 rounded-full transition-colors duration-200'
                            >
                                <FaPhoneSlash className='w-6 h-6' />
                            </button>
                        </>
                    ) : callStatus === 'calling' ? (
                        <button
                            onClick={endCall}
                            className='bg-red-600 hover:bg-red-700 p-4 rounded-full transition-colors duration-200'
                        >
                            <FaPhoneSlash className='w-6 h-6' />
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default CallModal;
