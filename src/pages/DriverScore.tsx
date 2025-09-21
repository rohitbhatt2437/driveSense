'use client';

import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import TruckPage from "./TruckPage";

// Dummy driver data function – no route params
const getDriverDetails = () => ({
  id: 1,
  name: "Rajesh Kumar",
  email: "rajesh.kumar@example.com",
  phoneNumber: "+91 98765 43210",
  age: 38,
  drivingLicense: "DL1234567890",
  Score: 100,
  trucksAllocated: [
    {
      truckName: "Tata 407",
      deviceId: "ABC123XYZ",
      vehicleNumber: "UP32AB1234",
      weight: 3500, // in KG
      registrationDate: "15-Jan-2018",
      ownerName: "Rajesh Kumar",
      insuranceStatus: "Active",
      rtoLocation: "Lucknow",
      lastServiceDate: "20-Oct-2023",
      mileage: 80000, // in KM
    },
    {
      truckName: "Mahindra Bolero Pik-Up",
      deviceId: "DEF456UVW",
      vehicleNumber: "MH12CD5678",
      weight: 2800, // in KG
      registrationDate: "10-Mar-2019",
      ownerName: "Rajesh Kumar",
      insuranceStatus: "Expired",
      rtoLocation: "Mumbai",
      lastServiceDate: "15-Nov-2023",
      mileage: 60000, // in KM
    }
  ],
  rashDriving: 0,
  rapidAcceleration: 0,
  hardBrake: 0,
  maxTurnableSpeed: 8.5
});

