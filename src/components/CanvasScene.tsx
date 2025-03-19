// src/components/CanvasScene.tsx
import { Canvas } from "@react-three/fiber";
import { Sky, Stars, Environment } from "@react-three/drei";
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
      {/* Scene lighting - consolidated to avoid duplicates */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* Environment */}
      <Sky sunPosition={[100, 20, 100]} />
      <Stars radius={200} depth={50} count={5000} factor={4} />

      {/* Game elements */}
      <Terrain />
      <Checkpoints vehicleRef={vehicleRef} />
      <Vehicle ref={vehicleRef} updateVehicleStats={updateVehicleStats} />
      <RemotePlayers />
    </Canvas>
  );
}
