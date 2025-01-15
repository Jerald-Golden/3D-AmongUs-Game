import { create } from "zustand";

interface StaminaState {
    stamina: number;
    setStamina: (x: number) => void;
}

export const useStamina = create<StaminaState>((set) => ({
    stamina: 100,
    setStamina: (x: number) => set(() => ({ stamina: x })),
}));