import React from 'react';
import Lights from './lights';
import { Environment, Sky } from '@react-three/drei';

const Environments: React.FC = () => {
    return (
        <>
            <Lights />
            <Sky />
            <fog attach="fog" args={['black', 0.005, 40]} />
            <Environment preset='city' />
        </>
    );
};

export default Environments;