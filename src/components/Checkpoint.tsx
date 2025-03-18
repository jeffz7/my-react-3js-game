// src/components/Checkpoint.tsx
export default function Checkpoint({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[0.3, 0.3, 50, 32]} />
      <meshBasicMaterial color="cyan" transparent opacity={0.6} />
    </mesh>
  );
}
