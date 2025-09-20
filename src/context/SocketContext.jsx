import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { addMessage } from '../features/chat/chatSlice.js';

// Create the context
const SocketContext = createContext();

// Create a custom hook for easy access to the context
export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        // This effect runs whenever the user's login status changes
        if (user) {
            // If a user is logged in, create the socket connection
            const newSocket = io(import.meta.env.API_BASE_URL, {
                // Pass the user's token for authentication by our backend middleware
                auth: {
                    token: user.token,
                },
            });
            setSocket(newSocket);

            // --- Set up event listeners ---
            newSocket.on('connect', () => {
                console.log('Socket.IO connected successfully:', newSocket.id);
            });

            // This listener will fire when the server sends a new message
            newSocket.on('receiveMessage', (message) => {
                console.log('New message received:', message);
                // Dispatch an action to add the new message to the Redux store
                dispatch(addMessage(message));
            });

            // The cleanup function is crucial: it runs when the component unmounts or the `user` changes
            return () => {
                newSocket.disconnect();
                console.log('Socket.IO disconnected.');
            };
        } else {
            // If there is no user, disconnect any existing socket
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
    }, [user, dispatch]); // Dependency array ensures this runs only when user or dispatch changes

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};