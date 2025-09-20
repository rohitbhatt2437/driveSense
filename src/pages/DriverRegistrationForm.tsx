'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

type DriverData = {
    name: string
    email: string
    age: number
    dob: string
    phoneNumber: string
    gender: string
    address: string
    drivingLicense: string
    drivingExp: string
    languages: string
    preferedRoute: string
}

type UlipDriverDetails = {
    bioFullName: string
    bioGenderDesc: string
    bioMobileNo: string
    bioCitiZen: string
    bioEndorsementNo: string
    bioPermDistName: string
}

const initialData: DriverData = {
    name: '',
    age: 0,
    dob: '',
    email: '',
    phoneNumber: '',
    gender: '',
    address: '',
    drivingLicense: '',
    drivingExp: '',
    languages: '',
    preferedRoute: ''
}

export default function DriverRegistrationForm() {
    const [step, setStep] = useState(1)
    const [driverData, setDriverData] = useState<DriverData>(initialData)
    const [isVerified, setIsVerified] = useState(false)
    const [ulipDl, setUlipDl] = useState<UlipDriverDetails | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setDriverData(prev => ({ ...prev, [name]: value }))
    }

    const verifyDetails = async () => {
        setIsVerified(false)
        // try {
        // //   const response = await axios.post(
        // //     `${endpoint}/api/verify`,
        // //     {
        // //       dlnumber: driverData.drivingLicense,
        // //       dob: driverData.dob
        // //     },
        // //   )
        //   const apiData = response.data
        //   const responseData = apiData.response[0].response.dldetobj[0].bioObj
        //   setUlipDl(responseData)
        //   setIsVerified(true)
        // } catch (error) {
        //   setIsVerified(false)
        //   console.error("Verification Error:", error)
        //   toast.success("An error occurred during verification")
        // }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isVerified) {
            toast.success("Please verify your details before submitting.")
            return
        }

        console.log('Submitting:', driverData)

        toast.success("Driver registered successfully");

        setStep(1)
        setDriverData(initialData)
        setIsVerified(false)
    }
    const progressPercentage = ((step - 1) / (3 - 1)) * 95;
    const nextStep = () => setStep(prev => prev + 1)
    const prevStep = () => setStep(prev => prev - 1)

    return (
        <div className="h-full">
            <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4">
                <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-3xl">
                    <div className="relative mb-10">
                        {/* Background line */}
                        <div className="absolute top-5 left-6 right-0 h-1 bg-gray-300" />
                        {/* Progress line */}
                        <div
                            className="absolute left-6 top-5 pr-6 h-1 bg-blue-600 transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                        />
                        <div className="flex justify-between items-center">
                            {/* Step 1 */}
                            <div className="flex flex-col items-center relative mr-6 z-10">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
                                        }`}
                                >
                                    1
                                </div>
                                <p
                                    className={`mt-2 text-sm font-medium transition-colors duration-300 ${step === 1 ? "text-blue-600" : "text-gray-500"
                                        }`}
                                >
                                    Basic Details
                                </p>
                            </div>
                            {/* Step 2 */}
                            <div className="flex flex-col items-center relative z-10">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
                                        }`}
                                >
                                    2
                                </div>
                                <p
                                    className={`mt-2 text-sm font-medium transition-colors duration-300 ${step === 2 ? "text-blue-600" : "text-gray-500"
                                        }`}
                                >
                                    Driving
                                </p>
                            </div>
                            {/* Step 3 */}
                            <div className="flex flex-col items-center relative z-10">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${step >= 3 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
                                        }`}
                                >
                                    3
                                </div>
                                <p
                                    className={`mt-2 text-sm font-medium transition-colors duration-300 ${step === 3 ? "text-blue-600" : "text-gray-500"
                                        }`}
                                >
                                    Job
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Step 1: Basic Details */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        value={driverData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="age" className="block mb-1 font-medium text-gray-700">
                                        Age
                                    </label>
                                    <input
                                        id="age"
                                        name="age"
                                        type="number"
                                        value={driverData.age}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={driverData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phoneNumber" className="block mb-1 font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={driverData.phoneNumber}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white px-6 py-2 rounded-lg"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Driving */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="drivingLicense" className="block mb-1 font-medium text-gray-700">
                                        Driving License Number
                                    </label>
                                    <input
                                        id="drivingLicense"
                                        name="drivingLicense"
                                        value={driverData.drivingLicense}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="dob" className="block mb-1 font-medium text-gray-700">
                                        Date of Birth
                                    </label>
                                    <input
                                        id="dob"
                                        name="dob"
                                        type="date"
                                        value={driverData.dob}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        required
                                    />
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <button
                                        type="button"
                                        onClick={verifyDetails}
                                        disabled={isVerified}
                                        className={`px-6 py-2 rounded-lg text-white transition-colors duration-200 ${isVerified ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                                            }`}
                                    >
                                        {isVerified ? "Verified" : "Verify Details"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="px-6 py-2 bg-gray-300 hover:bg-gray-400 transition-colors duration-200 rounded-lg text-gray-800"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 transition-colors duration-200 rounded-lg text-white"
                                    >
                                        Next
                                    </button>
                                    <button
                                        type="button"
                                        className="px-6 py-2 bg-red-500 hover:bg-red-600 transition-colors duration-200 rounded-lg text-white"
                                    >
                                        Stop Registration
                                    </button>
                                </div>

                                {isVerified && ulipDl && (
                                    <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                                        <h1 className="text-2xl font-bold underline mb-4">Verified Driver Details</h1>
                                        <p>
                                            <span className="font-medium">Full Name: </span>
                                            {ulipDl.bioFullName}
                                        </p>
                                        <p>
                                            <span className="font-medium">Gender: </span>
                                            {ulipDl.bioGenderDesc}
                                        </p>
                                        <p>
                                            <span className="font-medium">Mobile Number: </span>
                                            {ulipDl.bioMobileNo}
                                        </p>
                                        <p>
                                            <span className="font-medium">Citizenship: </span>
                                            {ulipDl.bioCitiZen}
                                        </p>
                                        <p>
                                            <span className="font-medium">Endorsement Number: </span>
                                            {ulipDl.bioEndorsementNo}
                                        </p>
                                        <p>
                                            <span className="font-medium">District: </span>
                                            {ulipDl.bioPermDistName}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 3: Job */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="languages" className="block mb-1 font-medium text-gray-700">
                                        Languages
                                    </label>
                                    <input
                                        id="languages"
                                        name="languages"
                                        value={driverData.languages}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="preferedRoute" className="block mb-1 font-medium text-gray-700">
                                        Preferred Route
                                    </label>
                                    <input
                                        id="preferedRoute"
                                        name="preferedRoute"
                                        value={driverData.preferedRoute}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        required
                                    />
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="px-6 py-2 bg-gray-300 hover:bg-gray-400 transition-colors duration-200 rounded-lg text-gray-800"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 transition-colors duration-200 rounded-lg text-white"
                                    >
                                        Register Driver
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}
