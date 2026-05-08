// // server/socket.js
// const { Server } = require("socket.io");
// const User = require("../models/User/user.model");

// const initSocket = (server) => {
//   const io = new Server(server, {
//     cors: {
//       origin: "http://localhost:3000",
//       methods: ["GET", "POST"],
//       credentials: true,
//     },
//   });

//   const onlineUsers = new Map();

//   io.on("connection", (socket) => {
//     console.log("User connected:", socket.id);

//     // Join user room
//     socket.on("join_chat", ({ userId }) => {
//         if (!userId) return;

//         socket.join(userId);
//         onlineUsers.set(userId, socket.id);

//         io.emit("user_online", { userId });

//         // ALWAYS sync full list
//         io.emit("online_users", Array.from(onlineUsers.keys()));
//         });

//     // Send message
//     socket.on("send_message", (data) => {
//       const { senderId, receiverId, text } = data;

//       if (!senderId || !receiverId || !text) return;

   

//       io.to(receiverId).emit("receive_message", {
//         senderId,
//         receiverId,
//         text,
//         createdAt: new Date(),
//       });
//     });

//      // ✅ TYPING START
//     socket.on("typing", ({ senderId, receiverId }) => {
//         socket.to(receiverId).emit("typing", { senderId });
//     });

//     // ✅ TYPING STOP
//     socket.on("stop_typing", ({ senderId, receiverId }) => {
//         socket.to(receiverId).emit("stop_typing", { senderId });
//     });


//     socket.on("disconnect", async () => {
//         let disconnectedUserId = null;

//         for (let [userId, socketId] of onlineUsers.entries()) {
//             if (socketId === socket.id) {
//                 disconnectedUserId = userId;
//                 onlineUsers.delete(userId);
//                 break;
//             }
//         }

//         if (disconnectedUserId) {
//             io.emit("user_offline", { userId: disconnectedUserId });
//             io.emit("online_users", Array.from(onlineUsers.keys()));
            
//             await User.findByIdAndUpdate(disconnectedUserId, {
//                 lastSeen: new Date(),
//             });
//         }
//     });
//   });

//   return io;
// };

// module.exports = initSocket;



const { Server } = require("socket.io");
const User = require("../models/User/user.model");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    // Production settings
    pingTimeout: 60000,
    connectionStateRecovery: {}, 
  });

  // userId -> Set(socketIds) to handle multiple tabs
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    let currentUserId = null;

    // server/socket.js
    socket.on("join_chat", ({ userId }) => {
        if (!userId) return;
        
        // Ensure the socket is in its own room
        socket.join(userId);
        
        // Update map
        if (!onlineUsers.has(userId)) {
          onlineUsers.set(userId, new Set());
        }
        onlineUsers.get(userId).add(socket.id);

        // CRITICAL: Force broadcast to all connected clients that the user is now online
        // io.emit ensures everyone (including the one who just logged in) gets the latest list
        io.emit("online_users", Array.from(onlineUsers.keys()));
    });

    

    socket.on("send_message", (data) => {
      const { senderId, receiverId, text, id } = data;
      if (!senderId || !receiverId || !text) return;


      // Use 'to' for targeted delivery
      io.to(receiverId).emit("receive_message", data);

      io.to(senderId).emit('message_sent',{id})
    });

    socket.on("typing", ({ senderId, receiverId }) => {
        socket.to(receiverId).emit("typing", { senderId });
    });

    socket.on("stop_typing", ({ senderId, receiverId }) => {
        socket.to(receiverId).emit("stop_typing", { senderId });
    });

    socket.on("message_delivered", ({ messageId, senderId }) => {
        io.to(senderId).emit("message_delivered_ack", {
            messageId,
        });
    });

    socket.on("message_seen", ({ messageId, senderId }) => {
        io.to(senderId).emit("message_seen_ack", {
            messageId,
        });
    });

    socket.on("disconnect", async () => {
      if (!currentUserId) return;

      const userSockets = onlineUsers.get(currentUserId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(currentUserId);
    

          // socket_init.js — in the disconnect handler
            const updatedUser = await User.findByIdAndUpdate(
                currentUserId,
                { lastSeen: new Date() },
                { returnDocument: 'after' }  // ← return the updated doc
            );

            io.emit("online_users", Array.from(onlineUsers.keys()));

            io.emit("user_offline", {
                userId: currentUserId,
                lastSeen: updatedUser.lastSeen, // ← send it to clients
            });
        }
      }
    });
  });
};


module.exports = initSocket;