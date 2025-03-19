import { useRef, useState, useEffect } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { Group } from "three";
import ThirdPersonCamera from "./ThirdPersonCamera";
import FirstPersonCamera from "./FirstPersonCamera";
import FixedCamera from "./FixedCamera";
import useInputControls from "../Vehicle/hooks/useInputControls";

interface VehicleCameraProps {
  target: React.RefObject<Group | null>;
}

export default function VehicleCamera({ target }: VehicleCameraProps) {
  const [cameraMode, setCameraMode] = useState<"third" | "first" | "fixed">(
    "fixed"
  );

  // Get input controls for camera zoom
  const controls = useInputControls();

  // Handle camera switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "1") setCameraMode("third");
      if (e.key === "2") setCameraMode("first");
      if (e.key === "3") setCameraMode("fixed");
    };

    window.addEventListener("keydown", handleKeyDown);
    console.log(">>> cameraMode", cameraMode);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Render the appropriate camera based on mode
  return (
    <>
      {cameraMode === "third" && (
        <ThirdPersonCamera target={target} controls={controls} />
      )}
      {cameraMode === "first" && <FirstPersonCamera target={target} />}
      {cameraMode === "fixed" && <FixedCamera target={target} />}
    </>
  );
}
