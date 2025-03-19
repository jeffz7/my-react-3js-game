import { Group } from "three";
import VehicleModel, { VehicleModelProps } from "./VehicleModel";

export default function Sedan({ color = "red", wheelRefs }: VehicleModelProps) {
  return (
    <VehicleModel color={color} wheelRefs={wheelRefs}>
      {/* Car body */}
      <mesh castShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[2, 0.5, 4]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Hood */}
      <mesh castShadow position={[0, 0.5, 1.2]}>
        <boxGeometry args={[1.9, 0.3, 1.5]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Cabin */}
      <mesh castShadow position={[0, 0.9, -0.2]}>
        <boxGeometry args={[1.8, 0.7, 2]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Trunk */}
      <mesh castShadow position={[0, 0.5, -1.5]}>
        <boxGeometry args={[1.9, 0.3, 1]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Windows */}
      <mesh position={[0, 1, 0.8]}>
        <boxGeometry args={[1.7, 0.6, 0.1]} />
        <meshStandardMaterial color="#4444ff" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, 1, -1.2]}>
        <boxGeometry args={[1.7, 0.6, 0.1]} />
        <meshStandardMaterial color="#4444ff" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0.9, 1, -0.2]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[1.9, 0.6, 0.1]} />
        <meshStandardMaterial color="#4444ff" transparent opacity={0.7} />
      </mesh>
      <mesh position={[-0.9, 1, -0.2]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[1.9, 0.6, 0.1]} />
        <meshStandardMaterial color="#4444ff" transparent opacity={0.7} />
      </mesh>

      {/* Wheels with refs for rotation and steering */}
      <group
        ref={(el) => {
          if (wheelRefs && wheelRefs.current) wheelRefs.current[0] = el!;
        }}
        position={[-1.1, -0.3, 1.2]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <mesh castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
          <meshStandardMaterial color="#111" metalness={0.8} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.15]}>
          <cylinderGeometry args={[0.25, 0.25, 0.01, 16]} />
          <meshStandardMaterial color="#666" metalness={1} roughness={0.2} />
        </mesh>
      </group>

      <group
        ref={(el) => {
          if (wheelRefs && wheelRefs.current) wheelRefs.current[1] = el!;
        }}
        position={[1.1, -0.3, 1.2]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <mesh castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
          <meshStandardMaterial color="#111" metalness={0.8} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.15]}>
          <cylinderGeometry args={[0.25, 0.25, 0.01, 16]} />
          <meshStandardMaterial color="#666" metalness={1} roughness={0.2} />
        </mesh>
      </group>

      <group
        ref={(el) => {
          if (wheelRefs && wheelRefs.current) wheelRefs.current[2] = el!;
        }}
        position={[-1.1, -0.3, -1.2]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <mesh castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
          <meshStandardMaterial color="#111" metalness={0.8} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.15]}>
          <cylinderGeometry args={[0.25, 0.25, 0.01, 16]} />
          <meshStandardMaterial color="#666" metalness={1} roughness={0.2} />
        </mesh>
      </group>

      <group
        ref={(el) => {
          if (wheelRefs && wheelRefs.current) wheelRefs.current[3] = el!;
        }}
        position={[1.1, -0.3, -1.2]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <mesh castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
          <meshStandardMaterial color="#111" metalness={0.8} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.15]}>
          <cylinderGeometry args={[0.25, 0.25, 0.01, 16]} />
          <meshStandardMaterial color="#666" metalness={1} roughness={0.2} />
        </mesh>
      </group>
    </VehicleModel>
  );
}
