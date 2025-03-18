// src/components/CanvasScene.tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Sky } from "@react-three/drei";
import { Suspense } from "react";
import Terrain from "./Terrain";
import Vehicle from "./Vehicle";

export default function CanvasScene() {
  return (
    <Canvas shadows camera={{ position: [0, 10, 20], fov: 60 }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[100, 100, 100]} intensity={1} castShadow />

      <Sky sunPosition={[100, 20, 100]} />
      <Environment preset="sunset" />

      <Suspense fallback={null}>
        <Terrain />
        <Vehicle />
      </Suspense>

      <OrbitControls />
    </Canvas>
  );
}
