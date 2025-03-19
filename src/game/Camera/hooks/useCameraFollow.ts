import { useRef, useEffect, useState, useContext } from "react";
import {
  PerspectiveCamera as ThreePerspectiveCamera,
  Group,
  Vector3,
} from "three";
import { useFrame } from "@react-three/fiber";
import { VehicleStateContext } from "../../Vehicle/index";

interface CameraFollowProps {
  target: React.RefObject<Group | null>;
  cameraRef: React.RefObject<any>;
  controls: {
    zoomDelta: number;
    zoomIn: boolean;
    zoomOut: boolean;
  };
}

export default function useCameraFollow({
  target,
  cameraRef,
  controls,
}: CameraFollowProps) {
  // Get vehicle state from context
  const vehicleState = useContext(VehicleStateContext);

  const [cameraAngle, setCameraAngle] = useState(0);
  const [cameraHeight, setCameraHeight] = useState(3);
  const [cameraDistance, setCameraDistance] = useState(6);

  // Camera parameters
  const CAMERA_DISTANCE_MIN = 4;
  const CAMERA_DISTANCE_MAX = 12;
  const CAMERA_HEIGHT_MIN = 2;
  const CAMERA_HEIGHT_MAX = 6;
  const MOUSE_SENSITIVITY = 1.5;
  const ZOOM_SENSITIVITY = 0.5;

  // Handle zoom with mouse wheel
  useEffect(() => {
    if (controls.zoomDelta !== 0) {
      setCameraDistance((prev) => {
        const newDistance = prev + controls.zoomDelta * 0.01 * ZOOM_SENSITIVITY;
        return Math.max(
          CAMERA_DISTANCE_MIN,
          Math.min(CAMERA_DISTANCE_MAX, newDistance)
        );
      });
    }
  }, [controls.zoomDelta]);

  // Handle mouse movement for camera control
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
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
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Use useFrame for smooth camera following
  useFrame(() => {
    if (!target.current || !cameraRef.current) return;

    // Get vehicle position and rotation from context
    const vehiclePosition = vehicleState.position;
    const vehicleRotation = vehicleState.rotation;
    const vehicleSpeed = vehicleState.speed;

    // Calculate camera position - ALWAYS behind the vehicle
    // Add PI to ensure camera is behind the vehicle
    const cameraOrbitAngle = vehicleRotation + cameraAngle + Math.PI;

    // Calculate target camera position
    const targetCameraPosition = new Vector3(
      vehiclePosition.x + Math.sin(cameraOrbitAngle) * cameraDistance,
      vehiclePosition.y + cameraHeight,
      vehiclePosition.z + Math.cos(cameraOrbitAngle) * cameraDistance
    );

    // Adjust camera lag based on speed
    const speedFactor = Math.min(1, Math.abs(vehicleSpeed) * 10);
    const lagFactor = 0.1 + 0.05 * speedFactor; // More responsive at higher speeds

    // Smoothly move camera to target position
    cameraRef.current.position.lerp(targetCameraPosition, lagFactor);

    // Make camera look at vehicle
    cameraRef.current.lookAt(
      vehiclePosition.x,
      vehiclePosition.y + 1, // Look slightly above the vehicle
      vehiclePosition.z
    );
  });

  return { cameraAngle, cameraHeight, cameraDistance };
}
