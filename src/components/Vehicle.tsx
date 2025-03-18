// src/components/Vehicle.tsx
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";

export default function Vehicle() {
  const vehicleRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (vehicleRef.current) {
      // simple spinning for demo, later add real controls & physics
      vehicleRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={vehicleRef} castShadow position={[0, 1, 0]}>
      <boxGeometry args={[2, 1, 4]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}
