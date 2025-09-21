import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

interface TruckModelProps {
  gyro: { x: number; y: number; z: number };
}

const TruckModel: React.FC<TruckModelProps> = ({ gyro }) => {
  // Type the truckRef as a generic THREE.Object3D or THREE.Group
  const truckRef = useRef<THREE.Object3D>(null);

  // Cast the returned scene from useGLTF to a THREE.Group type
  const { scene } = useGLTF('/truck2.glb') as { scene: THREE.Group };

  // Optionally adjust the model’s base orientation
  scene.rotation.set(0, 0, 0);
  scene.position.set(0, 0, 0);

  // Update the truck's rotation using the gyro data each frame
  useFrame(() => {
    if (truckRef.current) {
      truckRef.current.rotation.x = gyro.x * 1.6;
      truckRef.current.rotation.y = gyro.z * 1.6;
      truckRef.current.rotation.z = gyro.y * 1.6;
    }
  });

  return (
    <Center position={[0, -0.5, 0]} disableZ>
      <primitive object={scene} ref={truckRef} dispose={null} scale={2.2} />
    </Center>
  );
};

// Preload the GLB for faster first render
useGLTF.preload('/truck2.glb');

export default TruckModel;
