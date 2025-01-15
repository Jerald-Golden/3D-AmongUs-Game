import { Canvas } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';

import Player from '../player/player';
import { Suspense, useEffect, useState } from 'react';
import Environments from '../environment/environment';
import Map from './map/map';

const Game = () => {
  const [debug, setDebug] = useState(false);

  const playerSpawnPoints: [[number, number, number], [number, number, number]][] = [
    [[93.7, 4, -81], [0, -Math.PI, 0]]
  ];

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
    <Suspense fallback={null} >
      <Canvas style={{ width: "100vw", height: "100vh" }} shadows camera={{ fov: 50 }}>
        <Environments />

        <Physics gravity={[0, -9.8, 0]} debug={debug} >
          <Player position={playerSpawnPoints[0][0]} rotation={playerSpawnPoints[0][1]} canJump={false} />
          <Map />
        </Physics>

        <PointerLockControls maxPolarAngle={Math.PI - 1} minPolarAngle={(Math.PI / 2.1)} />
      </Canvas>
    </Suspense>
  );
};

export default Game;
