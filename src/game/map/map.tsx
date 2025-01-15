import { RigidBody, MeshCollider } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";
import { useRef } from "react";

import mapModel from "../../assets/glts/among_us_map.glb";

const Map = () => {
    const Gltf = useRef(null);
    const { scene }: any = useGLTF(mapModel);

    return (
        scene && (
            <>
                <RigidBody scale={[20, 20, 20]} position={[0, 0, 0]} type="fixed" ref={Gltf}>
                    <mesh castShadow receiveShadow>
                        <MeshCollider type="trimesh">
                            <primitive object={scene} />
                        </MeshCollider>
                    </mesh>
                </RigidBody>
            </>
        )
    );
}

export default Map;