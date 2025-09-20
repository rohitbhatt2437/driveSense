'use client'

import { useState } from 'react'

// Type definitions for a user and a truck
type User = {
  id: number
  name: string
}

type Truck = {
  id: number
  name: string
  model: string
  capacity: string
}

// Mock data for users with Indian names
const users: User[] = [
  { id: 1, name: 'Rajesh Kumar' },
  { id: 2, name: 'Priya Sharma' },
  { id: 3, name: 'Amit Patel' },
  { id: 4, name: 'Sunita Gupta' },
  { id: 5, name: 'Vikram Singh' },
]

// Mock data for trucks with Indian context
const trucks: Truck[] = [
  { id: 1, name: 'Tata Ace', model: 'Gold', capacity: '750 kg' },
  { id: 2, name: 'Mahindra Bolero', model: 'Pickup', capacity: '1250 kg' },
  { id: 3, name: 'Ashok Leyland Dost', model: 'Strong', capacity: '1500 kg' },
  { id: 4, name: 'Eicher Pro', model: '2049', capacity: '5000 kg' },
  { id: 5, name: 'BharatBenz', model: '1014R', capacity: '10000 kg' },
]

export default function TruckAllocation() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null)
  const [step, setStep] = useState(1)

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
    // When going back from truck selection, clear the selected truck
    if (step === 3) {
      setSelectedTruck(null)
    }
  }

  const handleSubmit = () => {
    if (selectedUser && selectedTruck) {
      console.log('Submitting:', { user: selectedUser, truck: selectedTruck })
      alert(`Success\nAllocated ${selectedTruck.name} to ${selectedUser.name}`)
      // Reset the form
      setSelectedUser(null)
      setSelectedTruck(null)
      setStep(1)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Truck Allocation</h1>
      {step === 1 && (
        <UserList
          users={users}
          onSelectUser={(user) => {
            setSelectedUser(user)
            handleNext()
          }}
        />
      )}
      {step === 2 && selectedUser && (
        <UserDetails user={selectedUser} onBack={handleBack} onNext={handleNext} />
      )}
      {step === 3 && selectedUser && (
        <TruckSelection
          trucks={trucks}
          onSelectTruck={setSelectedTruck}
          onBack={handleBack}
          onSubmit={handleSubmit}
          selectedTruck={selectedTruck}
        />
      )}
    </div>
  )
}

function UserList({
  users,
  onSelectUser,
}: {
  users: User[]
  onSelectUser: (user: User) => void
}) {
  return (
    <div className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Select a Driver</h2>
      {users.map((user) => (
        <button
          key={user.id}
          onClick={() => onSelectUser(user)}
          className="w-full text-left border border-gray-300 rounded p-2 hover:bg-gray-200"
        >
          {user.name}
        </button>
      ))}
    </div>
  )
}

function UserDetails({
  user,
  onBack,
  onNext,
}: {
  user: User
  onBack: () => void
  onNext: () => void
}) {
  // Construct some mock user details
  const userDetails = {
    name: user.name,
    email: `${user.name.toLowerCase().replace(' ', '.')}@example.com`,
    phoneNumber: '+91 98765 43210',
    drivingLicense: 'DL-1420110012345',
    pastExperience: '3-5 years',
    preferredRoutes: 'Mumbai - Pune, Delhi - Jaipur',
    languages: 'Hindi, English, Marathi',
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">{userDetails.name}</h2>
        <div className="space-y-3 mb-6">
          <DetailItem label="Email" value={userDetails.email} />
          <DetailItem label="Phone Number" value={userDetails.phoneNumber} />
          <DetailItem label="Driving License" value={userDetails.drivingLicense} />
          <DetailItem label="Past Experience" value={userDetails.pastExperience} />
          <DetailItem label="Preferred Routes" value={userDetails.preferredRoutes} />
          <DetailItem label="Languages" value={userDetails.languages} />
        </div>
        <div className="flex justify-between">
          <button onClick={onBack} className="border border-gray-300 rounded p-2 flex items-center">
            <span className="mr-2">←</span> Back
          </button>
          <button onClick={onNext} className="border border-gray-300 rounded p-2 flex items-center">
            Next <span className="ml-2">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-semibold">{label}:</span> {value}
    </div>
  )
}

function TruckSelection({
  trucks,
  onSelectTruck,
  onBack,
  onSubmit,
  selectedTruck,
}: {
  trucks: Truck[]
  onSelectTruck: (truck: Truck) => void
  onBack: () => void
  onSubmit: () => void
  selectedTruck: Truck | null
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Select a Truck</h2>
        {trucks.map((truck) => (
          <div key={truck.id} className="flex items-center space-x-2 mb-4">
            <input
              type="radio"
              name="selectedTruck"
              value={truck.id}
              id={`truck-${truck.id}`}
              checked={selectedTruck?.id === truck.id}
              onChange={() => onSelectTruck(truck)}
              className="form-radio"
            />
            <label htmlFor={`truck-${truck.id}`} className="cursor-pointer">
              <div className="font-medium">{truck.name}</div>
              <div className="text-sm text-gray-500">Model: {truck.model}</div>
              <div className="text-sm text-gray-500">Capacity: {truck.capacity}</div>
            </label>
          </div>
        ))}
        <div className="flex justify-between mt-6">
          <button onClick={onBack} className="border border-gray-300 rounded p-2 flex items-center">
            <span className="mr-2">←</span> Back
          </button>
          <button
            onClick={onSubmit}
            disabled={!selectedTruck}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}
