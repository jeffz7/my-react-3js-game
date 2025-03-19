import { useRef, useEffect, useState } from "react";
import {
  PerspectiveCamera as ThreePerspectiveCamera,
  Group,
  Vector3,
} from "three";

interface CameraFollowProps {
  target: React.RefObject<Group | null>;
  cameraRef: React.RefObject<any>;
}

export default function useCameraFollow({
  target,
  cameraRef,
}: CameraFollowProps) {
  const [cameraAngle, setCameraAngle] = useState(0);
  const [cameraHeight, setCameraHeight] = useState(3);

  // Camera parameters
  const CAMERA_DISTANCE = 8;
  const CAMERA_HEIGHT_MIN = 2;
  const CAMERA_HEIGHT_MAX = 6;
  const MOUSE_SENSITIVITY = 1.5;

  // Handle mouse movement for camera control
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Only update camera if mouse is being held down
      if (e.buttons === 1) {
        setCameraAngle((prev) => prev - e.movementX * 0.01 * MOUSE_SENSITIVITY);
        setCameraHeight((prev) => {
          const newHeight = prev - e.movementY * 0.05 * MOUSE_SENSITIVITY;
          return Math.max(
            CAMERA_HEIGHT_MIN,
            Math.min(CAMERA_HEIGHT_MAX, newHeight)
          );
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Update camera position
  useEffect(() => {
    if (!target.current || !cameraRef.current) return;

    const updateCamera = () => {
      if (target.current && cameraRef.current) {
        // Calculate camera orbit position
        const cameraOrbitAngle = target.current.rotation.y + cameraAngle;
        const cameraTargetPosition = new Vector3(
          target.current.position.x +
            Math.sin(cameraOrbitAngle) * CAMERA_DISTANCE,
          target.current.position.y + cameraHeight,
          target.current.position.z +
            Math.cos(cameraOrbitAngle) * CAMERA_DISTANCE
        );

        // Smoothly interpolate camera position
        cameraRef.current.position.lerp(cameraTargetPosition, 0.1);

        // Make camera look at vehicle
        cameraRef.current.lookAt(
          target.current.position.x,
          target.current.position.y + 1,
          target.current.position.z
        );
      }
    };

    const animationId = requestAnimationFrame(function animate() {
      updateCamera();
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationId);
  }, [target, cameraRef, cameraAngle, cameraHeight]);

  return { cameraAngle, cameraHeight };
}
