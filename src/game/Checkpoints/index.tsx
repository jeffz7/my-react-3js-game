import { useRef, useEffect } from "react";
import { Group, Mesh, BoxGeometry, MeshStandardMaterial } from "three";
import { Html } from "@react-three/drei";
import useCheckpoints from "./useCheckpoints";

interface CheckpointsProps {
  vehicleRef: React.RefObject<Group | null>;
}

export default function Checkpoints({ vehicleRef }: CheckpointsProps) {
  const { checkpoints, currentCheckpoint, lapTime, bestLapTime, isRacing } =
    useCheckpoints({
      vehicleRef,
      onCheckpointReached: (id) => {
        console.log(`Checkpoint ${id} reached!`);
      },
      onAllCheckpointsReached: () => {
        console.log("Lap completed!");
      },
    });

  // Format time in mm:ss:ms format
  const formatTime = (timeMs: number) => {
    const minutes = Math.floor(timeMs / 60000);
    const seconds = Math.floor((timeMs % 60000) / 1000);
    const ms = Math.floor((timeMs % 1000) / 10);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
  };

  return (
    <group>
      {/* Checkpoint HUD */}
      <Html>
        <div className="checkpoint-hud">
          <div className="checkpoint-info">
            <span>
              Checkpoint: {currentCheckpoint + 1}/{checkpoints.length}
            </span>
          </div>
          <div className="lap-time">
            <span>Current: {formatTime(lapTime)}</span>
          </div>
          {bestLapTime && (
            <div className="best-lap-time">
              <span>Best: {formatTime(bestLapTime)}</span>
            </div>
          )}
          {isRacing && (
            <div className="racing-indicator">
              <span>RACING</span>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
