import React, { useState } from "react";
import Game from "./game/game";
import Preloader from "./loadingScreen/preLoader";
import { RoomProvider } from "./multiplayer/roomContext";
import UI from "./ui/ui";
import StartingPage from "./ui/game/startPage";

const App: React.FC = () => {
  const [name, setName] = useState<string | null>(null);

  const handleEnterGame = (name: string) => {
    setName(name);
  };

  return (
    <>
      {name ? (
        <RoomProvider>
          <Preloader />
          <UI />
          <Game />
        </RoomProvider>
      ) : (
        <StartingPage onEnterGame={handleEnterGame} />
      )}
    </>
  );
};

export default App;
