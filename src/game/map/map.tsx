import { RigidBody, MeshCollider } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";

import mapModel from "../../assets/glts/among_us_map.glb";

const Map: React.FC<{ onLoad: () => void }> = ({ onLoad }) => {
    const Gltf = useRef(null);
    const { scene }: any = useGLTF(mapModel);

    useEffect(() => {
        if (scene) {
            scene.traverse((child: any) => {
                if (child.isObject3D) {
                    child.layers.set(0);
                }
            });

            onLoad();
        }
    }, [scene, onLoad]);

    return (
        scene && (
            <RigidBody scale={[20, 20, 20]} position={[0, 0, 0]} type="fixed" ref={Gltf}>
                <mesh layers={0} castShadow receiveShadow>
                    <MeshCollider type="trimesh">
                        <primitive object={scene} />
                    </MeshCollider>
                </mesh>
            </RigidBody>
        )
    );
};

export default Map;
