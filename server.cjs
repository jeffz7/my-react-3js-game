// server.cjs
const colyseus = require("colyseus");
const express = require("express");
const cors = require("cors");
const http = require("http");

class GameRoom extends colyseus.Room {
  onCreate() {
    this.setState({ players: {} });
  }

  onJoin(client) {
    this.state.players[client.sessionId] = {};
    this.broadcastOnlineCount();
  }

  onLeave(client) {
    delete this.state.players[client.sessionId];
    this.broadcastOnlineCount();
  }

  broadcastOnlineCount() {
    const onlineCount = Object.keys(this.state.players).length;
    this.broadcast("onlineCount", { count: onlineCount });
    console.log(`Current online players: ${onlineCount}`);
  }
}

const app = express();
app.use(cors());

const gameServer = new colyseus.Server({
  server: http.createServer(app),
});

gameServer.define("my_game_room", GameRoom);
gameServer.listen(2567, () => {
  console.log("Multiplayer server started on ws://localhost:2567");
});
