import React, { useEffect, useState } from "react";
import { useRoom } from "../multiplayer/roomContext";

import Model from "../assets/glts/working_single_crew.glb";
import { useGLTF } from "@react-three/drei";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";

interface Player {
    id: string;
    position: [number, number, number];
    rotation: [number, number, number];
}

const MultiPlayers: React.FC = () => {
    const { scene }: any = useGLTF(Model);
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
        console.log("players: ", players);
    }, [players]);

    return (
        <>
            {scene && players.map((player, index) => (
                <RigidBody key={index} includeInvisible lockRotations colliders={false} position={[...player.position]} mass={1} type="dynamic" rotation={[...player.rotation]}>
                    <CapsuleCollider args={[0.45, 0.75]} >
                        <group position={[0, -1.2, 0]} scale={[0.5, 0.5, 0.5]} rotation={[0, -Math.PI, 0]} >
                            <primitive object={scene} />
                        </group>
                    </CapsuleCollider>
                </RigidBody>
            ))}
        </>
    );
};

export default MultiPlayers;
