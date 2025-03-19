// src/game/Vehicle/index.tsx

import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Group, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { MultiplayerContext } from "../../contexts/MultiplayerContext";
import ThirdPersonCamera from "../Camera/ThirdPersonCamera";
import VehicleHUD from "../../components/VehicleHUD";
import Sedan from "../../components/vehicles/Sedan";
import useInputControls from "./hooks/useInputControls";
import useVehiclePhysics from "./hooks/useVehiclePhysics";
import useMultiplayerSync from "../Multiplayer/hooks/useMultiplayerSync";
import Jeep from "../../components/vehicles/Jeep";

interface VehicleProps {
  updateVehicleStats?: (stats: { speed: number; distance: number }) => void;
}

const Vehicle = forwardRef<Group, VehicleProps>(
  ({ updateVehicleStats }, ref) => {
    const vehicleRef = useRef<Group | null>(null);
    const distanceTraveled = useRef(0);
    const lastPosition = useRef(new Vector3(0, 0, 0));

    const { username } = useContext(UserContext);
    const { room } = useContext(MultiplayerContext);

    // Expose the vehicle ref to parent components
    useImperativeHandle(ref, () => vehicleRef.current as Group);

    // Get input controls
    const controls = useInputControls();

    // Apply physics to vehicle
    const { speed, steering, position, rotation } = useVehiclePhysics({
      vehicleRef,
      controls,
    });

    // Calculate distance traveled
    useFrame(() => {
      if (vehicleRef.current) {
        const currentPos = vehicleRef.current.position.clone();
        const delta = currentPos.distanceTo(lastPosition.current);
        distanceTraveled.current += delta;
        lastPosition.current = currentPos;

        // Update vehicle stats if callback provided
        if (updateVehicleStats) {
          updateVehicleStats({
            speed: Math.abs(speed),
            distance: distanceTraveled.current,
          });
        }
      }
    });

    // Sync with multiplayer
    useMultiplayerSync({
      vehicleRef,
      speed,
      steering,
      username,
      room,
    });

    // Rotate wheels based on speed and steering
    useFrame(() => {
      if (!vehicleRef.current) return;

      const wheels = vehicleRef.current.userData.wheels;
      if (!wheels) return;

      // Rotate all wheels based on speed
      const wheelRotationSpeed = speed * 0.01;

      Object.values(wheels).forEach((wheelRef: any) => {
        if (wheelRef.current) {
          wheelRef.current.rotation.x += wheelRotationSpeed;
        }
      });

      // Apply steering to front wheels
      if (wheels.frontLeft.current && wheels.frontRight.current) {
        wheels.frontLeft.current.rotation.y = steering;
        wheels.frontRight.current.rotation.y = steering;
      }
    });

    return (
      <>
        <ThirdPersonCamera target={vehicleRef} />

        <group ref={vehicleRef} position={[0, 0, 0]}>
          <Jeep color="#2c7f30" />
        </group>

        {/* <VehicleHUD speed={speed} /> */}
      </>
    );
  }
);

export default Vehicle;
