import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { addMessage, setOnlineUsers, updateMessagesToRead } from '../features/chat/chatSlice.js';


const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
    // We use useState to trigger re-renders when the socket connects/disconnects
    const [socket, setSocket] = useState(null); 
    const socketRef = useRef(null);
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
            });

            socketRef.current.on('receiveMessage', (message) => {
                console.log('📩 New message received:', message);
                dispatch(addMessage(message));
            });

            socketRef.current.on('connect_error', (err) => {
                console.error('❌ Socket.IO connection error:', err.message);
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
                    socketRef.current = null;
                    console.log('🔌 Socket.IO disconnected.');
                }
            };
        }
    // We change the dependency array to only react to the user object itself.
    }, [user, dispatch]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};