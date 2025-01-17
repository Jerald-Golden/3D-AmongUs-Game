import React, { useEffect, useMemo, useState } from "react";
import { useRoom } from "../multiplayer/roomContext";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import ModelUrl from "../assets/glts/working_single_crew.glb";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";

interface Player {
    id: string;
    position: [number, number, number];
    rotation: [number, number, number];
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
                },
            ]);
        };

        // Handle player removal
        const onRemovePlayer = (_player: any, key: string) => {
            setPlayers((prev) => prev.filter((p) => p.id !== key));
        };

        // Handle player movement
        const onPlayerMove = (e: any) => {
            const { id, position, rotation } = e;
            setPlayers((prev) =>
                prev.map((player) =>
                    player.id === id
                        ? { ...player, position: [position.x, position.y, position.z], rotation: [rotation.x, rotation.y, rotation.z] }
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

    useEffect(() => {
        // console.log("players: ", players);
    }, [players]);

    return (
        <>
            {players.map((player, index) => (
                <RigidBody key={player.id} includeInvisible lockRotations colliders={false} position={[...player.position]} mass={1} type="dynamic" rotation={[...player.rotation]}>
                    <CapsuleCollider args={[0.45, 0.75]} >
                        <Model key={player.id} />
                    </CapsuleCollider>
                </RigidBody>
            ))}
        </>
    );
};

export default MultiPlayers;



const Model: React.FC = () => {
    const [model, setModel] = useState<any>(null);

    const loader = useMemo(() => new GLTFLoader(), []);

    useEffect(() => {
        let isMounted = true;

        loader.load(
            ModelUrl,
            (gltf) => {
                gltf.scene.traverse((child: any) => {
                    if (child.isObject3D) {
                        child.layers.set(1);
                    }
                });
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
        <group layers={1} position={[0, -1.2, 0]} scale={[0.5, 0.5, 0.5]} rotation={[0, -Math.PI, 0]}>
            <primitive object={model} />
        </group>
    );
};