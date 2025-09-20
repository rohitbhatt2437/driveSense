import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface TruckModelProps {
  gyro: { x: number; y: number; z: number };
}

const TruckModel: React.FC<TruckModelProps> = ({ gyro }) => {
  // Type the truckRef as a generic THREE.Object3D or THREE.Group
  const truckRef = useRef<THREE.Object3D>(null);

  // Cast the returned scene from useGLTF to a THREE.Group type
  const { scene } = useGLTF('/truck2.glb') as { scene: THREE.Group };

  // Optionally adjust the model’s scale and position
  scene.scale.set(1, 1, 1);
  scene.position.set(0, 0, 0);

  // Update the truck's rotation using the gyro data each frame
  useFrame(() => {
    if (truckRef.current) {
      truckRef.current.rotation.x = gyro.x * 1.6;
      truckRef.current.rotation.y = gyro.z * 1.6;
      truckRef.current.rotation.z = gyro.y * 1.6;
    }
  });

  return <primitive object={scene} ref={truckRef} dispose={null} />;
};

export default TruckModel;
