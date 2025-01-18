import React from 'react';
import StaminaBar from './player/staminaBar';
import CrossHair from './player/crosssHair';

import { useStamina } from '../store/store';
import MiniMap from './game/miniMap';
import ChatUI from './game/chatMenu';

const UI: React.FC = () => {
    const { stamina } = useStamina();

    return (
        <>
            <div style={{ zIndex: 2, position: "absolute", width: "100vw", height: "100vh" }} >
                <ChatUI/>
                <MiniMap />
                <CrossHair />
                <StaminaBar stamina={stamina} />
            </div>
        </>
    );
};

export default UI;