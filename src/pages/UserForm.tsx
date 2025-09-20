import { useState } from 'react';
import toast from 'react-hot-toast';

// Example step-based UserForm component
const UserForm = () => {
    // Step control
    const [step, setStep] = useState(1);
    const totalSteps = 3; // or however many steps you have
    const progress = (step / totalSteps) * 100;

    // Step 1: Fleet size
    const [fleetSize, setFleetSize] = useState('');
    // Step 2: Vehicle count
    const [vehicleCount, setVehicleCount] = useState('');
    // Step 3: Tracking needs
    const [trackingNeeds, setTrackingNeeds] = useState<string[]>([]);

    // Generic handlers
    const nextStep = () => {
        if (step < totalSteps) setStep(step + 1);
    };
    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    // Step 1: Device & Driver Details
    const [deviceId, setDeviceId] = useState('');
    const [driverName, setDriverName] = useState('');

    // Step 2: Sensor Thresholds for Driver Behaviour Monitoring
    const [rashThreshold, setRashThreshold] = useState<number>(0.5);
    const [harshAccelThreshold, setHarshAccelThreshold] = useState<number>(1.3);
    const [vibrationThreshold, setVibrationThreshold] = useState<number>(2);
    const [harshBrakingThreshold, setHarshBrakingThreshold] = useState<number>(-3);
    const [curveSpeedLimit, setCurveSpeedLimit] = useState<number>(8);

    const handleSubmitStep3 = () => {
        // Gather all form data into an object
        const formData = {
            deviceId,
            driverName,
            rashThreshold,
            harshAccelThreshold,
            vibrationThreshold,
            harshBrakingThreshold,
            curveSpeedLimit,
            // You can include more fields if necessary
        };

        console.log("Submitting form data:", formData);
        nextStep();
        // Example POST request to your API endpoint
        // fetch('/api/driver-form', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(formData),
        // })
        //     .then((res) => {
        //         if (res.ok) {
        //             toast.success("Form submitted successfully!");
        //             // Optionally reset form states or navigate to a success page
        //         } else {
        //             toast.error("Form submission failed!");
        //         }
        //     })
        //     .catch((err) => {
        //         console.error("Error submitting form:", err);
        //         toast.error("Error submitting form");
        //     });
    };




    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="text-center mb-2">
                <h2 className="text-2xl font-semibold">
                    Step {step} of {totalSteps}
                </h2>
            </div>

            {/* ---------------- STEP 1 ---------------- */}
            {step === 1 && (
                <div className="max-w-md mx-auto p-6 bg-white rounded-md mt-4">
                    <h1 className="text-xl md:text-2xl font-bold text-center">
                        Enter Device & Driver Details
                    </h1>
                    <div className="mt-6 space-y-4">
                        <div>
                            <label className="block text-lg font-semibold mb-1">Device ID</label>
                            <input
                                type="text"
                                value={deviceId}
                                onChange={(e) => setDeviceId(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2"
                                placeholder="Enter Device ID"
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-semibold mb-1">Driver Name</label>
                            <input
                                type="text"
                                value={driverName}
                                onChange={(e) => setDriverName(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2"
                                placeholder="Enter Driver Name"
                            />
                        </div>
                    </div>
                    <div className="mt-6 text-center">
                        <button
                            onClick={handleSubmitStep3}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-semibold"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}


            {/* ---------------- STEP 2 ---------------- */}
            {step === 2 && (
                <div className="max-w-md mx-auto p-6 bg-white rounded-md mt-4">
                    <h1 className="text-xl md:text-2xl font-bold text-center">
                        Set Sensor Thresholds
                    </h1>
                    <div className="mt-6 space-y-4">
                        <div>
                            <label className="block text-lg font-semibold mb-1">Rash Driving Threshold (radians)</label>
                            <input
                                type="number"
                                value={rashThreshold}
                                onChange={(e) => setRashThreshold(parseFloat(e.target.value))}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-semibold mb-1">Harsh Acceleration Threshold (m/s²)</label>
                            <input
                                type="number"
                                value={harshAccelThreshold}
                                onChange={(e) => setHarshAccelThreshold(parseFloat(e.target.value))}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-semibold mb-1">Rough Road Vibration Threshold (m/s²)</label>
                            <input
                                type="number"
                                value={vibrationThreshold}
                                onChange={(e) => setVibrationThreshold(parseFloat(e.target.value))}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-semibold mb-1">Harsh Braking Threshold (m/s²)</label>
                            <input
                                type="number"
                                value={harshBrakingThreshold}
                                onChange={(e) => setHarshBrakingThreshold(parseFloat(e.target.value))}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-semibold mb-1">Curve Speed Limit (km/h)</label>
                            <input
                                type="number"
                                value={curveSpeedLimit}
                                onChange={(e) => setCurveSpeedLimit(parseFloat(e.target.value))}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                        <button
                            onClick={prevStep}
                            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
                        >
                            &larr;
                        </button>
                        <button
                            onClick={handleSubmitStep3}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-semibold"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}


            {/* ---------------- STEP 3 (THIS IS WHAT YOU REQUESTED) ---------------- */}
            {step === 3 && (
                <div className="max-w-md mx-auto p-6 bg-white rounded-md mt-4">
                    <h1 className="text-xl md:text-2xl font-bold text-center">
                        Review & Confirm
                    </h1>
                    <div className="mt-6 space-y-4 text-gray-700">
                        <p><strong>Device ID:</strong> {deviceId}</p>
                        <p><strong>Driver Name:</strong> {driverName}</p>
                        <p><strong>Rash Driving Threshold:</strong> {rashThreshold} radians</p>
                        <p><strong>Harsh Acceleration Threshold:</strong> {harshAccelThreshold} m/s²</p>
                        <p><strong>Rough Road Vibration Threshold:</strong> {vibrationThreshold} m/s²</p>
                        <p><strong>Harsh Braking Threshold:</strong> {harshBrakingThreshold} m/s²</p>
                        <p><strong>Curve Speed Limit:</strong> {curveSpeedLimit} km/h</p>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                        <button
                            onClick={prevStep}
                            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
                        >
                            &larr;
                        </button>
                        <button
                            onClick={handleSubmitStep3}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-semibold"
                        >
                            Confirm & Submit
                        </button>
                    </div>
                </div>
            )}





        </div>
    );
};

export default UserForm;
