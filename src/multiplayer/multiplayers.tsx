import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRoom } from "../multiplayer/roomContext";

import ModelUrl from "../assets/glts/final.glb";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useAnimations, useGLTF } from "@react-three/drei";

import { SkeletonUtils } from 'three-stdlib'
import { useGraph } from '@react-three/fiber';

interface Player {
    id: string;
    position: [number, number, number];
    rotation: [number, number, number];
    state: string;
}

const MultiPlayers: React.FC = () => {
    const { room } = useRoom();
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        if (!room) return;

        // Handle player addition
        const onAddPlayer = (player: any, key: string) => {
            if (key === room.sessionId) return;
            setPlayers((prev) => [
                ...prev,
                {
                    id: key,
                    position: [player.position.x, player.position.y, player.position.z],
                    rotation: [player.rotation.x, player.rotation.y, player.rotation.z],
                    state: "idle"
                },
            ]);
        };

        // Handle player removal
        const onRemovePlayer = (_player: any, key: string) => {
            setPlayers((prev) => prev.filter((p) => p.id !== key));
        };

        // Handle player movement
        const onPlayerMove = (e: any) => {
            const { id, position, rotation, state } = e;
            setPlayers((prev) =>
                prev.map((player) =>
                    player.id === id
                        ? { ...player, position: [position.x, position.y, position.z], rotation: [rotation.x, rotation.y, rotation.z], state: state }
                        : player
                )
            );
        };

        // Handle kick notification
        const onKick = (code: number) => {
            console.log("Disconnected from the room:", code);
            if (code === 1005) {
                alert("You have been removed from the game.");
                room.leave();
            }
        }

        room.state.players.onAdd(onAddPlayer);
        room.state.players.onRemove(onRemovePlayer);
        (room as any).onMessage("playerMoved", onPlayerMove);
        (room as any).onLeave(onKick)

        return () => {
            room.state.players.off("add", onAddPlayer);
            room.state.players.off("remove", onRemovePlayer);
            (room as any).offMessage("playerMoved", onPlayerMove);
            (room as any).offMessage("kick", onKick);
        };
    }, [room]);

    return (
        <>
            {players.map((player) => (
                <RigidBody key={player.id} includeInvisible lockRotations colliders={false} position={[...player.position]} mass={1} type="dynamic" rotation={[...player.rotation]}>
                    <CapsuleCollider args={[0.45, 0.75]} >
                        <Model key={player.id} state={player.state} />
                    </CapsuleCollider>
                </RigidBody>
            ))}
        </>
    );
};

export default MultiPlayers;


export function Model(props: any) {
    const group = useRef<any>();
    const { scene, animations, materials }: any = useGLTF(ModelUrl);
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes }: any = useGraph(clone);
    const { actions } = useAnimations(animations, group);

    useEffect(() => {
        if (actions) {
            const actionKeys = Object.keys(actions);
            if (actionKeys.length > 0) {
                actions["idle"]?.reset().play();

                const fadeDuration = 0.2;

                if (props.state === "idle") {
                    actions["idle"]?.reset().fadeIn(fadeDuration).play();
                    actions["walk"]?.fadeOut(fadeDuration);
                    actions["run"]?.fadeOut(fadeDuration);
                } else if (props.state === "walk") {
                    actions["walk"]?.reset().fadeIn(fadeDuration).play();
                    actions["idle"]?.fadeOut(fadeDuration);
                    actions["run"]?.fadeOut(fadeDuration);
                } else if (props.state === "run") {
                    actions["run"]?.reset().fadeIn(fadeDuration).play();
                    actions["idle"]?.fadeOut(fadeDuration);
                    actions["walk"]?.fadeOut(fadeDuration);
                }
            }
        }
    }, [actions, props.state]);

    return (
        <group layers={1} position={[0, -1.2, 0]} scale={[2.2, 2.2, 2.2]} rotation={[0, -Math.PI, 0]} ref={group} {...props} dispose={null}>
            <group layers={1} name="Scene">
                <group layers={1} name="Armature" rotation={[Math.PI / 2, 0, 0]}>
                    <group layers={1} name="Astronaut">
                        <skinnedMesh
                            layers={1}
                            name="Astronautmesh"
                            geometry={nodes.Astronautmesh.geometry}
                            material={materials.SecondaryMaterial}
                            skeleton={nodes.Astronautmesh.skeleton}
                        />
                        <skinnedMesh
                            layers={1}
                            name="Astronautmesh_1"
                            geometry={nodes.Astronautmesh_1.geometry}
                            material={materials.BaseMaterial}
                            skeleton={nodes.Astronautmesh_1.skeleton}
                        />
                        <skinnedMesh
                            layers={1}
                            name="Astronautmesh_2"
                            geometry={nodes.Astronautmesh_2.geometry}
                            material={materials.BeltMaterial}
                            skeleton={nodes.Astronautmesh_2.skeleton}
                        />
                    </group>
                    <primitive object={nodes.mixamorigHips} />
                </group>
            </group>
        </group>
    );
};