export default function DriverDetailsPage() {
  const driver = getDriverDetails();

  // State for local polling metrics
  const [hardBrake, setHardBrake] = useState<number | null>(null);
  const [rapidAcceleration, setRapidAcceleration] = useState<number | null>(null);
  const [maxTurnableSpeed, setMaxTurnableSpeed] = useState<number | null>(null);
  const [drivingScore, setDrivingScore] = useState<number>(100);
  const [tripDistance, setTripDistance] = useState<number>(1.2); // Example value in km


  // New states for additional metrics
  const [rashDriving, setRashDriving] = useState<number>(driver.rashDriving);
  const [roughVibration, setRoughVibration] = useState<number>(0);
  const [harshBraking, setHarshBraking] = useState<number>(driver.hardBrake);
  const lastBrakingToastTime = useRef<number>(0);
  const [curveSpeedCount, setCurveSpeedCount] = useState<number>(0);
  const [isCurveSpeedExceeded, setIsCurveSpeedExceeded] = useState<boolean>(false);
  // New state for coordinates and computed speed
  const [prevCoord, setPrevCoord] = useState<{ x: number; y: number; time: number } | null>(null);
  const [linearSpeed, setLinearSpeed] = useState<number>(0);



  // State for real-time WebSocket data for gyro (rotation) and acceleration.
  const [gyro, setGyro] = useState({ x: 0, y: 0, z: 0 });
  const [accel, setAccel] = useState({ x: 0, y: 0, z: 0 });
  // New state for simulated Current Road Speed Limit
  const [speedLimit, setSpeedLimit] = useState<number>(() => parseFloat(((Math.random() * 20) + 40).toFixed(2))); // random 40-60 Km/h to start
  // New state for simulated Violated Speed Count
  const [violatedSpeedCount, setViolatedSpeedCount] = useState<number>(0);
  // New state for simulated current vehicle speed (will fluctuate up and down)
  const [vehicleSpeed, setVehicleSpeed] = useState<number>(() => parseFloat(((Math.random() * 30) + 30).toFixed(2))); // 30-60 Km/h start
  
  // New states to detect and count rapid acceleration events (threshold 20 m/s²)
  const [rapidAccelCount, setRapidAccelCount] = useState<number>(0);
  const [isHighAccel, setIsHighAccel] = useState<boolean>(false);

  // useEffect to poll metrics from data.json every second
  useEffect(() => {
    const dataUrl = (import.meta as any)?.env?.VITE_DATA_JSON_URL as string | undefined;
    if (!dataUrl) {
      // No data URL configured; skip polling in development to avoid errors.
      return;
    }

    const fetchDriverMetrics = async () => {
      try {
        const response = await fetch(dataUrl, { cache: "no-store" });
        if (!response.ok) return; // silently ignore non-200s
        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) return; // avoid parsing HTML error pages
        const data = await response.json();
        if (data.hb !== undefined) setHardBrake(data.hb);
        if (data.ra !== undefined) setRapidAcceleration(data.ra);
        if (data.mts !== undefined) setMaxTurnableSpeed(data.mts);
      } catch {
        // suppress fetch/parse errors to avoid noisy console
      }
    };

    fetchDriverMetrics();
    const intervalId = setInterval(fetchDriverMetrics, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Helper to get random number in range [min, max]
  const randInRange = (min: number, max: number) => Math.random() * (max - min) + min;
  const randSignedInRange = (min: number, max: number) => (Math.random() < 0.5 ? -1 : 1) * randInRange(min, max);

  // Simulate metrics every 2 seconds: fluctuate speed limit, vehicle speed, gyro [-2,2], accel [0.10,0.20]
  useEffect(() => {
    // immediate tick so UI updates without waiting 2s
    setSpeedLimit((prev) => {
      const next = prev + randInRange(-0.2, 0.2); // fluctuate ±0.2
      return parseFloat(Math.max(20, Math.min(120, next)).toFixed(2));
    });
    setVehicleSpeed((prev) => {
      const next = prev + randInRange(-5, 5); // fluctuate ±5 Km/h
      return parseFloat(Math.max(0, Math.min(140, next)).toFixed(2));
    });
    setGyro({
      x: parseFloat(randInRange(-2, 2).toFixed(2)),
      y: parseFloat(randInRange(-2, 2).toFixed(2)),
      z: parseFloat(randInRange(-2, 2).toFixed(2)),
    });
    setAccel({
      x: parseFloat(randSignedInRange(0.10, 0.20).toFixed(2)),
      y: parseFloat(randSignedInRange(0.10, 0.20).toFixed(2)),
      z: parseFloat(randSignedInRange(0.10, 0.20).toFixed(2)),
    });
    // Set per-tick values based on whether speed exceeds limit (not monotonic)
    const overBy = vehicleSpeed - speedLimit;
    const overLimit = overBy > 0;
    const intensity = overBy > 10 ? 2 : overBy > 0 ? 1 : 0; // 0,1,2
    setRashDriving(Math.max(0, Math.floor(randInRange(intensity, intensity + 2))));
    setRapidAccelCount(Math.max(0, Math.floor(randInRange(intensity - 1, intensity + 1))));
    setRoughVibration(Math.max(0, Math.floor(randInRange(0, 2))));
    setHarshBraking(Math.max(0, Math.floor(randInRange(overLimit ? 0 : 0, overLimit ? 1 : 2))));
    setViolatedSpeedCount(overLimit ? Math.max(1, Math.floor(randInRange(1, 5))) : Math.floor(randInRange(0, 2)));

    const interval = setInterval(() => {
      setSpeedLimit((prev) => {
        const next = prev + randInRange(-0.2, 0.2); // fluctuate ±0.2
        return parseFloat(Math.max(20, Math.min(120, next)).toFixed(2));
      });
      setVehicleSpeed((prev) => {
        const next = prev + randInRange(-5, 5); // fluctuate ±5 Km/h
        return parseFloat(Math.max(0, Math.min(140, next)).toFixed(2));
      });
      setGyro({
        x: parseFloat(randInRange(-2, 2).toFixed(2)),
        y: parseFloat(randInRange(-2, 2).toFixed(2)),
        z: parseFloat(randInRange(-2, 2).toFixed(2)),
      });
      setAccel({
        x: parseFloat(randSignedInRange(0.10, 0.20).toFixed(2)),
        y: parseFloat(randSignedInRange(0.10, 0.20).toFixed(2)),
        z: parseFloat(randSignedInRange(0.10, 0.20).toFixed(2)),
      });
      // derive per-tick metrics from speed vs. limit
      setViolatedSpeedCount((prevVal) => {
        const over = vehicleSpeed - speedLimit;
        if (over > 10) return Math.max(2, Math.floor(randInRange(2, 6))); // 2-5
        if (over > 0) return Math.max(1, Math.floor(randInRange(1, 4)));   // 1-3
        return Math.floor(randInRange(0, 2)); // 0-1
      });
      setRashDriving((_) => {
        const over = vehicleSpeed - speedLimit;
        if (over > 10) return Math.floor(randInRange(2, 5));
        if (over > 0) return Math.floor(randInRange(1, 3));
        return Math.floor(randInRange(0, 2));
      });
      setRapidAccelCount((_) => Math.floor(randInRange(0, 3)));
      setRoughVibration((_) => Math.floor(randInRange(0, 3)));
      setHarshBraking((_) => Math.floor(randInRange(0, 2)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const DrivingScore = () => {
    const totalViolations = rashDriving + rapidAccelCount + roughVibration + harshBraking + curveSpeedCount;
    // Penalty = (violations per km) * 10 points
    const penalty = (totalViolations / tripDistance) * 10;
    const score = Math.max(0, 100 - penalty);
    setDrivingScore(score);
  };
  useEffect(() => {
    DrivingScore();
  }, [rashDriving, rapidAccelCount, roughVibration, harshBraking, curveSpeedCount, tripDistance]);


  // useEffect to open a WebSocket connection and update gyro/accel in real time
  useEffect(() => {
    const wsUrl = (import.meta as any)?.env?.VITE_DRIVER_WS_URL as string | undefined;
    if (!wsUrl) {
      // No WebSocket configured; skip connecting to avoid console errors in development.
      return;
    }
    const ws = new WebSocket(wsUrl);

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
      } catch {
        // swallow parse errors to avoid noisy console
      }
    };

    ws.onerror = () => {
      // suppress socket errors to keep console clean
    };
    ws.onclose = () => {
      // closed
    };

    return () => {
      try { ws.close(); } catch {}
    };
  }, []);
  const lastAccelToastTime = useRef<number>(0);
  // useEffect to check for high acceleration events (magnitude > 20 m/s²)
  useEffect(() => {
    // Compute acceleration magnitude
    const magnitude = Math.sqrt(accel.x ** 2 + accel.z ** 2);
    const now = Date.now();

    if (magnitude > 1.3 && !isHighAccel && now - lastAccelToastTime.current > 3000) {
      lastAccelToastTime.current = now;
      setRapidAccelCount((prev) => prev + 1);
      toast.error("High acceleration detected!");
      setIsHighAccel(true);
    } else if (magnitude <= 10 && isHighAccel) {
      // Reset flag once acceleration drops below threshold
      setIsHighAccel(false);
    }
  }, [accel, isHighAccel]);

  const lastRashToastTime = useRef<number>(0);

  useEffect(() => {
    const rashThreshold = 0.5; // threshold in radians for gyro (wavy motion)
    const accelThreshold = 3; // threshold (in m/s² or your unit) for acceleration verification
    const now = Date.now();
    const accelMagnitude = Math.sqrt(accel.x ** 2 + accel.z ** 2);

    if (
      (Math.abs(gyro.x) > rashThreshold || Math.abs(gyro.z) > rashThreshold) &&
      accelMagnitude > accelThreshold &&
      now - lastRashToastTime.current > 3000 // 3-second delay
    ) {
      lastRashToastTime.current = now;
      setRashDriving((prev) => prev + 1);
      toast("Rash driving detected!", { icon: "🚗" });
    }
  }, [gyro, accel]);


  // Add this near your other useState declarations:
  const lastVibrationToastTime = useRef<number>(0);
  useEffect(() => {
    const vibrationLowerThreshold = 2;
    const vibrationUpperThreshold = 3; // prevent counting strong impacts
    if (
      Math.abs(accel.z) >= vibrationLowerThreshold &&
      Math.abs(accel.z) <= vibrationUpperThreshold
    ) {
      const now = Date.now();
      if (now - lastVibrationToastTime.current > 2000) { // 2-second delay between alerts
        lastVibrationToastTime.current = now;
        setRoughVibration(prev => prev + 1);
        toast("Rough road vibration detected!", { icon: "🛣️" });
      }
    }
  }, [accel.z]);


  useEffect(() => {
    const brakingThreshold = -3 // If accel.x is less than -5 m/s², consider it harsh braking
    if (accel.x < brakingThreshold) {
      const now = Date.now();
      if (now - lastBrakingToastTime.current > 2000) { // 2 seconds delay
        lastBrakingToastTime.current = now;
        setHarshBraking(prev => prev + 1);
        toast("Harsh braking detected!", { icon: "🚨" });
      }
    }
  }, [accel.x]);

  useEffect(() => {
    if (maxTurnableSpeed !== null) {
      // Define a safe curve speed threshold (e.g., if measured speed exceeds 8 m/s, it's too high for a curve)
      const curveThreshold = 8;
      if (maxTurnableSpeed > curveThreshold && !isCurveSpeedExceeded) {
        setCurveSpeedCount((prev) => prev + 1);
        toast.error("Curve speed limit exceeded!", { icon: "⚡" });
        setIsCurveSpeedExceeded(true);
      } else if (maxTurnableSpeed <= curveThreshold && isCurveSpeedExceeded) {
        setIsCurveSpeedExceeded(false);
      }
    }
  }, [maxTurnableSpeed, isCurveSpeedExceeded]);




  // Calculate the driving score based on polled metrics
  const calculateDrivingScore = () => {
    let score = 100;
    if (hardBrake === 1) score -= 10;
    if (rapidAcceleration === 1) score -= 5;
    if (maxTurnableSpeed !== null) score += maxTurnableSpeed * 2;
    score = Math.max(0, Math.min(100, score));
    setDrivingScore(score);
  };

  // Recalculate driving score when metrics change
  useEffect(() => {
    if (hardBrake !== null || rapidAcceleration !== null || maxTurnableSpeed !== null) {
      calculateDrivingScore();
    }
  }, [hardBrake, rapidAcceleration, maxTurnableSpeed]);

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="fixed top-0 right-0 z-10 overflow-hidden max-h-screen w-full sm:w-[300px] px-2">
        <Toaster position="top-center" toastOptions={{ duration: 500 }} />
      </div>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 bg-white z-50">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6 sm:mb-10 text-center">
          Driver Details
        </h1>

        {/* Metric Cards (from polling data) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Rash Driving Card */}
          <div className="rounded-xl shadow-lg p-4 bg-red-100 transition-all transform hover:scale-105">
            <h2 className="text-lg sm:text-xl text-center font-semibold text-gray-700 mb-2">Rash Driving</h2>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-red-600">{rashDriving}</p>
            </div>
          </div>

          <div className="rounded-xl shadow-lg p-4 bg-yellow-100 transition-all transform hover:scale-105">
            <h2 className="text-lg sm:text-xl text-center font-semibold text-gray-700 mb-2">Harsh Acceleration</h2>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-yellow-600">
                {rapidAccelCount}
              </p>
            </div>
          </div>
          {/* Rough Road Vibration Card */}
          <div className="rounded-xl shadow-lg p-4 bg-green-100 transition-all transform hover:scale-105">
            <h2 className="text-lg sm:text-xl text-center font-semibold text-gray-700 mb-2">Rough Road Vibration</h2>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-green-600">{roughVibration}</p>
            </div>
          </div>
          {/* Harsh Braking Card */}
          <div className="rounded-xl shadow-lg p-4 bg-orange-100 transition-all transform hover:scale-105">
            <h2 className="text-lg sm:text-xl text-center font-semibold text-gray-700 mb-2">Harsh Braking</h2>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-orange-600">
                {harshBraking}
              </p>
            </div>
          </div>

          {/* Curve Speed Limit Exceeded Card */}
          {/* <div className="rounded-xl shadow-lg p-4 bg-purple-100 transition-all transform hover:scale-105">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Curve Speed Limit Exceeded</h2>
            <div className="text-center">
              <p className="text-5xl font-bold text-purple-600">{curveSpeedCount}</p>
            </div>
          </div> */}


          {/* Linear Current Speed Card */}
          <div className="rounded-xl shadow-lg p-4 bg-indigo-100 transition-all transform hover:scale-105">
            <h2 className="text-base sm:text-lg text-center w-full font-semibold text-gray-700 mb-2">Voilated Speed Count</h2>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-indigo-600">
                {violatedSpeedCount}
              </p>
            </div>
          </div>

          <div className="rounded-xl shadow-lg p-4 bg-blue-100 transition-all transform hover:scale-105 sm:col-span-2 md:col-span-3">
            <h2 className="text-lg sm:text-xl text-center w-full font-semibold text-gray-700 mb-2">Driver Behaviour Score </h2>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-blue-600">
                {driver.Score}
              </p>
            </div>
          </div>
          {/*  Speed Limit Card */}
          <div className="rounded-xl shadow-lg p-4 bg-indigo-100 transition-all transform hover:scale-105 sm:col-span-2">
            <h2 className="text-lg sm:text-xl text-center w-full font-semibold text-gray-700 mb-2"> Current Road Speed Limit</h2>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-red-600">
                {speedLimit.toFixed(2)} Km/h
              </p>
            </div>
          </div>

        </div>

        {/* Real-Time Metrics from WebSocket */}
        <div className="mt-8 sm:mt-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">
            Real Time Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {/* Gyro / Rotation */}
            <div className="p-4 bg-white rounded-xl shadow-md transition-all transform hover:scale-105">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-700">Gyro / Rotation</h3>
              <p className="text-base sm:text-lg">
                X: {gyro.x.toFixed(2)} <span className="text-gray-600">rad</span>
              </p>
              <p className="text-base sm:text-lg">
                Y: {gyro.y.toFixed(2)} <span className="text-gray-600">rad</span>
              </p>
              <p className="text-base sm:text-lg">
                Z: {gyro.z.toFixed(2)} <span className="text-gray-600">rad</span>
              </p>
            </div>
            {/* Acceleration */}
            <div className="p-4 bg-white rounded-xl shadow-md transition-all transform hover:scale-105">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-700">Acceleration</h3>
              <p className="text-base sm:text-lg">
                X: {accel.x.toFixed(2)} <span className="text-gray-600">m/s²</span>
              </p>
              <p className="text-base sm:text-lg">
                Y: {accel.y.toFixed(2)} <span className="text-gray-600">m/s²</span>
              </p>
              <p className="text-base sm:text-lg">
                Z: {accel.z.toFixed(2)} <span className="text-gray-600">m/s²</span>
              </p>
            </div>
          </div>
        </div>

        <div className="border border-black rounded-xl m-2">
          <TruckPage />
        </div>



        {/* Personal Information and Allocated Trucks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-md p-6 transition-all transform hover:scale-105">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Personal Information</h2>
            <dl className="space-y-4 text-gray-600">
              <div>
                <dt className="font-semibold">Name:</dt>
                <dd>{driver.name}</dd>
              </div>
              <div>
                <dt className="font-semibold">Email:</dt>
                <dd>{driver.email}</dd>
              </div>
              <div>
                <dt className="font-semibold">Phone Number:</dt>
                <dd>{driver.phoneNumber}</dd>
              </div>
              <div>
                <dt className="font-semibold">Age:</dt>
                <dd>{driver.age}</dd>
              </div>
              <div>
                <dt className="font-semibold">Driving License:</dt>
                <dd>{driver.drivingLicense}</dd>
              </div>
            </dl>
          </div>

          {/* Allocated Trucks */}
          <div className="bg-white rounded-xl shadow-md p-6 transition-all transform hover:scale-105">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Allocated Trucks</h2>
            <div className="space-y-6">
              {driver.trucksAllocated.map((truck, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-xl shadow-sm transition-all hover:shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-800">{truck.truckName}</h3>
                  <p className="text-gray-600"><strong>Device ID:</strong> {truck.deviceId}</p>
                  <p className="text-gray-600"><strong>Vehicle Number:</strong> {truck.vehicleNumber}</p>
                  <p className="text-gray-600"><strong>Weight:</strong> {truck.weight} KG</p>
                  <p className="text-gray-600"><strong>Registration Date:</strong> {truck.registrationDate}</p>
                  <p className="text-gray-600"><strong>Insurance Status:</strong> {truck.insuranceStatus}</p>
                  <p className="text-gray-600"><strong>RTO Location:</strong> {truck.rtoLocation}</p>
                  <p className="text-gray-600"><strong>Last Service Date:</strong> {truck.lastServiceDate}</p>
                  <p className="text-gray-600"><strong>Mileage:</strong> {truck.mileage.toLocaleString()} KM</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Optionally, display the calculated driving score */}
        {/*
        <div className="mt-10 text-center">
          <h2 className="text-2xl font-bold text-green-600">Driving Score: {drivingScore}</h2>
        </div>
        */}
      </div>
    </div>
  );
}
