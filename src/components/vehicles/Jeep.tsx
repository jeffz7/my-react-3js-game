// components/vehicles/Jeep.tsx

import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { Group, Mesh } from "three";

interface JeepProps {
  color?: string;
}

export default function Jeep({ color = "#2c7f30" }: JeepProps) {
  const group = useRef<Group>(null);
  const { nodes, materials } = useGLTF(
    "/assets/models/jeep_wrangler_1997.glb"
  ) as any;

  // Create references for the wheels
  const wheelFLRef = useRef<Mesh>(null);
  const wheelFRRef = useRef<Mesh>(null);
  const wheelBLRef = useRef<Mesh>(null);
  const wheelBRRef = useRef<Mesh>(null);

  // Update wheel rotation based on parent's movement
  useEffect(() => {
    if (!group.current) return;

    // Expose wheel references to parent
    if (group.current) {
      group.current.userData.wheels = {
        frontLeft: wheelFLRef,
        frontRight: wheelFRRef,
        backLeft: wheelBLRef,
        backRight: wheelBRRef,
      };
    }
  }, []);

  return (
    <group ref={group} dispose={null} scale={0.7}>
      {/* Jeep body */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.body?.geometry}
        position={[0, 0.8, 0]}
      >
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Windows */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.windows?.geometry}
        position={[0, 1.4, 0]}
      >
        <meshStandardMaterial
          color="#111111"
          roughness={0.1}
          metalness={0.9}
          opacity={0.7}
          transparent
        />
      </mesh>

      {/* Bumpers and details */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.details?.geometry}
        position={[0, 0.6, 0]}
      >
        <meshStandardMaterial color="#333333" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* Lights */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.lights?.geometry}
        position={[0, 1.1, 1.8]}
      >
        <meshStandardMaterial
          color="#ffcc00"
          emissive="#ffcc00"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Wheels */}
      <group position={[0.8, 0.4, 1.2]}>
        <mesh
          ref={wheelFRRef}
          castShadow
          receiveShadow
          geometry={nodes.wheel?.geometry}
        >
          <meshStandardMaterial color="#111111" roughness={0.7} />
        </mesh>
      </group>

      <group position={[-0.8, 0.4, 1.2]}>
        <mesh
          ref={wheelFLRef}
          castShadow
          receiveShadow
          geometry={nodes.wheel?.geometry}
        >
          <meshStandardMaterial color="#111111" roughness={0.7} />
        </mesh>
      </group>

      <group position={[0.8, 0.4, -1.2]}>
        <mesh
          ref={wheelBRRef}
          castShadow
          receiveShadow
          geometry={nodes.wheel?.geometry}
        >
          <meshStandardMaterial color="#111111" roughness={0.7} />
        </mesh>
      </group>

      <group position={[-0.8, 0.4, -1.2]}>
        <mesh
          ref={wheelBLRef}
          castShadow
          receiveShadow
          geometry={nodes.wheel?.geometry}
        >
          <meshStandardMaterial color="#111111" roughness={0.7} />
        </mesh>
      </group>

      {/* Roof rack with accessories */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.roofrack?.geometry}
        position={[0, 2.1, 0]}
      >
        <meshStandardMaterial color="#444444" roughness={0.6} />
      </mesh>

      {/* Spare tire */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.sparetire?.geometry}
        position={[0, 1.2, -1.8]}
      >
        <meshStandardMaterial color="#111111" roughness={0.7} />
      </mesh>
    </group>
  );
}

// Preload the model
useGLTF.preload("/assets/models/jeep_wrangler_1997.glb");
