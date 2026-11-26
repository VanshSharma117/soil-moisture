import axios from 'axios';
import { io } from 'socket.io-client';


const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';


export const api = axios.create({ baseURL: BACKEND + '/api' });
export const socket = io(BACKEND);