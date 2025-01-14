import { RigidBody } from '@react-three/rapier';

interface BaseBoxProps {
  position: [number, number, number];
  args: [number, number, number];
  color: string;
}

const BaseBox: React.FC<BaseBoxProps> = ({ position, args, color }) => {
  return (
    <RigidBody position={position}>
      <mesh>
        <boxGeometry args={args} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );
};

export default BaseBox;
