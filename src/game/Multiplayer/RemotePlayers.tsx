import { useRef, useEffect } from "react";
import { Group } from "three";
import Jeep from "../../components/vehicles/Jeep";
import Beetle from "../../components/vehicles/Beetle";

interface RemotePlayer {
  username: string;
  x: number;
  y: number;
  z: number;
  rotation: number;
  speed: number;
  steering: number;
  lastUpdate: number;
}

interface RemotePlayersProps {
  players: Map<string, RemotePlayer>;
}

export default function RemotePlayers({ players }: RemotePlayersProps) {
  return (
    <>
      {Array.from(players.entries()).map(([username, player]) => (
        <RemoteVehicle key={username} player={player} />
      ))}
    </>
  );
}

interface RemoteVehicleProps {
  player: RemotePlayer;
}

function RemoteVehicle({ player }: RemoteVehicleProps) {
  const vehicleRef = useRef<Group>(null);

  // Update position and rotation based on server data
  useEffect(() => {
    if (vehicleRef.current) {
      vehicleRef.current.position.set(player.x, player.y, player.z);
      vehicleRef.current.rotation.y = player.rotation;
    }
  }, [player]);

  return (
    <group ref={vehicleRef}>
      <Beetle /> {/* Different color for other players */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </group>
  );
}
