// src/components/Vehicle.tsx
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import { Group, Vector3, Quaternion, Euler } from "three";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { MultiplayerContext } from "../contexts/MultiplayerContext";
import { Html, PerspectiveCamera } from "@react-three/drei";
import "../css/Vehicle.css";

export default function Vehicle() {
  const vehicleRef = useRef<Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const wheelsRef = useRef<Group[]>([]);
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [steering, setSteering] = useState(0);
  const [cameraAngle, setCameraAngle] = useState(0);
  const [cameraHeight, setCameraHeight] = useState(3);
  const { username } = useContext(UserContext);
  const { room } = useContext(MultiplayerContext);

  // Vehicle physics parameters
  const MAX_SPEED = 0.5;
  const ACCELERATION = 0.01;
  const DECELERATION = 0.005;
  const MAX_STEERING = 0.8;
  const STEERING_SPEED = 0.04;
  const STEERING_RESET_SPEED = 0.08;

  // Camera parameters
  const CAMERA_DISTANCE = 8;
  const CAMERA_HEIGHT_MIN = 2;
  const CAMERA_HEIGHT_MAX = 6;
  const MOUSE_SENSITIVITY = 1.5;

  // Handle keyboard controls
  useEffect(() => {
    const keys = {
      w: false,
      s: false,
      a: false,
      d: false,
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() in keys) {
        keys[e.key.toLowerCase() as keyof typeof keys] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() in keys) {
        keys[e.key.toLowerCase() as keyof typeof keys] = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Update vehicle state based on keys
    const updateInterval = setInterval(() => {
      // Acceleration/deceleration
      if (keys.w) {
        setSpeed((prev) => Math.min(prev + ACCELERATION, MAX_SPEED));
      } else if (keys.s) {
        setSpeed((prev) => Math.max(prev - ACCELERATION, -MAX_SPEED / 1.5));
      } else {
        // Natural deceleration
        setSpeed((prev) => {
          if (Math.abs(prev) < DECELERATION) return 0;
          return prev > 0 ? prev - DECELERATION : prev + DECELERATION;
        });
      }

      // Steering
      if (keys.a) {
        setSteering((prev) => Math.min(prev + STEERING_SPEED, MAX_STEERING));
      } else if (keys.d) {
        setSteering((prev) => Math.max(prev - STEERING_SPEED, -MAX_STEERING));
      } else {
        // Return steering to center
        setSteering((prev) => {
          if (Math.abs(prev) < STEERING_RESET_SPEED) return 0;
          return prev > 0
            ? prev - STEERING_RESET_SPEED
            : prev + STEERING_RESET_SPEED;
        });
      }

      // Update distance
      if (speed !== 0) {
        setDistance((prev) => prev + Math.abs(speed));
      }

      // Send position to server if in multiplayer
      if (room && vehicleRef.current) {
        const position = vehicleRef.current.position;
        room.send("updatePosition", {
          username,
          x: position.x,
          y: position.y,
          z: position.z,
          rotation: vehicleRef.current.rotation.y,
          speed,
        });
      }
    }, 16);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearInterval(updateInterval);
    };
  }, [speed, room, username]);

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

  // Update vehicle position, rotation, and camera
  useFrame((state, delta) => {
    if (vehicleRef.current) {
      // Calculate vehicle movement direction based on current rotation
      const currentRotation = vehicleRef.current.rotation.y;
      const targetRotation =
        currentRotation + steering * (speed > 0 ? 1 : -1) * delta * 2;

      // Smoothly interpolate rotation
      vehicleRef.current.rotation.y =
        currentRotation + (targetRotation - currentRotation) * 0.1;

      // Move forward based on speed and rotation
      const direction = new Vector3(0, 0, -1).applyAxisAngle(
        new Vector3(0, 1, 0),
        vehicleRef.current.rotation.y
      );
      vehicleRef.current.position.addScaledVector(direction, speed);

      // Rotate wheels
      wheelsRef.current.forEach((wheel, index) => {
        if (wheel) {
          // Rotate wheels for forward/backward movement
          wheel.rotation.x += speed * 0.5;

          // Steer front wheels
          if (index < 2) {
            // Front wheels
            wheel.rotation.z = steering * 0.5; // Apply steering angle
          }
        }
      });

      // Update camera position and rotation
      if (cameraRef.current) {
        // Calculate camera orbit position
        const cameraOrbitAngle = vehicleRef.current.rotation.y + cameraAngle;
        const cameraTargetPosition = new Vector3(
          vehicleRef.current.position.x +
            Math.sin(cameraOrbitAngle) * CAMERA_DISTANCE,
          vehicleRef.current.position.y + cameraHeight,
          vehicleRef.current.position.z +
            Math.cos(cameraOrbitAngle) * CAMERA_DISTANCE
        );

        // Smoothly interpolate camera position
        cameraRef.current.position.lerp(cameraTargetPosition, 0.1);

        // Make camera look at vehicle
        cameraRef.current.lookAt(
          vehicleRef.current.position.x,
          vehicleRef.current.position.y + 1,
          vehicleRef.current.position.z
        );
      }
    }
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 5, 10]}
        fov={60}
      />

      <group ref={vehicleRef} position={[0, 1.1, 0]}>
        {/* Car body */}
        <mesh castShadow position={[0, 0.4, 0]}>
          <boxGeometry args={[2, 0.5, 4]} />
          <meshStandardMaterial color="red" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Hood */}
        <mesh castShadow position={[0, 0.5, 1.2]}>
          <boxGeometry args={[1.9, 0.3, 1.5]} />
          <meshStandardMaterial color="red" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Cabin */}
        <mesh castShadow position={[0, 0.9, -0.2]}>
          <boxGeometry args={[1.8, 0.7, 2]} />
          <meshStandardMaterial color="red" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Trunk */}
        <mesh castShadow position={[0, 0.5, -1.5]}>
          <boxGeometry args={[1.9, 0.3, 1]} />
          <meshStandardMaterial color="red" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Windows */}
        <mesh position={[0, 1, 0.8]}>
          <boxGeometry args={[1.7, 0.6, 0.1]} />
          <meshStandardMaterial color="#4444ff" transparent opacity={0.7} />
        </mesh>
        <mesh position={[0, 1, -1.2]}>
          <boxGeometry args={[1.7, 0.6, 0.1]} />
          <meshStandardMaterial color="#4444ff" transparent opacity={0.7} />
        </mesh>
        <mesh position={[0.9, 1, -0.2]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[1.9, 0.6, 0.1]} />
          <meshStandardMaterial color="#4444ff" transparent opacity={0.7} />
        </mesh>
        <mesh position={[-0.9, 1, -0.2]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[1.9, 0.6, 0.1]} />
          <meshStandardMaterial color="#4444ff" transparent opacity={0.7} />
        </mesh>

        {/* Wheels with refs for rotation and steering */}
        <group
          ref={(el) => (wheelsRef.current[0] = el!)}
          position={[-1.1, -0.3, 1.2]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <mesh castShadow>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
            <meshStandardMaterial
              color="#111"
              metalness={0.8}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[0, 0, 0.15]}>
            <cylinderGeometry args={[0.25, 0.25, 0.01, 16]} />
            <meshStandardMaterial color="#666" metalness={1} roughness={0.2} />
          </mesh>
        </group>

        <group
          ref={(el) => (wheelsRef.current[1] = el!)}
          position={[1.1, -0.3, 1.2]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <mesh castShadow>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
            <meshStandardMaterial
              color="#111"
              metalness={0.8}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[0, 0, 0.15]}>
            <cylinderGeometry args={[0.25, 0.25, 0.01, 16]} />
            <meshStandardMaterial color="#666" metalness={1} roughness={0.2} />
          </mesh>
        </group>

        <group
          ref={(el) => (wheelsRef.current[2] = el!)}
          position={[-1.1, -0.3, -1.2]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <mesh castShadow>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
            <meshStandardMaterial
              color="#111"
              metalness={0.8}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[0, 0, 0.15]}>
            <cylinderGeometry args={[0.25, 0.25, 0.01, 16]} />
            <meshStandardMaterial color="#666" metalness={1} roughness={0.2} />
          </mesh>
        </group>

        <group
          ref={(el) => (wheelsRef.current[3] = el!)}
          position={[1.1, -0.3, -1.2]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <mesh castShadow>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
            <meshStandardMaterial
              color="#111"
              metalness={0.8}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[0, 0, 0.15]}>
            <cylinderGeometry args={[0.25, 0.25, 0.01, 16]} />
            <meshStandardMaterial color="#666" metalness={1} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* HUD using Html component from drei */}
      <Html fullscreen>
        <div className="vehicle-hud">
          <div className="speed-meter">
            <span>Speed: {Math.abs(speed * 100).toFixed(0)} km/h</span>
          </div>
          <div className="distance-meter">
            <span>Distance: {(distance * 10).toFixed(1)} m</span>
          </div>
          <div className="controls-info">
            <span>W/S: Accelerate/Brake | A/D: Steer | Mouse Drag: Camera</span>
          </div>
        </div>
      </Html>
    </>
  );
}
