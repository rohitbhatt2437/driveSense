// src/pages/TruckPage.jsx
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import TruckModel from '../components/TruckModel';

const TruckPage = () => {
  // Initialize state with valid numeric values for safety.
  const [gyro, setGyro] = useState({ x: 0, y: 0, z: 0 });
  const [accel, setAccel] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const wsHost = window.location.hostname; // Get the current hostname
    const wsUrl = `ws://${wsHost}:41234`; // Correctly formatted template literal
    const ws = new WebSocket(wsUrl);
    console.log(`WebSocket connecting to ${wsUrl}`);

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received WebSocket data:', data);
        // Check for both possible properties: "gyro" or "rotation"
        if (
          data.gyro &&
          typeof data.gyro.x === 'number' &&
          typeof data.gyro.y === 'number' &&
          typeof data.gyro.z === 'number'
        ) {
          setGyro(data.gyro);
        } else if (
          data.rotation &&
          typeof data.rotation.x === 'number' &&
          typeof data.rotation.y === 'number' &&
          typeof data.rotation.z === 'number'
        ) {
          setGyro(data.rotation);
        }
        // Update accel state if valid data is received
        if (
          data.accel &&
          typeof data.accel.x === 'number' &&
          typeof data.accel.y === 'number' &&
          typeof data.accel.z === 'number'
        ) {
          setAccel(data.accel);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <Canvas
      style={{ width: '83.68vw', height: '70vh', backgroundColor: 'lightblue', borderRadius: 12 }}
      camera={{ position: [-500, 150, 0], fov: 90 }}
    >
      {/* Basic lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Pass the gyro state to TruckModel */}
      <TruckModel gyro={gyro} />

      <OrbitControls />
    </Canvas>
  );
};

export default TruckPage;
