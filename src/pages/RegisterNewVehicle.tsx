'use client'

import { useEffect, useRef, useState } from 'react'
import QRScanner from '../components/QRScanner'
import toast from 'react-hot-toast'

type UlipVehicleDetails = {
  rc_owner_name: string
  rc_regn_no: string
  rc_regn_dt: string
  rc_regn_upto: string
  rc_chasi_no: string
  rc_eng_no: string
  rc_maker_desc: string
  rc_insurance_policy_no: string
  rc_insurance_upto: string
  rc_status: string
  rc_vch_catg_desc: string
}

export default function VehicleRegistrationForm() {
  const [deviceId, setDeviceId] = useState('')
  const deviceIdRef = useRef('')
  const [vehicleNumber, setVehicleNumber] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [ulipDl, setUlipDl] = useState<UlipVehicleDetails | null>(null)
  const [scanning, setScanning] = useState(false)

  const verifyDetails = async () => {
    setIsVerified(false)

  }
  useEffect(() => {
    deviceIdRef.current = deviceId
    console.log("🎯 Device ID changed:", deviceId)
  }, [deviceId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!deviceId || !vehicleNumber) {
      toast.success("Please fill all the fields")
      return
    }

    toast.success("Device linked with vehicle successfully!")

    // setDeviceId('')
    // setVehicleNumber('')
  }

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-10">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">🔗 Link Device with Vehicle</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Device ID */}
            <div>
              <label htmlFor="deviceId" className="block text-sm font-medium text-gray-700 mb-1">
                Device ID
              </label>
              <div className="flex gap-3">
                <input
                  id="deviceId"
                  value={deviceId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeviceId(e.target.value)}
                  placeholder="Enter Device ID"
                  className="flex-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setScanning(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  Scan QR
                </button>
              </div>
            </div>

            {/* Vehicle Number */}
            <div>
              <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Number
              </label>
              <input
                id="vehicleNumber"
                value={vehicleNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVehicleNumber(e.target.value)}
                placeholder="Enter Vehicle Number"
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Verify Button */}
            <div>
              <button
                type="button"
                onClick={verifyDetails}
                disabled={isVerified}
                className={`w-full py-2 px-4 text-white rounded-md transition ${isVerified ? 'bg-green-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
              >
                {isVerified ? "✅ Verified" : "Verify Details"}
              </button>
            </div>

            {/* Verified Details */}
            {isVerified && ulipDl && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-green-700 underline mb-3">Vehicle Details</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li><strong>Driver Name:</strong> {ulipDl.rc_owner_name}</li>
                  <li><strong>Reg. Number:</strong> {ulipDl.rc_regn_no}</li>
                  <li><strong>Reg. Date:</strong> {ulipDl.rc_regn_dt}</li>
                  <li><strong>Valid Upto:</strong> {ulipDl.rc_regn_upto}</li>
                  <li><strong>Chassis No:</strong> {ulipDl.rc_chasi_no}</li>
                  <li><strong>Engine No:</strong> {ulipDl.rc_eng_no}</li>
                  <li><strong>Maker:</strong> {ulipDl.rc_maker_desc}</li>
                  <li><strong>Insurance No:</strong> {ulipDl.rc_insurance_policy_no}</li>
                  <li><strong>Insurance Upto:</strong> {ulipDl.rc_insurance_upto}</li>
                  <li><strong>Status:</strong> {ulipDl.rc_status}</li>
                  <li><strong>Category:</strong> {ulipDl.rc_vch_catg_desc}</li>
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap  gap-4 justify-between pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Register
              </button>
              <button
                type="button"
                className="px-6 py-2 bg-red-100 text-red-600 border border-red-300 rounded-md hover:bg-red-200 transition"
              >
                Stop Registration
              </button>
            </div>
          </form>
        </div>
      </div>


      {scanning && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="relative w-[320px] h-[320px] rounded-lg bg-white p-4 shadow-xl">

            <QRScanner
              onScanSuccess={(text) => {
                console.log("✅ Scanned:", text);
                setDeviceId(text); // Updates the input with the scanned value
                setScanning(false);
                toast.success("Device ID scanned successfully!");
              }}
              onClose={() => setScanning(false)}
            />
          </div>
        </div>
      )}

    </div>)
}
