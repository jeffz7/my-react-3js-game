import { useRef, useEffect, useState } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import {
  Group,
  PerspectiveCamera as ThreePerspectiveCamera,
  Vector3,
} from "three";
import { lerp } from "../../utils/math";

interface FixedCameraProps {
  target: React.RefObject<Group | null>;
  cinematic?: boolean;
}

export default function FixedCamera({
  target,
  cinematic = false,
}: FixedCameraProps) {
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const [cameraPosition, setCameraPosition] = useState<Vector3>(
    new Vector3(0, 30, 0)
  );
  const [currentCameraPoint, setCurrentCameraPoint] = useState(0);

  // Define fixed camera positions for cinematic mode
  const cinematicPositions = [
    { position: new Vector3(0, 30, 0), lookAt: new Vector3(0, 0, 0) },
    { position: new Vector3(30, 10, 30), lookAt: new Vector3(0, 0, 0) },
    { position: new Vector3(-30, 5, -10), lookAt: new Vector3(0, 0, 0) },
    { position: new Vector3(0, 3, 50), lookAt: new Vector3(0, 0, 0) },
  ];

  // Switch camera positions in cinematic mode
  useEffect(() => {
    if (!cinematic) return;

    const interval = setInterval(() => {
      setCurrentCameraPoint((prev) => (prev + 1) % cinematicPositions.length);
    }, 10000); // Switch every 10 seconds

    return () => clearInterval(interval);
  }, [cinematic]);

  // Update camera position
  useEffect(() => {
    if (!target.current || !cameraRef.current) return;

    const updateCamera = () => {
      if (target.current && cameraRef.current) {
        if (cinematic) {
          // Cinematic mode - smoothly move between predefined positions
          const targetPos = cinematicPositions[currentCameraPoint].position;
          const targetLookAt = target.current.position.clone();

          // Smoothly interpolate camera position
          cameraRef.current.position.lerp(targetPos, 0.01);

          // Look at vehicle
          cameraRef.current.lookAt(targetLookAt);
        } else {
          // Fixed mode - high overhead view that follows the vehicle
          const targetPos = new Vector3(
            target.current.position.x,
            target.current.position.y + 30,
            target.current.position.z
          );

          // Smoothly interpolate camera position
          cameraRef.current.position.lerp(targetPos, 0.1);

          // Look at vehicle
          cameraRef.current.lookAt(target.current.position);
        }
      }
    };

    const animationId = requestAnimationFrame(function animate() {
      updateCamera();
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationId);
  }, [target, cinematic, currentCameraPoint]);

  return (
    <PerspectiveCamera
      ref={cameraRef as any}
      makeDefault
      position={[0, 30, 0]}
      fov={60}
    />
  );
}
