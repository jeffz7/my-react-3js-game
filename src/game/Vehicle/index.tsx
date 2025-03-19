// src/game/Vehicle/index.tsx

import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { Group, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { MultiplayerContext } from "../../contexts/MultiplayerContext";
import ThirdPersonCamera from "../Camera/ThirdPersonCamera";
import VehicleHUD from "../../components/VehicleHUD";
import useInputControls from "./hooks/useInputControls";
import useVehiclePhysics from "./hooks/useVehiclePhysics";
import useMultiplayerSync from "../Multiplayer/hooks/useMultiplayerSync";
import Jeep from "../../components/vehicles/Jeep";
import { Html } from "@react-three/drei";

// Create a shared context for vehicle state
export const VehicleStateContext = React.createContext({
  speed: 0,
  steering: 0,
  position: new Vector3(),
  rotation: 0,
});

const Vehicle = forwardRef(
  (
    { updateVehicleStats }: { updateVehicleStats?: (stats: any) => void },
    ref
  ) => {
    const vehicleRef = useRef<Group>(null);
    const { username } = useContext(UserContext);
    const { room } = useContext(MultiplayerContext);

    // Create wheel refs
    const wheelRefs = {
      frontLeft: useRef(null),
      frontRight: useRef(null),
      backLeft: useRef(null),
      backRight: useRef(null),
    };

    // Get input controls
    const controls = useInputControls();

    // Use vehicle physics
    const { speed, steering, position, rotation } = useVehiclePhysics({
      vehicleRef,
      controls,
    });

    // Create state for vehicle data that can be shared
    const [vehicleState, setVehicleState] = useState({
      speed,
      steering,
      position,
      rotation,
    });

    // Update vehicle state when physics values change
    useEffect(() => {
      setVehicleState({
        speed,
        steering,
        position,
        rotation,
      });
    }, [speed, steering, position, rotation]);

    // Expose vehicle methods and properties to parent
    useImperativeHandle(ref, () => ({
      getPosition: () => position,
      getRotation: () => rotation,
      getSpeed: () => speed,
      getSteering: () => steering,
      getControls: () => controls,
    }));

    // Update vehicle stats for UI
    useEffect(() => {
      if (updateVehicleStats) {
        updateVehicleStats({
          speed: Math.abs(speed * 100).toFixed(0),
          steering: (steering * 100).toFixed(0),
        });
      }
    }, [speed, steering, updateVehicleStats]);

    // Use multiplayer sync
    useMultiplayerSync({
      vehicleRef,
      room,
      username,
      speed,
      steering,
      cameraAngle: 0, // We'll update this later
    });

    // Rotate wheels based on speed and steering
    useFrame(() => {
      // Front left wheel
      if (wheelRefs.frontLeft.current) {
        // Rotate wheel forward/backward based on speed
        (wheelRefs.frontLeft.current as any).rotation.x += speed * 0.5;
        // Apply steering angle
        (wheelRefs.frontLeft.current as any).rotation.y = steering * 0.5;
      }

      // Front right wheel
      if (wheelRefs.frontRight.current) {
        (wheelRefs.frontRight.current as any).rotation.x += speed * 0.5;
        (wheelRefs.frontRight.current as any).rotation.y = steering * 0.5;
      }

      // Back left wheel
      if (wheelRefs.backLeft.current) {
        (wheelRefs.backLeft.current as any).rotation.x += speed * 0.5;
      }

      // Back right wheel
      if (wheelRefs.backRight.current) {
        (wheelRefs.backRight.current as any).rotation.x += speed * 0.5;
      }
    });

    return (
      <>
        <VehicleStateContext.Provider value={vehicleState}>
          <VehicleHUD speed={speed} />
          <group
            ref={vehicleRef}
            position={position.toArray()}
            rotation={[0, rotation, 0]}
          >
            <Jeep wheelRefs={wheelRefs} />

            {/* Camera follows the vehicle */}
            <ThirdPersonCamera target={vehicleRef} controls={controls} />
          </group>
        </VehicleStateContext.Provider>
      </>
    );
  }
);

export default Vehicle;
