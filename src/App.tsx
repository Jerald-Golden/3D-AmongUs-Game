import React, { useState } from "react";
import Game from "./game/game";
import Preloader from "./loadingScreen/preLoader";
import { RoomProvider } from "./multiplayer/roomContext";
import UI from "./ui/ui";
import StartingPage from "./ui/game/startPage";
import { useRoomData } from "./store/store";
import { LobbyProvider } from "./multiplayer/lobbyContext";

const App: React.FC = () => {
  const [name, setName] = useState<string | null>(null);
  const { roomData, setRoomData } = useRoomData();

  type Room = {
    roomName: string;
    roomId: string | undefined;
  };

  const handleEnterGame = (name: string, room: Room) => {
    setName(name);
    setRoomData(room.roomName, room.roomId);
  };

  return (
    <>
      {name && roomData ? (
        <RoomProvider>
          <Preloader />
          <UI />
          <Game />
        </RoomProvider>
      ) : (
        <LobbyProvider>
          <StartingPage onEnterGame={handleEnterGame} />
        </LobbyProvider>
      )}
    </>
  );
};

export default App;
