import { useRef, useEffect } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import {
  Group,
  PerspectiveCamera as ThreePerspectiveCamera,
  Vector3,
} from "three";

interface FirstPersonCameraProps {
  target: React.RefObject<Group | null>;
}

export default function FirstPersonCamera({ target }: FirstPersonCameraProps) {
  const cameraRef = useRef<ThreePerspectiveCamera>(null);

  // Update camera position to be inside the vehicle
  useEffect(() => {
    if (!target.current || !cameraRef.current) return;

    const updateCamera = () => {
      if (target.current && cameraRef.current) {
        // Position camera at driver's seat position
        const driverPosition = new Vector3(0, 1.7, 0.2);
        driverPosition.applyMatrix4(target.current.matrixWorld);

        // Set camera position
        cameraRef.current.position.copy(driverPosition);

        // Calculate forward direction based on vehicle rotation
        const forward = new Vector3(0, 0, -1);
        forward.applyQuaternion(target.current.quaternion);

        // Look in the direction the vehicle is facing
        const lookAtPosition = new Vector3().copy(driverPosition).add(forward);
        cameraRef.current.lookAt(lookAtPosition);
      }
    };

    const animationId = requestAnimationFrame(function animate() {
      updateCamera();
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationId);
  }, [target]);

  return (
    <PerspectiveCamera
      ref={cameraRef as any}
      makeDefault
      position={[0, 0, 0]}
      fov={75}
      near={0.1}
    />
  );
}
