import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { usePlayerControls } from '../utils/helpers';
import * as THREE from 'three';

interface PlayerProps {
  position: [number, number, number];
  rotation: [number, number, number];
  args: [number, number, number] | [number];
}

const Player: React.FC<PlayerProps> = (props) => {
  const direction = new THREE.Vector3();
  const frontVector = new THREE.Vector3();
  const sideVector = new THREE.Vector3();
  const SPEED = 5;

  const { camera } = useThree();
  const rigidBodyRef = useRef<RapierRigidBody>(null);

  const { forward, backward, left, right, jump } = usePlayerControls();

  const initialRotation = new THREE.Euler(...props.rotation);

  useEffect(() => {
    camera.rotation.set(initialRotation.x, initialRotation.y, initialRotation.z);
  }, []);

  useFrame(() => {
    const rigidBody = rigidBodyRef.current;
    if (!rigidBody) return;

    const position = rigidBody.translation();
    camera.position.copy(position);

    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(camera.rotation);

    const velocity = rigidBody.linvel();

    rigidBody.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true);

    if (jump && Math.abs(velocity.y) < 0.05) {
      rigidBody.setLinvel({ x: velocity.x, y: 5, z: velocity.z }, true);
    }
  });

  return (
    <group>
      <RigidBody ref={rigidBodyRef} colliders="ball" position={props.position} mass={1} type="dynamic" rotation={[initialRotation.x, initialRotation.y, initialRotation.z]}>
        <mesh castShadow>
          <sphereGeometry args={props.args} />
          <meshStandardMaterial color="#FFFF00" />
        </mesh>
      </RigidBody>
    </group>
  );
};

export default Player;
