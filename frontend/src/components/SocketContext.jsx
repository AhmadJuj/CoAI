import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to your backend server
    const newSocket = io('http://localhost:5000'); // Change to your backend URL
    
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ Connected to socket server:', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from socket server');
    });

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};