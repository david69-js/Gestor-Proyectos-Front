import { io } from 'socket.io-client';
const token = localStorage.getItem('authToken');
const socketUrl = import.meta.env.VITE_API_URL.replace('/api', '');

const socket = io(socketUrl, {
  withCredentials: true,
  extraHeaders: {
    Authorization: `Bearer ${token}`,
  },
  transports: ['websocket'],
});


export default socket;
