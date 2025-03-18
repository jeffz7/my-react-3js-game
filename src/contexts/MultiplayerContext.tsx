// src/contexts/MultiplayerContext.tsx
import { createContext, useEffect, useState, ReactNode, useRef } from "react";
import { Client, Room } from "colyseus.js";

interface MultiplayerContextType {
  room: Room | null;
  onlineCount: number;
}

const MultiplayerContext = createContext<MultiplayerContextType>({
  room: null,
  onlineCount: 0,
});

function MultiplayerProvider({ children }: { children: ReactNode }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const initializedRef = useRef(false);

  useEffect(() => {
    console.log(">>> initIAL LOAD");

    if (initializedRef.current) return; // 👈 Prevent double initialization

    console.log(">>> initializedRef.current", initializedRef.current);

    initializedRef.current = true;
    const client = new Client("ws://localhost:2567");

    client.joinOrCreate("my_game_room").then((joinedRoom) => {
      setRoom(joinedRoom);
      console.log(
        ">>> initializedRef.current AFTER JOIN",
        initializedRef.current
      );
      joinedRoom.onMessage("onlineCount", (data: { count: number }) => {
        setOnlineCount(data.count);
      });

      joinedRoom.onLeave(() => {
        console.log(">>> BYE BYE");

        setRoom(null);
      });
    });

    return () => {
      room?.leave();
      initializedRef.current = false;
    };
  }, []);

  return (
    <MultiplayerContext.Provider value={{ room, onlineCount }}>
      {children}
    </MultiplayerContext.Provider>
  );
}

export { MultiplayerContext, MultiplayerProvider };
