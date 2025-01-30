import React, { createContext, useContext, useEffect, useState } from "react";
import { Client } from "colyseus.js";

type Room = {
    roomId: string;
    name: string;
    clients: number;
};

type LobbyContextType = {
    rooms: Room[];
    client: Client | null;
};

const LobbyContext = createContext<LobbyContextType>({
    rooms: [],
    client: null,
});

export const useLobby = () => useContext(LobbyContext);

export const LobbyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [client, setClient] = useState<Client | null>(null);

    useEffect(() => {
        const SERVER_URL = "https://game-server-production-7250.up.railway.app";
        const colyseusClient = new Client(SERVER_URL);
        setClient(colyseusClient);

        colyseusClient.joinOrCreate("lobby_handler").then((lobby) => {
            lobby.onMessage("rooms", (receivedRooms: Room[]) => {
                setRooms(receivedRooms);
            });

            lobby.onMessage("+", ([roomId, details]: [string, Room]) => {
                setRooms((prevRooms) => {
                    if (!prevRooms.some((room) => room.roomId === roomId)) {
                        return [...prevRooms, { roomId: details.roomId, name: details.name, clients: details.clients }];
                    }
                    return prevRooms;
                });
            });

            lobby.onMessage("-", (roomId: string) => {
                setRooms((prevRooms) => prevRooms.filter((room) => room.roomId !== roomId));
            });
        }).catch((error) => {
            console.error("Error joining lobby:", error);
        });

    }, []);

    return (
        <LobbyContext.Provider value={{ rooms, client }}>
            {children}
        </LobbyContext.Provider>
    );
};