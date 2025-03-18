// src/App.tsx
import { useContext } from "react";
import CanvasScene from "./components/CanvasScene";
import OnlineUsers from "./components/OnlineUsers";
import LoginScreen from "./components/LoginScreen";
import { UserContext } from "./contexts/UserContext";

function App() {
  const { isLoggedIn } = useContext(UserContext);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <CanvasScene />
      <OnlineUsers />
      {!isLoggedIn && <LoginScreen />}
    </div>
  );
}

export default App;
