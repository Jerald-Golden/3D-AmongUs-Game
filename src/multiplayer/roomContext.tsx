import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Client, Room } from "colyseus.js";

interface RoomContextProps {
    room: Room | null;
}

const RoomContext = createContext<RoomContextProps | undefined>(undefined);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [room, setRoom] = useState<Room | null>(null);
    const client = useRef<Client | null>(null);

    useEffect(() => {
        client.current = new Client("https://game-server-v2rf.onrender.com/");

        client.current.joinOrCreate("state_handler", { role: "player" }).then((joinedRoom: any) => {
            setRoom(joinedRoom);

            joinedRoom.state.players.onAdd((player: any, key: any) => {
                // console.log("Player added:", key, player);
            });

            joinedRoom.state.players.onRemove((player: any, key: any) => {
                // console.log("Player removed:", key, player);
            });

            joinedRoom.onMessage("playerMoved", (data: any) => {
                // console.log(data);
            });
        });
    }, []);

    return <RoomContext.Provider value={{ room }}>{children}</RoomContext.Provider>;
};

export const useRoom = () => {
    const context = useContext(RoomContext);
    if (context === undefined) {
        throw new Error("useRoom must be used within a RoomProvider");
    }
    return context;
};
