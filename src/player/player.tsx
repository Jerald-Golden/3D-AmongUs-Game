import * as THREE from 'three';
import { useRef, useEffect, useState } from 'react';
import { RigidBody, RapierRigidBody, CapsuleCollider } from '@react-three/rapier';
import { useFrame, useThree } from '@react-three/fiber';
import { usePlayerControls } from '../utils/helpers';
import CharacterModel from './character';

interface PlayerProps {
  position: [number, number, number];
  rotation: [number, number, number];
  canJump: boolean
}

const Player: React.FC<PlayerProps> = (props) => {
  const direction = new THREE.Vector3();
  const frontVector = new THREE.Vector3();
  const sideVector = new THREE.Vector3();
  const targetQuaternion = useRef(new THREE.Quaternion());

  const WALKSPEED = 5;
  const SPRINTSPEED = 10;

  const { camera } = useThree();
  const rigidBodyRef = useRef<RapierRigidBody>(null);

  const { forward, backward, left, right, jump, sprint, cameraToggle } = usePlayerControls();
  const [isThirdPerson, setIsThirdPerson] = useState(false);

  const initialRotation = new THREE.Euler(...props.rotation);

  useEffect(() => {
    camera.rotation.set(initialRotation.x, initialRotation.y, initialRotation.z);
    if (isThirdPerson) {
      const offset = new THREE.Vector3(0, 1, 10);
      const cameraPosition = new THREE.Vector3(...props.position).add(offset.applyQuaternion(camera.quaternion));
      camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    } else {
      const offset = new THREE.Vector3(0, 1, 0);
      const cameraPosition = new THREE.Vector3(...props.position).add(offset.applyQuaternion(camera.quaternion));
      camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setIsThirdPerson(cameraToggle);
  }, [cameraToggle]);

  useFrame(() => {
    const rigidBody = rigidBodyRef.current;
    if (!rigidBody) return;

    const position = rigidBody.translation();

    if (isThirdPerson) {
      const offset = new THREE.Vector3(0, 1, 10);
      const cameraPosition = new THREE.Vector3();
      cameraPosition.copy(position).add(offset.applyQuaternion(camera.quaternion));
      camera.position.lerp(cameraPosition, 0.1);
    } else {
      const offset = new THREE.Vector3(0, 1, 0);
      const cameraPosition = new THREE.Vector3();
      cameraPosition.copy(position).add(offset.applyQuaternion(camera.quaternion));
      camera.position.lerp(cameraPosition, 0.1);
    }

    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(sprint ? SPRINTSPEED : WALKSPEED).applyEuler(camera.rotation);

    const velocity = rigidBody.linvel();

    rigidBody.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true);

    if (props.canJump && jump && Math.abs(velocity.y) < 0.05) {
      rigidBody.setLinvel({ x: velocity.x, y: 5, z: velocity.z }, true);
    }

    const cameraQuaternion = new THREE.Quaternion();
    camera.getWorldQuaternion(cameraQuaternion);
    const cameraEuler = new THREE.Euler().setFromQuaternion(cameraQuaternion, 'YXZ');
    const yawQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, cameraEuler.y, 0));
    targetQuaternion.current.slerp(yawQuaternion, 0.1);
    rigidBody.setRotation({ x: targetQuaternion.current.x, y: targetQuaternion.current.y, z: targetQuaternion.current.z, w: targetQuaternion.current.w, }, true);
  });

  return (
    <RigidBody includeInvisible lockRotations ref={rigidBodyRef} colliders={false} position={props.position} mass={1} type="dynamic" rotation={[initialRotation.x, initialRotation.y, initialRotation.z]}>
      <CapsuleCollider args={[0.45, 0.75]} >
        <CharacterModel visibility={cameraToggle} />
      </CapsuleCollider>
    </RigidBody>
  );
};

export default Player;
