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

    socket.on("join_chat", ({ userId }) => {
      if (!userId) return;
      currentUserId = userId;
      
      socket.join(userId);
      
      // Handle multiple tabs: map userId to a set of socket IDs
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }
      onlineUsers.get(userId).add(socket.id);

      // Notify others and sync list
      socket.broadcast.emit("user_online", { userId });
      io.emit("online_users", Array.from(onlineUsers.keys()));
    });

    socket.on("send_message", (data) => {
      const { senderId, receiverId, text, id } = data;
      if (!senderId || !receiverId || !text) return;


      // Use 'to' for targeted delivery
      io.to(receiverId).emit("receive_message", data);

      io.to(senderId).emit('message_sent',{id})
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
          
          // Only emit offline if ALL tabs are closed
          io.emit("user_offline", { userId: currentUserId });
          io.emit("online_users", Array.from(onlineUsers.keys()));

          await User.findByIdAndUpdate(currentUserId, { lastSeen: new Date() });
        }
      }
    });
  });
};


module.exports = initSocket;