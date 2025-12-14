/*
const socket = require("socket.io");


const startSocket = (server) => {
  
const io = socket(server, {
  cors: {
    origin: "http://localhost:5173",
  },
})
io.on("connection", (socket) => {
  socket.on("joinChat", () => {
    
  })
})
}
module.exports = startSocket; 
https://chat-app-frontend-cj6o.vercel.app
*/

const { Server } = require("socket.io");
const userSchema = require("../Modules/Users.js"); 
const startSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["https://spectacular-marigold-1e1f9d.netlify.app", "http://localhost:5173/"],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
  
  socket.on("user-online", async ({userId, firstName}) => {
 
    const user = await userSchema.findByIdAndUpdate(userId, {status: "online"}, {new: true});
     console.log(user.name + ": " + user.status)
    io.emit("update-online", {userId, userStatus: user.status})
  })

  socket.on("user-logout", async ({userId, firstName}) => {
    console.log(firstName + " logged out")
    const user = await userSchema.findByIdAndUpdate(userId, {status: "offline"}, {new: true});
    console.log(user.name + ": " + user.status)
    io.emit("update-offline", {userId, userStatus: user.status})
  })


    socket.on("joinChat", ({firstName, loggedInUserId, targetUserId}) => {
    const roomId = [loggedInUserId, targetUserId].sort().join("_")
    socket.join(roomId)
    console.log(firstName + " joined room: " + roomId)
    })
    socket.on("sendMessage", ({firstName, senderId, targetUserId, text}) => {
      const roomId = [senderId, targetUserId].sort().join("_");
      console.log(firstName + " " + text + " from " + senderId)
      socket.join(roomId)
      io.to(roomId).emit("messageReceived", {firstName, text, senderId})
    })

    socket.on("userTyping", ({userName, isTyping, loggedInUserId, targetUserId}) => {
     const roomId = [loggedInUserId, targetUserId].sort().join("_");
     socket.join(roomId)
     io.to(roomId).emit("typingResponse", {userName, isTyping, userTypingId: targetUserId})
      console.log(userName + " is typing:" + isTyping)
    })
    socket.on("disconnect", () => {})
  })
  
};

module.exports = startSocket;

/*
const { Server } = require("socket.io");

const startSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    socket.on("joinChat", ({ firstName, senderId, id }) => {
      const roomId = [senderId, id].sort().join("_")
      console.log(firstName + " Joined-room: " + roomId)
      socket.join(roomId)
    });

    socket.on("sendMessage", ({ firstName, senderId, id, text }) => {
      const roomId = [senderId, id].sort().join("_")
      console.log(firstName + " " + text)
      io.to(roomId).emit("messageReceived", { firstName, text, senderId })
    })
  });
};

module.exports = startSocket;
*/