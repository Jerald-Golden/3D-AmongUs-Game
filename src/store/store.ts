import { create } from "zustand";

interface StaminaState {
    stamina: number;
    setStamina: (x: number) => void;
}

export const useStamina = create<StaminaState>((set) => ({
    stamina: 100,
    setStamina: (x: number) => set(() => ({ stamina: x })),
}));

interface RoomState {
    roomData: {
        roomName: string | undefined;
        roomId: string | undefined;
    };
    setRoomData: (name: string, id: string | undefined) => void;
}

export const useRoomData = create<RoomState>((set) => ({
    roomData: {
        roomName: undefined,
        roomId: undefined,
    },
    setRoomData: (name: string, id: string | undefined) => set(() => ({ roomData: { roomName: name, roomId: id } })),
}));