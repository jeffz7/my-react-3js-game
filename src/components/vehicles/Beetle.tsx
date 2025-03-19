// Beetle.tsx
import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { Group, Mesh } from "three";

export default function Beetle({ scale = 0.6 }) {
  const groupRef = useRef<Group>(null);
  const { nodes, materials } = useGLTF("/assets/models/Beetle.glb") as any;

  const wheelsRef = useRef({
    left: useRef<Mesh>(null),
    right: useRef<Mesh>(null),
  });

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.userData.wheels = wheelsRef.current;
    }
  }, []);

  return (
    <group ref={groupRef} dispose={null} scale={scale}>
      {/* Body with original material */}
      <mesh
        geometry={nodes.Plane007_body_0.geometry}
        material={materials[nodes.Plane007_body_0.material.name]}
        castShadow
        receiveShadow
      />

      {/* Wheels with original materials */}
      <mesh
        ref={wheelsRef.current.left}
        geometry={nodes.Plane007_wheels_left_0.geometry}
        material={materials[nodes.Plane007_wheels_left_0.material.name]}
        castShadow
      />
      <mesh
        ref={wheelsRef.current.right}
        geometry={nodes.Plane007_wheels_right_0.geometry}
        material={materials[nodes.Plane007_wheels_right_0.material.name]}
        castShadow
      />
    </group>
  );
}

useGLTF.preload("/assets/models/Beetle.glb");
