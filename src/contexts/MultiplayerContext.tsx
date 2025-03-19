// src/contexts/MultiplayerContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { Room } from "colyseus.js";
import {
  connectToGameRoom,
  disconnectFromGameRoom,
} from "../utils/multiplayer";
import { UserContext } from "./UserContext";

interface MultiplayerContextType {
  room: Room | null;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  onlinePlayers: string[];
  remotePlayers: Map<string, RemotePlayer>;
}

export const MultiplayerContext = createContext<MultiplayerContextType>({
  room: null,
  isConnecting: false,
  error: null,
  connect: async () => {},
  disconnect: () => {},
  onlinePlayers: [],
  remotePlayers: new Map(),
});

interface MultiplayerProviderProps {
  children: ReactNode;
}

// Add this interface to track remote players
interface RemotePlayer {
  username: string;
  x: number;
  y: number;
  z: number;
  rotation: number;
  speed: number;
  steering: number;
  lastUpdate: number;
}

export function MultiplayerProvider({ children }: MultiplayerProviderProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onlinePlayers, setOnlinePlayers] = useState<string[]>([]);
  const { username, updateOnlineCount } = useContext(UserContext);
  const [remotePlayers, setRemotePlayers] = useState<Map<string, RemotePlayer>>(
    new Map()
  );

  // Connect to the game room
  const connect = async () => {
    if (!username) {
      setError("Username is required to connect");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const gameRoom = await connectToGameRoom(username);
      setRoom(gameRoom);

      // Register message handlers
      gameRoom.onMessage("onlinePlayers", (data) => {
        console.log("Received onlinePlayers:", data);
        setOnlinePlayers(data.players);
        updateOnlineCount(data.count);
      });

      gameRoom.onMessage("playerJoin", (data) => {
        console.log("Player joined:", data);
        setOnlinePlayers((prev) => [...prev, data.username]);
        updateOnlineCount(data.onlineCount);
      });

      gameRoom.onMessage("playerLeave", (data) => {
        console.log("Player left:", data);
        setOnlinePlayers((prev) =>
          prev.filter((name) => name !== data.username)
        );
        updateOnlineCount(data.onlineCount);
      });

      gameRoom.onMessage("playerUpdate", (message) => {
        // Skip updates for the current player
        if (message.username === username) return;
        console.log("Player update:", message);

        // Update the remote player's position and state
        setRemotePlayers((prev) => {
          const updated = new Map(prev);

          // Create or update the player
          updated.set(message.username, {
            username: message.username,
            x: message.x,
            y: message.y,
            z: message.z,
            rotation: message.rotation,
            speed: message.speed,
            steering: message.steering,
            lastUpdate: Date.now(),
          });

          return updated;
        });
      });
    } catch (err) {
      setError(
        `Failed to connect: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setIsConnecting(false);
    }
  };

  // Auto-connect when username is available
  useEffect(() => {
    if (username && !room && !isConnecting) {
      connect();
    }
  }, [username, room, isConnecting]);

  // Disconnect from the game room
  const disconnect = () => {
    disconnectFromGameRoom(room);
    setRoom(null);
    setOnlinePlayers([]);
    updateOnlineCount(0);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      disconnectFromGameRoom(room);
    };
  }, [room]);

  return (
    <MultiplayerContext.Provider
      value={{
        room,
        isConnecting,
        error,
        connect,
        disconnect,
        onlinePlayers,
        remotePlayers,
      }}
    >
      {children}
    </MultiplayerContext.Provider>
  );
}
