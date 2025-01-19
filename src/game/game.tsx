import { Canvas } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';

import Player from '../player/player';
import { Suspense, useEffect, useState } from 'react';
import Environments from '../environment/environment';
import Map from './map/map';
import MultiPlayers from '../multiplayer/multiplayers';
import Minimap from './map/minimap';

const Game = () => {
  const [debug, setDebug] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

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

  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  return (
    <>
      <Suspense fallback={null} >
        <Canvas gl={{ powerPreference: "high-performance" }} style={{ width: "100vw", height: "100vh" }} shadows camera={{ fov: 50 }}>
          <Environments />

          <Physics gravity={[0, -9.8, 0]} debug={debug} >
            <Suspense>
              <Map onLoad={handleMapLoad} />
            </Suspense>
            {mapLoaded && (
              <>
                <Player position={playerSpawnPoints[0][0]} rotation={playerSpawnPoints[0][1]} canJump={false} />
                <MultiPlayers />
              </>
            )}
          </Physics>

          <PointerLockControls maxPolarAngle={Math.PI - 1} minPolarAngle={(Math.PI / 2.1)} />
          <Minimap />
        </Canvas>
      </Suspense>
    </>
  );
};

export default Game;
