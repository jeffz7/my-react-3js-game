import { useEffect, useState, useRef } from "react";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { MultiplayerContext } from "../../contexts/MultiplayerContext";
import { Group, Vector3 } from "three";
import Sedan from "../../components/vehicles/Sedan";
import { Html } from "@react-three/drei";
import React from "react";

interface RemotePlayer {
  username: string;
  position: Vector3;
  rotation: number;
  speed: number;
  steering: number;
  lastUpdate: number;
  vehicleRef: React.RefObject<Group>;
}

export default function Multiplayer() {
  const [remotePlayers, setRemotePlayers] = useState<
    Record<string, RemotePlayer>
  >({});
  const { username } = useContext(UserContext);
  const { room } = useContext(MultiplayerContext);

  // Handle player updates from server
  useEffect(() => {
    if (!room || !username) return;

    // Listen for player position updates
    const handlePlayerUpdate = (data: any) => {
      // Ignore our own updates
      if (data.username === username) return;

      setRemotePlayers((prev) => {
        // Create a new player entry if it doesn't exist
        if (!prev[data.username]) {
          return {
            ...prev,
            [data.username]: {
              username: data.username,
              position: new Vector3(data.x, data.y, data.z),
              rotation: data.rotation,
              speed: data.speed,
              steering: data.steering,
              lastUpdate: Date.now(),
              vehicleRef: React.createRef<Group>(),
            },
          };
        }

        // Update existing player
        return {
          ...prev,
          [data.username]: {
            ...prev[data.username],
            position: new Vector3(data.x, data.y, data.z),
            rotation: data.rotation,
            speed: data.speed,
            steering: data.steering,
            lastUpdate: Date.now(),
          },
        };
      });
    };

    // Listen for player disconnections
    const handlePlayerLeave = (data: any) => {
      setRemotePlayers((prev) => {
        const newPlayers = { ...prev };
        delete newPlayers[data.username];
        return newPlayers;
      });
    };

    // Register event listeners
    room.onMessage("playerUpdate", handlePlayerUpdate);
    room.onMessage("playerLeave", handlePlayerLeave);

    // Clean up event listeners
    return () => {
      if (room) {
        room.removeAllListeners();
      }
    };
  }, [room, username]);

  // Clean up stale players (those who haven't sent updates in a while)
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setRemotePlayers((prev) => {
        const newPlayers = { ...prev };
        Object.keys(newPlayers).forEach((playerName) => {
          if (now - newPlayers[playerName].lastUpdate > 5000) {
            // Remove players who haven't updated in 5 seconds
            delete newPlayers[playerName];
          }
        });
        return newPlayers;
      });
    }, 1000);

    return () => clearInterval(cleanupInterval);
  }, []);

  // Update remote player positions
  useEffect(() => {
    const updateInterval = setInterval(() => {
      Object.values(remotePlayers).forEach((player) => {
        if (player.vehicleRef.current) {
          // Smoothly interpolate position
          player.vehicleRef.current.position.lerp(player.position, 0.1);

          // Smoothly interpolate rotation
          const currentRotation = player.vehicleRef.current.rotation.y;
          const targetRotation = player.rotation;
          player.vehicleRef.current.rotation.y =
            currentRotation + (targetRotation - currentRotation) * 0.1;
        }
      });
    }, 16);

    return () => clearInterval(updateInterval);
  }, [remotePlayers]);

  return (
    <>
      {/* Render remote players */}
      {Object.values(remotePlayers).map((player) => (
        <group
          key={player.username}
          ref={player.vehicleRef as any}
          position={[player.position.x, player.position.y, player.position.z]}
          rotation={[0, player.rotation, 0]}
        >
          <Sedan color="#3498db" />

          {/* Player nametag */}
          <Html position={[0, 3, 0]}>
            <div className="player-nametag">
              <span>{player.username}</span>
            </div>
          </Html>
        </group>
      ))}
    </>
  );
}
