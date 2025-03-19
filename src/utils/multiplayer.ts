import { Client, Room } from "colyseus.js";

// Create a Colyseus client
const client = new Client(
  import.meta.env.VITE_COLYSEUS_SERVER_URL || "ws://localhost:3001"
);

// Connect to the game room
export async function connectToGameRoom(username: string): Promise<Room> {
  try {
    const room = await client.joinOrCreate("game_room", { username });
    console.log("Connected to game room!");

    // Set up error handler
    room.onMessage("error", (message) => {
      console.error("Server error:", message);
      throw new Error(message.message);
    });

    return room;
  } catch (error) {
    console.error("Failed to connect to game room:", error);
    throw error;
  }
}

// Check if a username is available
export async function checkUsernameAvailability(
  username: string
): Promise<boolean> {
  try {
    const room = await client.joinOrCreate("game_room");

    return new Promise((resolve) => {
      room.send("checkUsername", { username });

      room.onMessage("usernameAvailability", (message) => {
        resolve(message.available);
        room.leave();
      });

      // Set a timeout in case the server doesn't respond
      setTimeout(() => {
        resolve(false);
        room.leave();
      }, 60000);
    });
  } catch (error) {
    console.error("Failed to check username availability:", error);
    return false;
  }
}

// Disconnect from the game room
export function disconnectFromGameRoom(room: Room | null) {
  if (room) {
    room.leave();
    console.log("Disconnected from game room!");
  }
}
