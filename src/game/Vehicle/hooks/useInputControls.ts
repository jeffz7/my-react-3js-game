import { useState, useEffect } from "react";

interface InputControls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  brake: boolean;
}

export default function useInputControls() {
  const [controls, setControls] = useState<InputControls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w":
          setControls((prev) => ({ ...prev, forward: true }));
          break;
        case "s":
          setControls((prev) => ({ ...prev, backward: true }));
          break;
        case "a":
          setControls((prev) => ({ ...prev, left: true }));
          break;
        case "d":
          setControls((prev) => ({ ...prev, right: true }));
          break;
        case " ":
          setControls((prev) => ({ ...prev, brake: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w":
          setControls((prev) => ({ ...prev, forward: false }));
          break;
        case "s":
          setControls((prev) => ({ ...prev, backward: false }));
          break;
        case "a":
          setControls((prev) => ({ ...prev, left: false }));
          break;
        case "d":
          setControls((prev) => ({ ...prev, right: false }));
          break;
        case " ":
          setControls((prev) => ({ ...prev, brake: false }));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return controls;
}
