import * as THREE from 'three';
import React, { useRef, useState, useEffect } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

import Model from "../assets/glts/working_single_crew.glb";
import { usePlayerControls } from '../utils/helpers';

import { useStamina } from '../store/store';

const CharacterModel: React.FC<{ visibility: boolean }> = (props) => {
    const groupRef = useRef<THREE.Group>(null);

    const { scene, animations }: any = useGLTF(Model);
    const { actions } = useAnimations(animations, groupRef);
    const { forward, backward, left, right, sprint } = usePlayerControls();

    const isMoving = useRef(false);
    const { stamina, setStamina } = useStamina();
    const [isSprinting, setIsSprinting] = useState(false);

    useEffect(() => {
        let staminaInterval: NodeJS.Timeout;

        if (isSprinting) {
            staminaInterval = setInterval(() => {
                setStamina(Math.max(stamina - 10, 0));
            }, 1000);
        } else if ((stamina < 100)) {
            staminaInterval = setInterval(() => {
                setStamina(Math.min(stamina + 15, 100));
            }, 500);
        }

        return () => clearInterval(staminaInterval);
        // eslint-disable-next-line
    }, [isSprinting, sprint, stamina]);

    useFrame(() => {
        const group = groupRef.current;
        if (!group) return;

        if (actions) {
            const action = actions[`Armature|Ref|Ref`];
            if (action) {
                const moveForward = forward && !backward;
                const moveBackward = backward && !forward;
                const moveLeft = left && !right;
                const moveRight = right && !left;

                const isKeyActive = moveForward || moveBackward || moveLeft || moveRight;
                const canSprint = isKeyActive && sprint && stamina > 0;
                setIsSprinting(canSprint);

                if (isKeyActive && !isMoving.current) {
                    action.reset().fadeIn(0.2).play();
                    isMoving.current = true;
                } else if (!isKeyActive && isMoving.current) {
                    action.fadeOut(0.2);
                    isMoving.current = false;
                }
                if (isKeyActive) {
                    action.timeScale = canSprint ? 2 : 1;
                }
            }
        }
    });

    return (
        <>
            {scene && (
                <group position={[0, -1.2, 0]} visible={props.visibility} scale={[0.5, 0.5, 0.5]} rotation={[0, -Math.PI, 0]} ref={groupRef}>
                    <primitive object={scene} />
                </group>
            )}
        </>
    );
};

export default CharacterModel;