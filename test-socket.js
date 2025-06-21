// Simple test script to verify socket functionality
// Run this with: node test-socket.js

import { io as Client } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; // Adjust port as needed

// Test multiple user connections
const testUsers = [
  { id: "user1", name: "Alice" },
  { id: "user2", name: "Bob" },
  { id: "user3", name: "Charlie" }
];

const clients = [];

console.log("Testing socket connections...");

// Connect multiple users
testUsers.forEach((user, index) => {
  setTimeout(() => {
    const client = Client(SOCKET_URL, {
      query: { userId: user.id }
    });

    client.on("connect", () => {
      console.log(`✅ ${user.name} connected with socket ID: ${client.id}`);
    });

    client.on("getOnlineUsers", (onlineUsers) => {
      console.log(`📊 Online users for ${user.name}:`, onlineUsers);
    });

    client.on("disconnect", () => {
      console.log(`❌ ${user.name} disconnected`);
    });

    clients.push({ client, user });
  }, index * 1000); // Connect users with 1 second delay
});

// Disconnect users after 10 seconds
setTimeout(() => {
  console.log("\nDisconnecting all users...");
  clients.forEach(({ client, user }) => {
    client.disconnect();
  });
  
  setTimeout(() => {
    console.log("Test completed!");
    process.exit(0);
  }, 2000);
}, 10000); 