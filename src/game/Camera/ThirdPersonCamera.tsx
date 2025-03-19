// src/game/Camera/ThirdPersonCamera.tsx

import { useRef } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { PerspectiveCamera as ThreePerspectiveCamera, Group } from "three";
import useCameraFollow from "./hooks/useCameraFollow";

interface ThirdPersonCameraProps {
  target: React.RefObject<Group | null>;
  controls: {
    zoomDelta: number;
    zoomIn: boolean;
    zoomOut: boolean;
  };
}

export default function ThirdPersonCamera({
  target,
  controls,
}: ThirdPersonCameraProps) {
  const cameraRef = useRef<ThreePerspectiveCamera>(null);

  // Use our enhanced camera follow hook
  useCameraFollow({
    target,
    cameraRef,
    controls,
  });

  return (
    <PerspectiveCamera
      ref={cameraRef as any}
      makeDefault
      position={[0, 5, 10]}
      fov={75}
      near={0.1}
      far={1000}
    />
  );
}
