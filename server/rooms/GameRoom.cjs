const { Room } = require("colyseus");
const { GameState, Player } = require("./schema/GameState.cjs");

class GameRoom extends Room {
  onCreate(options) {
    console.log("Game room created!");

    // Initialize the room state
    this.setState(new GameState());

    // Set the maximum number of clients
    this.maxClients = 10;

    // Handle player movement
    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);

      if (player) {
        player.x = data.x;
        player.y = data.y;
        player.z = data.z;
        player.rotation = data.rotation;
        player.speed = data.speed;
        player.steering = data.steering;

        // Broadcast player update to all clients except the sender
        this.broadcast(
          "playerUpdate",
          {
            username: player.username,
            x: player.x,
            y: player.y,
            z: player.z,
            rotation: player.rotation,
            speed: player.speed,
            steering: player.steering,
          },
          { except: client }
        );
      }
    });

    // Handle username availability check
    this.onMessage("checkUsername", (client, data) => {
      const { username } = data;
      let isAvailable = true;

      // Check if username is already taken
      this.state.players.forEach((player) => {
        if (player.username === username) {
          isAvailable = false;
        }
      });

      // Send availability result back to client
      client.send("usernameAvailability", { available: isAvailable });
    });

    // Handle player position updates
    this.onMessage("updatePosition", (client, data) => {
      const player = this.state.players.get(client.sessionId);

      if (player) {
        player.x = data.x;
        player.y = data.y;
        player.z = data.z;
        player.rotation = data.rotation;
        player.speed = data.speed;
        player.steering = data.steering;

        // Broadcast player update to all clients except the sender
        this.broadcast(
          "playerUpdate",
          {
            username: player.username,
            x: player.x,
            y: player.y,
            z: player.z,
            rotation: player.rotation,
            speed: player.speed,
            steering: player.steering,
          },
          { except: client }
        );
      }
    });
  }

  onJoin(client, options) {
    console.log(`Client ${client.sessionId} joined the game room!`);

    // Create a new player state
    const player = new Player();
    player.username = options.username || `Player ${client.sessionId}`;

    // Add player to the room state
    this.state.players.set(client.sessionId, player);

    // Get list of online players
    const onlinePlayers = [];
    this.state.players.forEach((p) => {
      onlinePlayers.push(p.username);
    });

    // Send current online players to the new client
    client.send("onlinePlayers", {
      players: onlinePlayers,
      count: this.state.players.size,
    });

    // Notify all clients about the new player
    this.broadcast("playerJoin", {
      username: player.username,
      onlineCount: this.state.players.size,
    });

    // Send existing players' data to the new client
    this.state.players.forEach((existingPlayer, sessionId) => {
      if (sessionId !== client.sessionId) {
        client.send("playerUpdate", {
          username: existingPlayer.username,
          x: existingPlayer.x,
          y: existingPlayer.y,
          z: existingPlayer.z,
          rotation: existingPlayer.rotation,
          speed: existingPlayer.speed,
          steering: existingPlayer.steering,
        });
      }
    });
  }

  onLeave(client, consented) {
    console.log(`Client ${client.sessionId} left the game room!`);

    // Get player before removing
    const player = this.state.players.get(client.sessionId);

    if (player) {
      const username = player.username;

      // Remove player from the room state
      this.state.players.delete(client.sessionId);

      // Notify all clients about the player leaving
      this.broadcast("playerLeave", {
        username: username,
        onlineCount: this.state.players.size,
      });

      console.log(`${username} left the game room!`);
    }
  }

  onDispose() {
    console.log("Game room disposed!");
  }
}

module.exports = { GameRoom };
