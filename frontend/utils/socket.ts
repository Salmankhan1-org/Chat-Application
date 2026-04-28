// // src/socket.js
// import { io } from "socket.io-client";

// export const socket = io("http://localhost:5000", {
//   withCredentials: true,
//   autoConnect: true,
// });

import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export const socket = io(URL, {
  withCredentials: true,
  autoConnect: false, // CRITICAL: Handshake only when user is known
  reconnectionAttempts: 5,
});