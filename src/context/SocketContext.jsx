import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { addMessage, setOnlineUsers, updateMessagesToRead } from '../features/chat/chatSlice.js';
import { getDeviceId } from '../utils/deviceId.js';
import { toast } from 'react-toastify';


const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
    // We use useState to trigger re-renders when the socket connects/disconnects
    const [socket, setSocket] = useState(null); 
    const [isConnected, setIsConnected] = useState(false);
    const [isReconnecting, setIsReconnecting] = useState(false);
    const socketRef = useRef(null);
    const hasShownDisconnectToast = useRef(false); // Prevent duplicate toasts
    const disconnectToastTimeoutRef = useRef(null);
    const reconnectDebounceTimeoutRef = useRef(null);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            // --- Only create the socket once --- 
            const socketURL = import.meta.env.VITE_SOCKET_URL;
            // Use deviceId in the handshake and rely on httpOnly cookie for auth.
            const deviceId = getDeviceId();
            socketRef.current = io(socketURL, {
                auth: { deviceId },
                transports: ['websocket'],
                withCredentials: true, // ensure cookies are sent on cross-origin handshake
            });
// No URL is needed here. It will default to the current host,
// and the '/socket.io' proxy rule in vite.config.js will handle it.            
            setSocket(socketRef.current);

            socketRef.current.on('onlineUsersUpdate', (users) => {
                dispatch(setOnlineUsers(users));
            });

            socketRef.current.on('messagesUpdatedToRead', (data) => {
                dispatch(updateMessagesToRead(data));
            });
            // --- Set up event listeners ---
            socketRef.current.on('connect', () => {
                console.log('✅ Socket.IO connected successfully:', socketRef.current.id);
                setIsConnected(true);

                // Clear any pending disconnect-toast timers and reconnect debounces
                if (disconnectToastTimeoutRef.current) {
                    clearTimeout(disconnectToastTimeoutRef.current);
                    disconnectToastTimeoutRef.current = null;
                }
                if (reconnectDebounceTimeoutRef.current) {
                    clearTimeout(reconnectDebounceTimeoutRef.current);
                    reconnectDebounceTimeoutRef.current = null;
                }

                // If we previously showed the disconnect toast, show a restoration toast now.
                if (hasShownDisconnectToast.current) {
                    toast.dismiss('socket-disconnected');
                    toast.success('Connection restored', {
                        position: 'bottom-right',
                        autoClose: 3000,
                        toastId: 'socket-reconnected'
                    });
                }

                // reset flags
                hasShownDisconnectToast.current = false;
                setIsReconnecting(false);
            });

            socketRef.current.on('disconnect', (reason) => {
                console.log('🔌 Socket.IO disconnected:', reason);
                setIsConnected(false);

                // Dismiss any existing reconnected toast
                toast.dismiss('socket-reconnected');

                // Only schedule a disconnect toast for unexpected disconnects (not manual logout)
                // and only after a short grace period to avoid flashing toasts on transient network blips.
                if (reason !== 'io client disconnect' && !hasShownDisconnectToast.current) {
                    // Start a timer; if the socket reconnects within the grace window, we won't show the toast.
                    disconnectToastTimeoutRef.current = setTimeout(() => {
                        hasShownDisconnectToast.current = true;
                        toast.error('Connection lost. Attempting to reconnect...', {
                            position: 'bottom-right',
                            autoClose: 5000,
                            toastId: 'socket-disconnected'
                        });
                    }, 8000); // 8s grace period
                }
            });

            socketRef.current.io.on('reconnect_attempt', () => {
                // Debounce setting `isReconnecting` to avoid brief UI flicker on short lived attempts
                if (reconnectDebounceTimeoutRef.current) clearTimeout(reconnectDebounceTimeoutRef.current);
                reconnectDebounceTimeoutRef.current = setTimeout(() => {
                    console.log('🔄 Attempting to reconnect...');
                    setIsReconnecting(true);
                }, 700); // 700ms debounce
            });

            socketRef.current.io.on('reconnect_failed', () => {
                console.error('❌ Reconnection failed');
                if (reconnectDebounceTimeoutRef.current) {
                    clearTimeout(reconnectDebounceTimeoutRef.current);
                    reconnectDebounceTimeoutRef.current = null;
                }
                setIsReconnecting(false);
            });

            socketRef.current.on('receiveMessage', (message) => {
                console.log('📩 New message received:', message);
                dispatch(addMessage(message));
            });

            socketRef.current.on('connect_error', (err) => {
                console.error('❌ Socket.IO connection error:', err.message);
                setIsConnected(false);
            });
                
            // DEBUGGING
            socketRef.current.onAny((eventName, ...args) => {
                console.log(`[Socket Debug] Event received: '${eventName}' with data:`, args);
            });
            // --- The cleanup function ONLY runs when the user logs out ---
            // Because the dependency array is empty, this effect runs only once on mount.
            // The cleanup runs only once on unmount (i.e., when the user logs out and `user` becomes null).
            return () => {
                if(socketRef.current) {
                    socketRef.current.disconnect();
                    setSocket(null);
                    setIsConnected(false);
                    setIsReconnecting(false);
                    socketRef.current = null;
                    console.log('🔌 Socket.IO disconnected.');
                    
                    // Dismiss any connection-related toasts on logout
                    toast.dismiss('socket-disconnected');
                    toast.dismiss('socket-reconnected');
                    // Clear any pending timers
                    if (disconnectToastTimeoutRef.current) {
                        clearTimeout(disconnectToastTimeoutRef.current);
                        disconnectToastTimeoutRef.current = null;
                    }
                    if (reconnectDebounceTimeoutRef.current) {
                        clearTimeout(reconnectDebounceTimeoutRef.current);
                        reconnectDebounceTimeoutRef.current = null;
                    }
                }
            };
        } else {
            setSocket(null);
            setIsConnected(false);
            setIsReconnecting(false);
        } // Dependency array only react to the token.
    }, [user, dispatch]);

    // Manual reconnect function
    const reconnect = () => {
        if (socketRef.current && !socketRef.current.connected) {
            console.log('🔄 Manual reconnection triggered');
            setIsReconnecting(true);
            socketRef.current.connect();
        }
    };

    const value = {
        socket,
        isConnected,
        isReconnecting,
        reconnect
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};