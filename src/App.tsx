// src/App.tsx
import CanvasScene from "./components/CanvasScene";
import OnlineUsers from "./components/OnlineUsers";
import { MultiplayerProvider } from "./contexts/MultiplayerContext";

function App() {
  return (
    <MultiplayerProvider>
      <div style={{ width: "100vw", height: "100vh" }}>
        <CanvasScene />
        <OnlineUsers />
      </div>
    </MultiplayerProvider>
  );
}

export default App;
