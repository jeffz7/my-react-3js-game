// src/App.tsx
import { useState } from "react";
import CanvasScene from "./components/CanvasScene";
import VehicleHUD from "./components/VehicleHUD";
import OnlineUsers from "./components/OnlineUsers";
import ControlsHelp from "./components/ControlsHelp";
import LoginScreen from "./components/LoginScreen";
import { useContext } from "react";
import { UserContext, UserProvider } from "./contexts/UserContext";
import { MultiplayerProvider } from "./contexts/MultiplayerContext";
import "./styles/Vehicle.css";
import "./styles/Checkpoints.css";
import "./styles/Multiplayer.css";

// Create an AppContent component that uses the context
function AppContent() {
  const { isLoggedIn } = useContext(UserContext);
  const [vehicleStats, setVehicleStats] = useState({ speed: 0, distance: 0 });

  // This function will be called from the Vehicle component
  const updateVehicleStats = (stats: { speed: number; distance: number }) => {
    setVehicleStats(stats);
  };

  return (
    <MultiplayerProvider>
      <div style={{ width: "100vw", height: "100vh" }}>
        <CanvasScene updateVehicleStats={updateVehicleStats} />
        <VehicleHUD
          speed={vehicleStats.speed}
          distance={vehicleStats.distance}
        />
        <OnlineUsers />
        <ControlsHelp />
        {!isLoggedIn && <LoginScreen />}
      </div>
    </MultiplayerProvider>
  );
}

// Main App component that provides the context
function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
