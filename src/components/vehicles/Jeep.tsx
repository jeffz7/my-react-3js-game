// components/vehicles/Jeep.tsx
import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { Group, Mesh } from "three";

interface JeepProps {
  color?: string;
}

export default function Jeep({ color = "#2c7f30" }: JeepProps) {
  const groupRef = useRef<Group>(null);
  const { nodes, materials } = useGLTF(
    "/assets/models/jeep_wrangler_1997.glb"
  ) as any;

  // Wheel references exposed for animation
  const wheelsRef = useRef({
    frontLeft: useRef<Mesh>(null),
    frontRight: useRef<Mesh>(null),
    backLeft: useRef<Mesh>(null),
    backRight: useRef<Mesh>(null),
  });

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.userData.wheels = wheelsRef.current;
    }
  }, []);

  return (
    <group ref={groupRef} dispose={null} scale={0.5} position={[0, 3, 0]}>
      {/* Main Body */}
      <primitive object={nodes.Body} />

      {/* Body Paint */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Body_body_paint_0.geometry}
        material={nodes.Body_body_paint_0.material}
      >
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Windows */}
      {Object.keys(nodes)
        .filter((key) => key.toLowerCase().includes("glass"))
        .map((key) => (
          <mesh
            key={key}
            castShadow
            receiveShadow
            geometry={nodes[key].geometry}
            material={nodes[key].material}
          >
            <meshStandardMaterial
              color="#111111"
              roughness={0.1}
              metalness={0.9}
              opacity={0.6}
              transparent
            />
          </mesh>
        ))}

      {/* Wheels */}
      <mesh
        ref={wheelsRef.current.frontRight}
        castShadow
        geometry={nodes.Wheel_R_1.geometry}
        material={nodes.Wheel_R_1.material}
      />
      <mesh
        ref={wheelsRef.current.frontLeft}
        castShadow
        geometry={nodes.Wheel_L_1.geometry}
        material={nodes.Wheel_L_1.material}
      />
      <mesh
        ref={wheelsRef.current.backRight}
        castShadow
        geometry={nodes.Rear_wheel1.geometry}
        material={nodes.Rear_wheel1.material}
      />
      <mesh
        ref={wheelsRef.current.backLeft}
        castShadow
        geometry={nodes.Rear_wheel1.geometry}
        material={nodes.Rear_wheel1.material}
        position={[
          -nodes.Rear_wheel1.position.x,
          nodes.Rear_wheel1.position.y,
          nodes.Rear_wheel1.position.z,
        ]}
      />

      {/* Lights (lamps) */}
      {["Head_lamp_L", "Head_lamp_R", "Rear_lamp_L", "Rear_lamp_R"].map(
        (key) => (
          <mesh
            key={key}
            geometry={nodes[key]?.geometry}
            material={nodes[key]?.material}
          >
            <meshStandardMaterial emissive="#ffcc00" emissiveIntensity={0.8} />
          </mesh>
        )
      )}

      {/* Roof and details */}
      <primitive object={nodes.Roof} />
      <primitive object={nodes.front_bumper} />
      <primitive object={nodes.Rear_Bumper} />
      <primitive object={nodes["Spear_Tire_cover"]} />
    </group>
  );
}

useGLTF.preload("/assets/models/jeep_wrangler_1997.glb");
