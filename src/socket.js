import { io } from 'socket.io-client';
const BACKEND = import.meta.env.VITE_BACKEND || 'https://pole-live-backend.onrender.com';
const socket = io(BACKEND);
export default socket;

