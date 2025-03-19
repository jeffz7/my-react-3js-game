// server.cjs
const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("colyseus");
const { GameRoom } = require("./rooms/GameRoom.cjs");

// Create the Express app
const app = express();
app.use(cors());
app.use(express.json());

// Create the HTTP server
const server = http.createServer(app);

// Create the Colyseus server
const gameServer = new Server({
  server,
});

// Register the game room
gameServer.define("game_room", GameRoom);

// Start the server
const port = process.env.PORT || 3001;
gameServer.listen(port);
console.log(`Colyseus server is running on http://localhost:${port}`);
