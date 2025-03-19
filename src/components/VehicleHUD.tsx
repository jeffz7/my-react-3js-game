import { useState, useEffect } from "react";

interface VehicleHUDProps {
  speed?: number;
  distance?: number;
}

export default function VehicleHUD({
  speed = 0,
  distance = 0,
}: VehicleHUDProps) {
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [currentDistance, setCurrentDistance] = useState(0);

  // Update speed and distance using useEffect instead of useFrame
  useEffect(() => {
    setCurrentSpeed(Math.abs(speed));
    setCurrentDistance(distance);
  }, [speed, distance]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        padding: "15px",
        background: "rgba(0, 0, 0, 0.7)",
        color: "white",
        borderRadius: "10px",
        fontFamily: "Arial, sans-serif",
        zIndex: 100,
      }}
    >
      <div style={{ fontSize: "24px", marginBottom: "5px" }}>
        {Math.floor(currentSpeed * 3.6)} km/h
      </div>
      <div style={{ fontSize: "14px", opacity: 0.8 }}>
        Distance: {currentDistance.toFixed(1)} m
      </div>
    </div>
  );
}
