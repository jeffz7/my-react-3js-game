// src/game/Vehicle/hooks/useInputControls.ts

import { useState, useEffect } from "react";

interface InputControls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  brake: boolean;
  zoomIn: boolean;
  zoomOut: boolean;
  zoomDelta: number;
}

export default function useInputControls() {
  const [controls, setControls] = useState<InputControls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
    zoomIn: false,
    zoomOut: false,
    zoomDelta: 0,
  });

  useEffect(() => {
    const keyMap = {
      // WASD controls
      KeyW: "forward",
      KeyS: "backward",
      KeyA: "left",
      KeyD: "right",
      Space: "brake",
      // Arrow key controls
      ArrowUp: "forward",
      ArrowDown: "backward",
      ArrowLeft: "left",
      ArrowRight: "right",
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const control = keyMap[e.code as keyof typeof keyMap];
      if (control) {
        setControls((prev) => ({ ...prev, [control]: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const control = keyMap[e.code as keyof typeof keyMap];
      if (control) {
        setControls((prev) => ({ ...prev, [control]: false }));
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // Prevent default scrolling behavior
      e.preventDefault();

      // Set zoom delta based on wheel direction
      setControls((prev) => ({
        ...prev,
        zoomDelta: e.deltaY,
        zoomIn: e.deltaY < 0,
        zoomOut: e.deltaY > 0,
      }));

      // Reset zoom flags after a short delay
      setTimeout(() => {
        setControls((prev) => ({
          ...prev,
          zoomDelta: 0,
          zoomIn: false,
          zoomOut: false,
        }));
      }, 50);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return controls;
}
