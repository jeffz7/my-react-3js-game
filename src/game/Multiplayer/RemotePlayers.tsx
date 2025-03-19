import { useRef, useEffect, useState } from "react";
import { Group, Vector3, Quaternion } from "three";
import Jeep from "../../components/vehicles/Jeep";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useContext } from "react";
import { MultiplayerContext } from "../../contexts/MultiplayerContext";

interface RemotePlayer {
  username: string;
  x: number;
  y: number;
  z: number;
  rotation: number;
  speed: number;
  steering: number;
  cameraAngle?: number;
  lastUpdate: number;
}

export default function RemotePlayers() {
  const { remotePlayers } = useContext(MultiplayerContext);
  const playerRefs = useRef<
    Map<
      string,
      {
        group: React.RefObject<Group>;
        wheels: any;
        targetPosition: Vector3;
        targetRotation: number;
        currentSpeed: number;
        currentSteering: number;
      }
    >
  >(new Map());

  // Initialize or update player references
  useEffect(() => {
    // Add new players that don't have refs yet
    remotePlayers.forEach((player) => {
      if (!playerRefs.current.has(player.username)) {
        playerRefs.current.set(player.username, {
          group: { current: null as unknown as Group },
          wheels: {
            frontLeft: { current: null },
            frontRight: { current: null },
            backLeft: { current: null },
            backRight: { current: null },
          },
          targetPosition: new Vector3(player.x, player.y, player.z),
          targetRotation: player.rotation,
          currentSpeed: player.speed,
          currentSteering: player.steering,
        });
      }
    });

    // Remove players that are no longer in the remote players list
    playerRefs.current.forEach((_, username) => {
      if (
        !Array.from(remotePlayers.values()).some((p) => p.username === username)
      ) {
        playerRefs.current.delete(username);
      }
    });
  }, [remotePlayers]);

  // Update remote player positions and rotations
  useFrame((state, delta) => {
    const POSITION_LERP_FACTOR = 0.2;
    const ROTATION_LERP_FACTOR = 0.2;
    const WHEEL_ROTATION_SPEED = 3;

    remotePlayers.forEach((player) => {
      const playerRef = playerRefs.current.get(player.username);
      if (playerRef && playerRef.group.current) {
        // Update target position and rotation
        playerRef.targetPosition.set(player.x, player.y, player.z);
        playerRef.targetRotation = player.rotation;
        playerRef.currentSpeed = player.speed;
        playerRef.currentSteering = player.steering;

        // Smoothly interpolate position
        playerRef.group.current.position.lerp(
          playerRef.targetPosition,
          POSITION_LERP_FACTOR
        );

        // Smoothly interpolate rotation
        const currentY = playerRef.group.current.rotation.y;
        const rotationDelta = playerRef.targetRotation - currentY;

        // Handle rotation wrapping (when crossing from -π to π or vice versa)
        let shortestRotation = rotationDelta;
        if (rotationDelta > Math.PI)
          shortestRotation = rotationDelta - Math.PI * 2;
        if (rotationDelta < -Math.PI)
          shortestRotation = rotationDelta + Math.PI * 2;

        playerRef.group.current.rotation.y +=
          shortestRotation * ROTATION_LERP_FACTOR;

        // Rotate wheels based on speed
        const wheels = playerRef.wheels;
        if (
          wheels.frontLeft.current &&
          wheels.frontRight.current &&
          wheels.backLeft.current &&
          wheels.backRight.current
        ) {
          // Rotate all wheels based on speed
          const wheelRotationAmount = player.speed * WHEEL_ROTATION_SPEED;
          wheels.frontLeft.current.rotation.x += wheelRotationAmount;
          wheels.frontRight.current.rotation.x += wheelRotationAmount;
          wheels.backLeft.current.rotation.x += wheelRotationAmount;
          wheels.backRight.current.rotation.x += wheelRotationAmount;

          // Apply steering to front wheels
          if (
            wheels.frontLeft.current.parent &&
            wheels.frontRight.current.parent
          ) {
            // Smoothly interpolate steering
            const currentSteering = wheels.frontLeft.current.parent.rotation.y;
            const targetSteering = player.steering * 0.5;
            const newSteering =
              currentSteering + (targetSteering - currentSteering) * 0.2;

            wheels.frontLeft.current.parent.rotation.y = newSteering;
            wheels.frontRight.current.parent.rotation.y = newSteering;
          }
        }
      }
    });
  });

  return (
    <>
      {Array.from(remotePlayers.values()).map((player) => {
        const playerRef = playerRefs.current.get(player.username);
        if (!playerRef) return null;

        return (
          <group
            key={player.username}
            ref={playerRef.group as any}
            position={[player.x, player.y, player.z]}
            rotation={[0, player.rotation, 0]}
          >
            <Jeep wheelRefs={playerRef.wheels} color="#3498db" />

            {/* Player nametag */}
            <Html position={[0, 2.5, 0]} center className="player-nametag">
              {player.username}
            </Html>
          </group>
        );
      })}
    </>
  );
}
