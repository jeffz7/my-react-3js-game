import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MultiplayerProvider } from "./contexts/MultiplayerContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <MultiplayerProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </MultiplayerProvider>
);

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <MultiplayerProvider>
//     <App />
//   </MultiplayerProvider>
// );
