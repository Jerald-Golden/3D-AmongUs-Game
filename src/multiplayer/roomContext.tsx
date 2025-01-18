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
        // Initialize the client and join the room
        client.current = new Client("https://game-server-v2rf.onrender.com");
        const playerName = localStorage.getItem("playerName");

        client.current.joinOrCreate("Room_handler", { name: playerName, role: "player" }).then((joinedRoom: any) => {
            setRoom(joinedRoom);

            // Handle state updates for players
            joinedRoom.state.players.onAdd((player: any, key: any) => {
                // Handle new player added
                // console.log("Player added:", key, player);
            });

            joinedRoom.state.players.onRemove((player: any, key: any) => {
                // Handle player removal
                // console.log("Player removed:", key, player);
            });

            // Handle player movement updates
            joinedRoom.onMessage("playerMoved", (data: any) => {
                // console.log(data);
            });

            // Handle chat messages
            joinedRoom.onMessage("chat", (data: any) => {
                // console.log("Received chat message:", data);
            });
        });

        return () => {
            if (room) room.leave();
        };
        // eslint-disable-next-line
    }, []);

    return (
        <RoomContext.Provider value={{ room }}>
            {children}
        </RoomContext.Provider>
    );
};

export const useRoom = () => {
    const context = useContext(RoomContext);
    if (context === undefined) {
        throw new Error("useRoom must be used within a RoomProvider");
    }
    return context;
};
