// src/components/CanvasScene.tsx
import { Canvas } from "@react-three/fiber";
import { Sky, Stars } from "@react-three/drei";
import Vehicle from "../game/Vehicle";
import Terrain from "../game/Terrain";
import Checkpoints from "../game/Checkpoints";
import RemotePlayers from "../game/Multiplayer/RemotePlayers";
import { useContext, useRef } from "react";
import { MultiplayerContext } from "../contexts/MultiplayerContext";
import { Group } from "three";

interface CanvasSceneProps {
  updateVehicleStats: (stats: { speed: number; distance: number }) => void;
}

export default function CanvasScene({ updateVehicleStats }: CanvasSceneProps) {
  const { remotePlayers } = useContext(MultiplayerContext);
  const vehicleRef = useRef<Group>(null);

  return (
    <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 7]} intensity={2} castShadow />

      {/* Your own vehicle */}
      <Vehicle updateVehicleStats={updateVehicleStats} />

      {/* Remote players */}
      <RemotePlayers players={remotePlayers} />

      {/* Environment */}
      <Terrain />
      <Checkpoints vehicleRef={vehicleRef} />
      <Sky sunPosition={[100, 10, 100]} />
      <Stars radius={100} depth={50} count={5000} factor={4} />
    </Canvas>
  );
}
