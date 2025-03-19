import { useState, useEffect, useRef } from "react";
import { Group, Vector3, Mesh, BoxGeometry, MeshStandardMaterial } from "three";
import { useThree } from "@react-three/fiber";

interface Checkpoint {
  id: number;
  position: Vector3;
  reached: boolean;
  mesh?: Mesh;
}

interface UseCheckpointsProps {
  vehicleRef: React.RefObject<Group | null>;
  onCheckpointReached?: (id: number) => void;
  onAllCheckpointsReached?: () => void;
}

export default function useCheckpoints({
  vehicleRef,
  onCheckpointReached,
  onAllCheckpointsReached,
}: UseCheckpointsProps) {
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [currentCheckpoint, setCurrentCheckpoint] = useState(0);
  const [lapTime, setLapTime] = useState(0);
  const [bestLapTime, setBestLapTime] = useState<number | null>(null);
  const [isRacing, setIsRacing] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const { scene } = useThree();
  const checkpointsRef = useRef<Checkpoint[]>([]);

  // Initialize checkpoints
  useEffect(() => {
    // Define checkpoint positions (can be customized based on your terrain)
    const checkpointPositions = [
      new Vector3(0, 1, 20),
      new Vector3(20, 1, 20),
      new Vector3(20, 1, -20),
      new Vector3(-20, 1, -20),
      new Vector3(-20, 1, 0),
      new Vector3(0, 1, 0), // Finish line (same as start)
    ];

    // Create checkpoint objects
    const newCheckpoints = checkpointPositions.map((position, id) => ({
      id,
      position,
      reached: false,
      mesh: undefined as unknown as Mesh, // Initialize with undefined but tell TypeScript it will be a Mesh
    }));

    // Store in ref for direct access
    checkpointsRef.current = newCheckpoints;
    setCheckpoints(newCheckpoints);

    // Create visual representations of checkpoints
    newCheckpoints.forEach((checkpoint) => {
      const geometry = new BoxGeometry(4, 8, 0.5);
      const material = new MeshStandardMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.5,
      });

      const mesh = new Mesh(geometry, material);
      mesh.position.copy(checkpoint.position);
      mesh.position.y += 4; // Raise it above ground
      scene.add(mesh);

      // Store mesh reference
      checkpoint.mesh = mesh;
    });

    return () => {
      // Clean up meshes when component unmounts
      newCheckpoints.forEach((checkpoint) => {
        if (checkpoint.mesh) {
          scene.remove(checkpoint.mesh);
        }
      });
    };
  }, [scene]);

  // Check for checkpoint collisions
  useEffect(() => {
    if (!vehicleRef.current || checkpoints.length === 0) return;

    const checkCollisions = () => {
      if (!vehicleRef.current) return;

      const vehiclePosition = vehicleRef.current.position;
      const nextCheckpoint = checkpoints[currentCheckpoint];

      if (!nextCheckpoint) return;

      // Check distance to next checkpoint
      const distance = vehiclePosition.distanceTo(nextCheckpoint.position);

      // If vehicle is close enough to checkpoint
      if (distance < 5) {
        // Mark checkpoint as reached
        setCheckpoints((prev) =>
          prev.map((cp) =>
            cp.id === nextCheckpoint.id ? { ...cp, reached: true } : cp
          )
        );

        // Update checkpoint mesh color
        if (nextCheckpoint.mesh) {
          (nextCheckpoint.mesh.material as MeshStandardMaterial).color.set(
            0xff0000
          );
        }

        // Call callback
        onCheckpointReached?.(nextCheckpoint.id);

        // Start timer on first checkpoint
        if (currentCheckpoint === 0 && !startTimeRef.current) {
          startTimeRef.current = Date.now();
          setIsRacing(true);
        }

        // Check if this is the finish line (last checkpoint)
        if (currentCheckpoint === checkpoints.length - 1) {
          // Calculate lap time
          if (startTimeRef.current) {
            const endTime = Date.now();
            const lapTimeMs = endTime - startTimeRef.current;
            setLapTime(lapTimeMs);

            // Update best lap time
            if (!bestLapTime || lapTimeMs < bestLapTime) {
              setBestLapTime(lapTimeMs);
            }
          }

          // Reset for next lap
          setCheckpoints((prev) =>
            prev.map((cp) => ({ ...cp, reached: false }))
          );

          // Reset checkpoint colors
          checkpoints.forEach((cp) => {
            if (cp.mesh) {
              (cp.mesh.material as MeshStandardMaterial).color.set(0x00ff00);
            }
          });

          setCurrentCheckpoint(0);
          startTimeRef.current = null;
          setIsRacing(false);

          // Call callback
          onAllCheckpointsReached?.();
        } else {
          // Move to next checkpoint
          setCurrentCheckpoint((prev) => prev + 1);
        }
      }
    };

    const intervalId = setInterval(checkCollisions, 100);

    return () => clearInterval(intervalId);
  }, [
    vehicleRef,
    checkpoints,
    currentCheckpoint,
    onCheckpointReached,
    onAllCheckpointsReached,
    bestLapTime,
  ]);

  // Update lap timer
  useEffect(() => {
    if (!isRacing) return;

    const updateTimer = () => {
      if (startTimeRef.current) {
        const currentTime = Date.now();
        setLapTime(currentTime - startTimeRef.current);
      }
    };

    const intervalId = setInterval(updateTimer, 100);

    return () => clearInterval(intervalId);
  }, [isRacing]);

  return {
    checkpoints,
    currentCheckpoint,
    lapTime,
    bestLapTime,
    isRacing,
  };
}
