import { Canvas } from '@react-three/fiber';
import { Loader, PointerLockControls, Sky } from '@react-three/drei';
import { Physics } from '@react-three/rapier';

import Lights from '../environment/lights';
import Floor from '../environment/floor';
import BaseBox from './box';
import Player from '../player/player';

const Game = () => {
  return (
    <div>
      <Canvas style={{ width: "100vw", height: "100vh" }} shadows camera={{ fov: 50 }}>
        <Lights />
        <Sky />

        <Physics gravity={[0, -9.8, 0]} debug={true} >
          <BaseBox position={[5, 1, 0]} args={[1.5, 2, 1.3]} color="orange" />
          <Player position={[0, 2, 0]} rotation={[0, -Math.PI / 2, 0]} args={[0.5]} />

          <Floor />
        </Physics>

        <PointerLockControls />
      </Canvas>
      <Loader />
    </div>
  );
};

export default Game;
