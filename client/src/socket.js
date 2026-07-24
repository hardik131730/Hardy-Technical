import { io } from "socket.io-client";

// Connect to the backend server
const socket = io("https://hardy-technical.onrender.com");

export default socket;
