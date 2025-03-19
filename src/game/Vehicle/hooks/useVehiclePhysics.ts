// src/game/Vehicle/hooks/useVehiclePhysics.ts

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, Group, Quaternion, Euler } from "three";

interface VehiclePhysicsProps {
  vehicleRef: React.RefObject<Group | null>;
  controls: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    brake: boolean;
  };
}

export default function useVehiclePhysics({
  vehicleRef,
  controls,
}: VehiclePhysicsProps) {
  // Vehicle state
  const [speed, setSpeed] = useState(0);
  const [steering, setSteering] = useState(0);
  const [position, setPosition] = useState(new Vector3(0, 0, 0));
  const [rotation, setRotation] = useState(0);

  // Physics parameters
  const MAX_SPEED = 0.5;
  const MAX_REVERSE_SPEED = MAX_SPEED * 0.5;
  const ACCELERATION = 0.005;
  const DECELERATION = 0.003;
  const BRAKE_POWER = 0.01;
  const NATURAL_DECELERATION = 0.001;
  const STEERING_SPEED = 0.02;
  const STEERING_RESET_SPEED = 0.03;
  const MAX_STEERING = 0.8;
  const STEERING_INFLUENCE = 0.9;
  const SPEED_STEERING_REDUCTION = 0.7;

  // Tilting parameters
  const MAX_TILT_ANGLE = 0.1;
  const TILT_FACTOR = 0.8;

  // Update vehicle physics
  useFrame((state, delta) => {
    if (!vehicleRef.current) return;

    // Calculate acceleration/deceleration
    let acceleration = 0;
    let targetSteering = 0;

    // Handle acceleration
    if (controls.forward) {
      acceleration = ACCELERATION;
    } else if (controls.backward) {
      acceleration = -ACCELERATION;
    }

    // Handle braking
    if (controls.brake) {
      if (Math.abs(speed) > 0.01) {
        acceleration = speed > 0 ? -BRAKE_POWER : BRAKE_POWER;
      } else {
        setSpeed(0);
      }
    }

    // Natural deceleration when no input
    if (!controls.forward && !controls.backward && !controls.brake) {
      if (Math.abs(speed) < NATURAL_DECELERATION) {
        setSpeed(0);
      } else {
        acceleration = speed > 0 ? -NATURAL_DECELERATION : NATURAL_DECELERATION;
      }
    }

    // Apply acceleration to speed
    let newSpeed = speed + acceleration;

    // Clamp speed to max values
    if (newSpeed > MAX_SPEED) newSpeed = MAX_SPEED;
    if (newSpeed < -MAX_REVERSE_SPEED) newSpeed = -MAX_REVERSE_SPEED;

    // Handle steering
    if (controls.left) {
      targetSteering = MAX_STEERING;
    } else if (controls.right) {
      targetSteering = -MAX_STEERING;
    }

    // Adjust steering based on speed
    const speedFactor = Math.min(1, Math.abs(newSpeed) / MAX_SPEED);
    const steeringInfluence =
      STEERING_INFLUENCE - speedFactor * SPEED_STEERING_REDUCTION;

    // Gradually adjust steering towards target
    let newSteering = steering;
    if (targetSteering !== 0) {
      // Apply steering with speed-based influence
      const steeringDelta = (targetSteering - steering) * steeringInfluence;
      newSteering += steeringDelta * STEERING_SPEED;
    } else {
      // Return steering to center
      if (Math.abs(steering) < STEERING_RESET_SPEED) {
        newSteering = 0;
      } else {
        newSteering +=
          steering > 0 ? -STEERING_RESET_SPEED : STEERING_RESET_SPEED;
      }
    }

    // Clamp steering
    if (newSteering > MAX_STEERING) newSteering = MAX_STEERING;
    if (newSteering < -MAX_STEERING) newSteering = -MAX_STEERING;

    // Update vehicle rotation based on steering and speed
    // Only apply steering if we're moving
    const rotationDelta =
      Math.abs(newSpeed) > 0.01
        ? newSteering * Math.abs(newSpeed) * 0.5 * (newSpeed > 0 ? 1 : -1)
        : 0;

    const newRotation = vehicleRef.current.rotation.y + rotationDelta;
    vehicleRef.current.rotation.y = newRotation;

    // Calculate movement direction based on rotation
    // The Jeep model is rotated 180 degrees, so we use (0,0,-1) as forward
    const moveDirection = new Vector3(0, 0, -1).applyAxisAngle(
      new Vector3(0, 1, 0),
      newRotation
    );

    // Apply movement
    vehicleRef.current.position.addScaledVector(moveDirection, newSpeed);

    // Apply vehicle tilting
    const vehicleBody = vehicleRef.current.children[0];
    if (vehicleBody) {
      const targetRollTilt =
        (-newSteering * MAX_TILT_ANGLE * Math.abs(newSpeed)) / MAX_SPEED;
      const targetPitchTilt = -acceleration * 10 * MAX_TILT_ANGLE;

      vehicleBody.rotation.z +=
        (targetRollTilt - vehicleBody.rotation.z) * TILT_FACTOR * delta * 60;
      vehicleBody.rotation.x +=
        (targetPitchTilt - vehicleBody.rotation.x) * TILT_FACTOR * delta * 60;
    }

    // Update state
    setSpeed(newSpeed);
    setSteering(newSteering);
    setPosition(vehicleRef.current.position.clone());
    setRotation(newRotation);
  });

  return { speed, steering, position, rotation };
}
