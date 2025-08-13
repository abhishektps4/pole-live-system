import { io } from 'socket.io-client';
const BACKEND = import.meta.env.VITE_BACKEND || 'http://localhost:4000';
const socket = io(BACKEND);
export default socket;
