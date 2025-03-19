import { useRef } from "react";
import { RepeatWrapping, TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";

export default function Terrain() {
  const terrainRef = useRef(null);

  // Load terrain textures
  const [grassTexture, grassNormalMap, grassRoughnessMap] = useLoader(
    TextureLoader,
    ["/textures/terrain.jpg", "/textures/terrain.jpg", "/textures/terrain.jpg"]
  );

  // Configure texture repeating
  grassTexture.wrapS = grassTexture.wrapT = RepeatWrapping;
  grassNormalMap.wrapS = grassNormalMap.wrapT = RepeatWrapping;
  grassRoughnessMap.wrapS = grassRoughnessMap.wrapT = RepeatWrapping;

  grassTexture.repeat.set(100, 100);
  grassNormalMap.repeat.set(100, 100);
  grassRoughnessMap.repeat.set(100, 100);

  return (
    <mesh
      ref={terrainRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.1, 0]}
      receiveShadow
    >
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial
        map={grassTexture}
        normalMap={grassNormalMap}
        roughnessMap={grassRoughnessMap}
        roughness={0.8}
      />
    </mesh>
  );
}
