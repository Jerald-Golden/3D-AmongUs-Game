import Game from "./game/game";
import Preloader from "./loadingScreen/preLoader";
import UI from "./ui/ui";

function App() {
  return (
    <>
      <Preloader />
      <UI />
      <Game />
    </>
  );
}

export default App;
