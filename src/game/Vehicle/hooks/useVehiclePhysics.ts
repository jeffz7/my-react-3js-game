import { useRef, useState, useEffect } from "react";
import { Group, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

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
  const maxSpeed = 40; // Maximum speed
  const acceleration = 0.2; // Acceleration rate
  const deceleration = 0.05; // Natural deceleration (friction/drag)
  const brakeForce = 0.3; // Braking force
  const steeringSpeed = 0.03; // How quickly steering changes
  const maxSteering = 0.6; // Maximum steering angle
  const steeringReturn = 0.1; // How quickly steering returns to center
  const groundFriction = 0.98; // Ground friction (reduces speed)

  // Update vehicle physics
  useFrame((state, delta) => {
    if (!vehicleRef.current) return;

    // Calculate acceleration/deceleration
    let speedChange = 0;

    // Apply acceleration
    if (controls.forward) {
      speedChange += acceleration;
    }

    // Apply reverse/braking
    if (controls.backward) {
      // If moving forward, apply stronger braking
      if (speed > 0) {
        speedChange -= brakeForce;
      } else {
        // Reverse at half the acceleration
        speedChange -= acceleration * 0.5;
      }
    }

    // Apply braking
    if (controls.brake) {
      // Apply stronger braking force
      speedChange -= Math.sign(speed) * brakeForce * 1.5;
    }

    // Apply natural deceleration when no input
    if (!controls.forward && !controls.backward) {
      speedChange -= Math.sign(speed) * deceleration;
    }

    // Update speed with limits
    let newSpeed = speed + speedChange;

    // Apply ground friction
    newSpeed *= groundFriction;

    // Ensure speed doesn't exceed limits
    newSpeed = Math.max(Math.min(newSpeed, maxSpeed), -maxSpeed / 2);

    // If speed is very small, stop completely (prevent creeping)
    if (Math.abs(newSpeed) < 0.05) {
      newSpeed = 0;
    }

    setSpeed(newSpeed);

    // Calculate steering
    let steeringChange = 0;

    // Apply steering input
    if (controls.left) {
      steeringChange -= steeringSpeed;
    }
    if (controls.right) {
      steeringChange += steeringSpeed;
    }

    // Apply steering with limits
    let newSteering = steering + steeringChange;

    // Return steering to center when no input
    if (!controls.left && !controls.right) {
      newSteering *= 1 - steeringReturn;
    }

    // Limit steering angle
    newSteering = Math.max(Math.min(newSteering, maxSteering), -maxSteering);

    // Reduce steering effectiveness at higher speeds
    const steeringFactor = Math.max(0.2, 1 - Math.abs(newSpeed) / maxSpeed);

    setSteering(newSteering);

    // Update rotation based on steering and speed
    const rotationChange = newSteering * newSpeed * 0.01;
    const newRotation = rotation + rotationChange;
    setRotation(newRotation);

    // Update position based on speed and rotation
    const moveX = Math.sin(newRotation) * newSpeed * 0.1;
    const moveZ = Math.cos(newRotation) * newSpeed * 0.1;

    const newPosition = new Vector3(
      position.x + moveX,
      position.y,
      position.z - moveZ
    );

    setPosition(newPosition);

    // Apply position and rotation to vehicle
    vehicleRef.current.position.copy(newPosition);
    vehicleRef.current.rotation.y = newRotation;

    // Tilt the vehicle slightly when steering
    vehicleRef.current.rotation.z = -newSteering * 0.2;

    // Apply a slight pitch based on acceleration/deceleration
    const accelerationPitch =
      (speedChange > 0 ? -0.05 : 0.05) * Math.abs(speedChange) * 2;
    vehicleRef.current.rotation.x = accelerationPitch;
  });

  return {
    speed,
    steering,
    position,
    rotation,
  };
}
