// src/components/Terrain.tsx
import { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

export default function Terrain() {
  const texture = useLoader(TextureLoader, "/textures/terrain.jpg");

  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[500, 500, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
