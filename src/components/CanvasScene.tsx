// src/components/CanvasScene.tsx
import { Canvas } from "@react-three/fiber";
import { Sky, Stars, Environment } from "@react-three/drei";
import Vehicle from "../game/Vehicle";
import Checkpoints from "../game/Checkpoints";
import Multiplayer from "../game/Multiplayer";
import VehicleCamera from "../game/Camera/VehicleCamera";
import { useRef } from "react";
import { Group } from "three";
import Terrain from "../game/Terrain";
// import Vehicle from "./Vehicle";

interface CanvasSceneProps {
  updateVehicleStats?: (stats: { speed: number; distance: number }) => void;
}

export default function CanvasScene({ updateVehicleStats }: CanvasSceneProps) {
  const vehicleRef = useRef<Group>(null);

  return (
    <Canvas shadows>
      {/* Environment */}
      <Sky sunPosition={[100, 20, 100]} />
      <Stars radius={200} depth={50} count={5000} factor={4} />
      <Environment preset="sunset" />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

      {/* Game elements */}
      <Terrain />
      <Vehicle ref={vehicleRef} updateVehicleStats={updateVehicleStats} />
      <Checkpoints vehicleRef={vehicleRef} />
      <Multiplayer />

      {/* Camera */}
      <VehicleCamera target={vehicleRef} />
    </Canvas>
  );
}
