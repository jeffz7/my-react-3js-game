// src/components/OnlineUsers.tsx
import { useContext } from "react";
import { MultiplayerContext } from "../contexts/MultiplayerContext";
import { UserContext } from "../contexts/UserContext";

export default function OnlineUsers() {
  const mpContext = useContext(MultiplayerContext);
  const userContext = useContext(UserContext);

  if (!mpContext) return null;

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
      🟢 Live Users: {userContext.onlineUsers}
    </div>
  );
}
