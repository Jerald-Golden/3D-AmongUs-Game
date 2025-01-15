import { Canvas } from '@react-three/fiber';
import { Loader, PointerLockControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';

import Floor from '../environment/floor';
import BaseBox from './box';
import Player from '../player/player';
import { useEffect, useState } from 'react';
import Environments from '../environment/environment';

const Game = () => {
  const [debug, setDebug] = useState(true);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "`") {
        setDebug((prevDebug) => !prevDebug);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div>
      <Canvas style={{ width: "100vw", height: "100vh" }} shadows camera={{ fov: 50 }}>
        <Environments />

        <Physics gravity={[0, -9.8, 0]} debug={debug} >
          <BaseBox position={[5, 1, 0]} args={[1.5, 2, 1.3]} color="orange" />
          <Player position={[0, 2, 0]} rotation={[0, -Math.PI / 2, 0]}/>

          <Floor />
        </Physics>

        <PointerLockControls maxPolarAngle={Math.PI - 1} minPolarAngle={(Math.PI / 2.1)} />
      </Canvas>
      <Loader />
    </div>
  );
};

export default Game;
