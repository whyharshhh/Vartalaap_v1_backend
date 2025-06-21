import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Use environment variable
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Add utility function to get online users count
export function getOnlineUsersCount() {
  return Object.keys(userSocketMap).length;
}

// Add utility function to get all online users
export function getOnlineUsers() {
  return Object.keys(userSocketMap);
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} connected with socket ${socket.id}`);
    
    // Emit updated online users list to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  } else {
    console.log("User connected without userId");
  }

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    
    // Find and remove the user from userSocketMap
    const disconnectedUserId = Object.keys(userSocketMap).find(
      key => userSocketMap[key] === socket.id
    );
    
    if (disconnectedUserId) {
      delete userSocketMap[disconnectedUserId];
      console.log(`User ${disconnectedUserId} disconnected`);
      
      // Emit updated online users list to all clients
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { io, app, server };
