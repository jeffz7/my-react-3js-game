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
import Beetle from "../../components/vehicles/Beetle";
import { Html } from "@react-three/drei";

interface VehicleProps {
  updateVehicleStats?: (stats: { speed: number; distance: number }) => void;
}

const Vehicle = forwardRef<Group | null, VehicleProps>(
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
      const wheels = vehicleRef.current?.userData.wheels;
      if (wheels) {
        // Rotate wheels based on speed
        wheels.frontLeft.current.rotation.x += speed;
        wheels.frontRight.current.rotation.x += speed;
        wheels.backLeft.current.rotation.x += speed;
        wheels.backRight.current.rotation.x += speed;
      }
    });

    return (
      <group ref={vehicleRef}>
        <ThirdPersonCamera target={vehicleRef} />

        <Beetle />

        {username && (
          <Html position={[0, 2.2, 0]} center>
            <div className="player-name">{username}</div>
          </Html>
        )}

        {/* <VehicleHUD speed={speed} /> */}
      </group>
    );
  }
);

export default Vehicle;
