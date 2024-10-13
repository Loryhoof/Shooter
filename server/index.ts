import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";

// Create an Express application
const app = express();

// Create a basic HTTP server and integrate with Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow cross-origin requests (adjust as needed)
  },
});

const playerPositions: {
  [key: string]: { x: number; y: number; z: number };
} = {}; // "012345": { x: 0, y: 0, z: 0 },

// Set up Socket.IO connection
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  playerPositions[socket.id] = { x: 0, y: 0.5, z: 0 };

  socket.emit("user-list", playerPositions);

  socket.broadcast.emit("userJoined", { id: socket.id });

  // Handle events from the client, like player movement
  socket.on("playerMove", (data) => {
    // Broadcast the player's movement to other clients

    const { id, velocity } = data;

    const position = calculatePosition(id, velocity);

    //console.log(position);

    io.sockets.emit("updatePlayerPosition", { id, position });
  });

  const calculatePosition = (
    id: any,
    velocity: { x: number; y: number; z: number }
  ) => {
    let playerPosition = playerPositions[id];
    playerPosition.x += velocity.x;
    playerPosition.y += velocity.y;
    playerPosition.z += velocity.z;

    return playerPosition;
  };

  socket.on("disconnect", () => {
    delete playerPositions[socket.id];
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server on port 3000
httpServer.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
