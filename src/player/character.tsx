import * as THREE from 'three';
import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

import Model from "../assets/glts/working_single_crew.glb";

const CharacterModel: React.FC<{ visibility: boolean }> = (props) => {
    const groupRef = useRef<THREE.Group>(null);

    const { scene: originalScene }: any = useGLTF(Model);
    const clonedScene = React.useMemo(() => originalScene.clone(), [originalScene]);

    return (
        <>
            {clonedScene && (
                <group position={[0, -1.2, 0]} visible={props.visibility} scale={[0.5, 0.5, 0.5]} rotation={[0, -Math.PI, 0]} ref={groupRef}>
                    <primitive object={clonedScene} />
                </group>
            )}
        </>
    );
};

export default CharacterModel;