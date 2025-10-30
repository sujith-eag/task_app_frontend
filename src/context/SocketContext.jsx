import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { addMessage, setOnlineUsers, updateMessagesToRead } from '../features/chat/chatSlice.js';
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
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            // --- Only create the socket once --- 
            const socketURL = import.meta.env.VITE_SOCKET_URL;
            socketRef.current = io( socketURL, {
                auth: { token: user.token },
                transports: ['websocket'],
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
                setIsReconnecting(false);
                hasShownDisconnectToast.current = false;
                
                // Dismiss disconnect toast and show success toast on reconnection (not on initial connection)
                toast.dismiss('socket-disconnected');
                if (socketRef.current.recovered) {
                    toast.success('Connection restored', {
                        position: 'bottom-right',
                        autoClose: 3000,
                        toastId: 'socket-reconnected'
                    });
                }
            });

            socketRef.current.on('disconnect', (reason) => {
                console.log('🔌 Socket.IO disconnected:', reason);
                setIsConnected(false);
                
                // Dismiss any existing connection toasts first
                toast.dismiss('socket-reconnected');
                toast.dismiss('socket-disconnected');
                
                // Only show toast for unexpected disconnections (not manual logout)
                if (reason !== 'io client disconnect' && !hasShownDisconnectToast.current) {
                    hasShownDisconnectToast.current = true;
                    toast.error('Connection lost. Attempting to reconnect...', {
                        position: 'bottom-right',
                        autoClose: 3000, // Auto-dismiss after 10 seconds
                        toastId: 'socket-disconnected'
                    });
                }
            });

            socketRef.current.io.on('reconnect_attempt', () => {
                console.log('🔄 Attempting to reconnect...');
                setIsReconnecting(true);
            });

            socketRef.current.io.on('reconnect_failed', () => {
                console.error('❌ Reconnection failed');
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
                }
            };
        } else {
            setSocket(null);
            setIsConnected(false);
            setIsReconnecting(false);
        } // Dependency array only react to the token.
    }, [user?.token, dispatch]);

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