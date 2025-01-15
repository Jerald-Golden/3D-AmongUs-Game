import React from 'react';
import Lights from './lights';
import { Environment, Sky } from '@react-three/drei';

const Environments: React.FC = () => {
    return (
        <>
            <Lights />
            <Sky />
            <Environment preset='city' />
        </>
    );
};

export default Environments;