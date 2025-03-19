const { Schema, MapSchema, defineTypes } = require("@colyseus/schema");

class Player extends Schema {
  constructor() {
    super();
    this.username = "";
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.rotation = 0;
    this.speed = 0;
    this.steering = 0;
  }
}

defineTypes(Player, {
  username: "string",
  x: "number",
  y: "number",
  z: "number",
  rotation: "number",
  speed: "number",
  steering: "number",
});

class GameState extends Schema {
  constructor() {
    super();
    this.players = new MapSchema();
  }
}

defineTypes(GameState, {
  players: { map: Player },
});

module.exports = { GameState, Player };
