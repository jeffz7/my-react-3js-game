// components/vehicles/Jeep.tsx
import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { Group, Mesh, Material } from "three";

// Define GLTFResult interface
interface GLTFResult {
  nodes: Record<string, Mesh>;
  materials: Record<string, Material>;
}

interface JeepProps {
  color?: string;
  wheelRefs?: {
    frontLeft: React.RefObject<any>;
    frontRight: React.RefObject<any>;
    backLeft: React.RefObject<any>;
    backRight: React.RefObject<any>;
  };
}

export default function Jeep({ color = "#2c7f30", wheelRefs }: JeepProps) {
  const groupRef = useRef<Group>(null);
  const { nodes, materials } = useGLTF(
    "/assets/models/jeep.glb"
  ) as unknown as GLTFResult;

  // Use the passed refs if provided, otherwise use internal refs
  const wheels = wheelRefs || {
    frontLeft: useRef<Mesh>(null),
    frontRight: useRef<Mesh>(null),
    backLeft: useRef<Mesh>(null),
    backRight: useRef<Mesh>(null),
  };

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.userData.wheels = wheels;
    }
  }, []);

  return (
    <group
      ref={groupRef}
      dispose={null}
      scale={0.5}
      position={[0, 0, 0]}
      rotation={[0, Math.PI, 0]}
    >
      <group scale={0.01}>
        <group position={[0, 42.076, 0]}>
          <group position={[0, -53.508, 0]}>
            <mesh
              ref={wheels.backRight}
              castShadow
              receiveShadow
              geometry={nodes.tireBackRight_tires_0.geometry}
              material={materials.tires}
              position={[-89.951, 46.625, -107.81]}
            />
            <mesh
              ref={wheels.backLeft}
              castShadow
              receiveShadow
              geometry={nodes.tireBackLeft_tires_0.geometry}
              material={materials.tires}
              position={[89.951, 46.625, -107.81]}
            />
            <mesh
              ref={wheels.frontRight}
              castShadow
              receiveShadow
              geometry={nodes.tireFrontRight_tires_0.geometry}
              material={materials.tires}
              position={[-80.629, 46.625, 134.15]}
            />
            <mesh
              ref={wheels.frontLeft}
              castShadow
              receiveShadow
              geometry={nodes.tireFrontLeft_tires_0.geometry}
              material={materials.tires}
              position={[80.629, 46.625, 134.15]}
            />
          </group>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.glass_jeepwindows_0.geometry}
            material={materials.jeepwindows}
            position={[0, 94.884, 31.763]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.body_jeep_0.geometry}
            material={materials.jeep}
            position={[0, -11.969, 0]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.axleBackLeft_jeep_0.geometry}
            material={materials.jeep}
            position={[15.118, -6.883, -107.81]}
            rotation={[0, -Math.PI / 2, 0]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.axleBackRight_jeep_0.geometry}
            material={materials.jeep}
            position={[-15.118, -6.883, -107.81]}
            rotation={[0, Math.PI / 2, 0]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.axleFrontLeft_jeep_0.geometry}
            material={materials.jeep}
            position={[15.118, -6.883, 134.15]}
            rotation={[0, -Math.PI / 2, 0]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.axleFrontRight_jeep_0.geometry}
            material={materials.jeep}
            position={[-15.118, -6.883, 134.15]}
            rotation={[0, Math.PI / 2, 0]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.suspensionBackLeft_jeep_0.geometry}
            material={materials.jeep}
            position={[61.339, -6.883, -118.405]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.suspensionBackRight_jeep_0.geometry}
            material={materials.jeep}
            position={[-61.339, -6.883, -118.405]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.suspensionFrontLeft_jeep_0.geometry}
            material={materials.jeep}
            position={[54.511, -6.883, 143.614]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.suspensionFrontRight_jeep_0.geometry}
            material={materials.jeep}
            position={[-54.511, -6.883, 143.614]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.poke_jeep_0.geometry}
            material={materials.jeep}
            position={[0, 36.028, 19.275]}
            rotation={[-0.18, 0, 0]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.steeringwheel_jeep_0.geometry}
            material={materials.jeep}
            position={[38.957, 90.926, 1.049]}
            rotation={[-Math.PI / 4, 0, 0]}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/assets/models/jeep.glb");
