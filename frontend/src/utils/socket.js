import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5001';

let socket;

export const initSocket = (userId) => {
  if (socket) return socket;
  
  socket = io(SOCKET_URL);
  
  socket.on('connect', () => {
    console.log('📡 Connected to Sovereign Notification Protocol');
    socket.emit('join', userId);
  });
  
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
