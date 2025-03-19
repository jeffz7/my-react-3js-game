import { useEffect, useRef } from "react";
import { Group, Vector3 } from "three";
import { Room } from "colyseus.js";

interface MultiplayerSyncProps {
  vehicleRef: React.RefObject<Group | null>;
  speed: number;
  steering: number;
  username: string | null;
  room: any; // Using 'any' for now, replace with proper Colyseus Room type
  cameraAngle?: number; // Optional camera angle for syncing view
}

export default function useMultiplayerSync({
  vehicleRef,
  speed,
  steering,
  username,
  room,
  cameraAngle = 0,
}: MultiplayerSyncProps) {
  // Track last sync time to avoid excessive updates
  const lastSyncTime = useRef(0);
  const SYNC_INTERVAL = 50; // ms between syncs

  // Track last position to only sync when there's meaningful movement
  const lastSyncedPosition = useRef(new Vector3());
  const lastSyncedRotation = useRef(0);
  const lastSyncedSteering = useRef(0);
  const MIN_POSITION_DELTA = 0.05; // Minimum position change to trigger sync
  const MIN_ROTATION_DELTA = 0.02; // Minimum rotation change to trigger sync
  const MIN_STEERING_DELTA = 0.05; // Minimum steering change to trigger sync

  useEffect(() => {
    if (!room || !username || !vehicleRef.current) return;

    // Set up a regular interval to check if we need to sync
    const syncInterval = setInterval(() => {
      const now = Date.now();

      // Only sync if enough time has passed since last sync
      if (now - lastSyncTime.current < SYNC_INTERVAL) return;

      if (vehicleRef.current) {
        const currentPosition = vehicleRef.current.position;
        const currentRotation = vehicleRef.current.rotation.y;

        // Check if there's been enough change to warrant a sync
        const positionDelta = new Vector3()
          .subVectors(currentPosition, lastSyncedPosition.current)
          .length();
        const rotationDelta = Math.abs(
          currentRotation - lastSyncedRotation.current
        );
        const steeringDelta = Math.abs(steering - lastSyncedSteering.current);

        if (
          positionDelta > MIN_POSITION_DELTA ||
          rotationDelta > MIN_ROTATION_DELTA ||
          steeringDelta > MIN_STEERING_DELTA ||
          Math.abs(speed) > 0.01 // Always sync if we're moving
        ) {
          // Send position update to server
          room.send("updatePosition", {
            username,
            x: currentPosition.x,
            y: currentPosition.y,
            z: currentPosition.z,
            rotation: currentRotation,
            speed,
            steering,
            cameraAngle,
          });

          // Update last synced values
          lastSyncedPosition.current.copy(currentPosition);
          lastSyncedRotation.current = currentRotation;
          lastSyncedSteering.current = steering;
          lastSyncTime.current = now;
        }
      }
    }, SYNC_INTERVAL / 2); // Check twice as often as we sync

    return () => {
      clearInterval(syncInterval);
    };
  }, [vehicleRef, room, username, speed, steering, cameraAngle]);

  return null;
}
