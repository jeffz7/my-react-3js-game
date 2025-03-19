import { useEffect } from "react";
import { Group } from "three";
import { Room } from "colyseus.js";

interface MultiplayerSyncProps {
  vehicleRef: React.RefObject<Group | null>;
  speed: number;
  steering: number;
  username: string | null;
  room: any; // Using 'any' for now, replace with proper Colyseus Room type
}

export default function useMultiplayerSync({
  vehicleRef,
  speed,
  steering,
  username,
  room,
}: MultiplayerSyncProps) {
  useEffect(() => {
    if (!room || !username || !vehicleRef.current) return;

    const syncInterval = setInterval(() => {
      // Check if room and connection are valid before sending
      if (
        vehicleRef.current &&
        room &&
        room.connection &&
        room.connection.isOpen
      ) {
        const position = vehicleRef.current.position;
        try {
          room.send("updatePosition", {
            username,
            x: position.x,
            y: position.y,
            z: position.z,
            rotation: vehicleRef.current.rotation.y,
            speed,
            steering,
          });
        } catch (error) {
          console.warn("Failed to send position update:", error);
        }
      }
    }, 100); // Sync every 100ms to reduce network traffic

    return () => clearInterval(syncInterval);
  }, [vehicleRef, speed, steering, username, room]);

  return null;
}
