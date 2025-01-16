import React, { useEffect, useMemo, useState } from 'react';
import { useGLTF } from '@react-three/drei';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import ModelUrl from "../assets/glts/working_single_crew.glb";

const CharacterModel: React.FC<{ visibility: boolean }> = (props) => {

    const { scene: originalScene }: any = useGLTF(ModelUrl);
    const clonedScene = React.useMemo(() => originalScene.clone(), [originalScene]);

    return (
        <>
            {clonedScene && (
                <Model visibility={props.visibility} />
            )}
        </>
    );
};

export default CharacterModel;

const Model: React.FC<{ visibility: boolean }> = (props) => {
    const [model, setModel] = useState<any>(null);

    const loader = useMemo(() => new GLTFLoader(), []);

    useEffect(() => {
        let isMounted = true;

        loader.load(
            ModelUrl,
            (gltf) => {
                console.log('gltf: ', gltf);
                if (isMounted) {
                    setModel(gltf.scene);
                }
            },
            undefined,
            (error) => {
                console.error("Error loading model:", error);
            }
        );

        return () => {
            isMounted = false;
        };
    }, [loader]);

    if (!model) return null;

    return (
        <group visible={props.visibility} position={[0, -1.2, 0]} scale={[0.5, 0.5, 0.5]} rotation={[0, -Math.PI, 0]}>
            <primitive object={model} />
        </group>
    );
};