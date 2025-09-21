// src/pages/TruckPage.tsx
import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import TruckModel from '../components/TruckModel';

const TruckPage = () => {
  // Initialize state with valid numeric values for safety.
  const [gyro, setGyro] = useState({ x: 0, y: 0, z: 0 });
  const [accel, setAccel] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    // Prefer configured URL; skip connecting if not provided to avoid console errors in development.
    const envUrl = (import.meta as any)?.env?.VITE_TRUCK_WS_URL as string | undefined;
    if (!envUrl) {
      // No WebSocket URL configured; do not attempt to connect.
      return;
    }
    const ws = new WebSocket(envUrl);
    // console.log(`WebSocket connecting to ${envUrl}`);

    ws.onopen = () => {
      // console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
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
        // swallow parse errors to avoid noisy console in development
      }
    };

    ws.onclose = () => {
      // connection closed
    };

    ws.onerror = () => {
      // suppress WebSocket errors in UI console
    };

    return () => {
      try { ws.close(); } catch {}
    };
  }, []);

  return (
    <div className="w-full bg-[#add8e6] rounded-xl overflow-hidden h-[65vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh]">
      <Canvas
        className="w-full h-full"
        camera={{ position: [0, 1.6, 6], fov: 55, near: 0.1, far: 1000 }}
        dpr={[1, 2]}
      >
        {/* Basic lighting */}
        <hemisphereLight intensity={0.45} groundColor={0x444444} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1} castShadow />

        {/* Truck model with fallback while GLB loads */}
        <Suspense fallback={null}>
          <TruckModel gyro={gyro} />
        </Suspense>

        <OrbitControls enablePan={false} minDistance={2} maxDistance={12} />
      </Canvas>
    </div>
  );
};

export default TruckPage;
