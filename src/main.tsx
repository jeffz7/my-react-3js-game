import ReactDOM from "react-dom/client";
import App from "./App";
import { MultiplayerProvider } from "./contexts/MultiplayerContext";
import { UserProvider } from "./contexts/UserContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <MultiplayerProvider>
      <App />
    </MultiplayerProvider>
  </UserProvider>
);
