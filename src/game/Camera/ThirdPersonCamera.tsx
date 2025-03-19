import { useRef } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { Group, PerspectiveCamera as ThreePerspectiveCamera } from "three";
import useCameraFollow from "./hooks/useCameraFollow";

interface ThirdPersonCameraProps {
  target: React.RefObject<Group | null>;
}

export default function ThirdPersonCamera({ target }: ThirdPersonCameraProps) {
  const cameraRef = useRef<ThreePerspectiveCamera>(null);

  // Use the camera follow hook without destructuring
  useCameraFollow({ target, cameraRef });

  return (
    <PerspectiveCamera
      ref={cameraRef as any}
      makeDefault
      position={[0, 5, 10]}
      fov={60}
    />
  );
}
