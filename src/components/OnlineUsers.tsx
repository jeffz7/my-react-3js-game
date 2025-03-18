// src/components/OnlineUsers.tsx
import { useContext } from "react";
import { MultiplayerContext } from "../contexts/MultiplayerContext";

export default function OnlineUsers() {
  const context = useContext(MultiplayerContext);
  if (!context) return null;

  const { onlineCount } = context;
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        padding: "10px 15px",
        background: "rgba(0, 0, 0, 0.6)",
        color: "#fff",
        borderRadius: "8px",
        zIndex: 100,
      }}
    >
      🟢 Live Users: {onlineCount}
    </div>
  );
}
