// src/pages/Users.tsx
import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";

type TruckAllocation = {
  truckName: string;
  deviceId: string;
  vehicleNumber: string;
  weight: number;
  registrationDate: string;
  ownerName: string;
  insuranceStatus: "Active" | "Expired";
  rtoLocation: string;
  lastServiceDate: string;
  mileage: number;
};

type UserStatus = "active" | "inactive" | "on_trip";

type User = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  age: number;
  drivingLicense: string;
  totalDeliveries: number;
  drivingScore: number; // percentage 0-100
  totalKm: number;
  status: UserStatus;
  homeBase: string;
  lastTrip: string;
  riskFlags: string[];
  trucksAllocated: TruckAllocation[];
};

// In a real app, fetch this from an API
const registeredUsers: User[] = [
  {
    id: 1,
    name: "Rakesh Kumar",
    email: "rakesh.kumar@example.com",
    phoneNumber: "+91 98765 43210",
    age: 38,
    drivingLicense: "DL12 2020 6789012",
    totalDeliveries: 120,
    drivingScore: 92,
    totalKm: 80450,
    status: "on_trip",
    homeBase: "Chandigarh",
    lastTrip: "Mohali → Panchkula",
    riskFlags: ["Speeding alert (once in last 30 days)"],
    trucksAllocated: [
      {
        truckName: "Tata 407",
        deviceId: "ABC123XYZ",
        vehicleNumber: "CH01AB1234",
        weight: 3500,
        registrationDate: "15-Jan-2018",
        ownerName: "FleetCo Pvt Ltd",
        insuranceStatus: "Active",
        rtoLocation: "Chandigarh",
        lastServiceDate: "20-Aug-2025",
        mileage: 120000,
      },
    ],
  },
  {
    id: 2,
    name: "Mukesh Sharma",
    email: "mukesh.sharma@example.com",
    phoneNumber: "+91 99876 54321",
    age: 34,
    drivingLicense: "DL09 2018 1234567",
    totalDeliveries: 86,
    drivingScore: 88,
    totalKm: 60500,
    status: "active",
    homeBase: "Mumbai",
    lastTrip: "Thane → Navi Mumbai",
    riskFlags: [],
    trucksAllocated: [
      {
        truckName: "Mahindra Bolero Pik-Up",
        deviceId: "DEF456UVW",
        vehicleNumber: "MH12CD5678",
        weight: 2800,
        registrationDate: "10-Mar-2019",
        ownerName: "FleetCo Pvt Ltd",
        insuranceStatus: "Active",
        rtoLocation: "Mumbai",
        lastServiceDate: "01-Sep-2025",
        mileage: 90000,
      },
    ],
  },
  {
    id: 3,
    name: "Amit Pal",
    email: "amit.pal@example.com",
    phoneNumber: "+91 91234 56789",
    age: 29,
    drivingLicense: "DL05 2019 7654321",
    totalDeliveries: 64,
    drivingScore: 79,
    totalKm: 42000,
    status: "inactive",
    homeBase: "Pune",
    lastTrip: "—",
    riskFlags: ["License renewal due"],
    trucksAllocated: [],
  },
  {
    id: 4,
    name: "Vikram Yadav",
    email: "vikram.y@example.com",
    phoneNumber: "+91 90000 80000",
    age: 41,
    drivingLicense: "DL18 2016 9988776",
    totalDeliveries: 155,
    drivingScore: 85,
    totalKm: 110200,
    status: "active",
    homeBase: "Delhi",
    lastTrip: "Noida → Gurugram",
    riskFlags: ["Hard braking incidents (2 last week)"],
    trucksAllocated: [
      {
        truckName: "Ashok Leyland Dost",
        deviceId: "GHI789QRS",
        vehicleNumber: "DL3CAB4321",
        weight: 2950,
        registrationDate: "21-Jul-2017",
        ownerName: "FleetCo Pvt Ltd",
        insuranceStatus: "Active",
        rtoLocation: "Delhi",
        lastServiceDate: "12-Aug-2025",
        mileage: 150500,
      },
    ],
  },
  {
    id: 5,
    name: "Suren",
    email: "suren@example.com",
    phoneNumber: "+91 95555 66666",
    age: 36,
    drivingLicense: "DL22 2017 3344556",
    totalDeliveries: 98,
    drivingScore: 90,
    totalKm: 73000,
    status: "on_trip",
    homeBase: "Lucknow",
    lastTrip: "Lucknow → Kanpur",
    riskFlags: [],
    trucksAllocated: [
      {
        truckName: "Tata Ace",
        deviceId: "JKL012MNO",
        vehicleNumber: "UP32AB1234",
        weight: 1550,
        registrationDate: "11-Jan-2020",
        ownerName: "FleetCo Pvt Ltd",
        insuranceStatus: "Expired",
        rtoLocation: "Lucknow",
        lastServiceDate: "30-May-2025",
        mileage: 50000,
      },
    ],
  },
];

export default function Users() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    const q = query.toLowerCase().trim();
    return registeredUsers.filter((u) => {
      const matchQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phoneNumber.toLowerCase().includes(q) ||
        u.drivingLicense.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" ? true : u.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [query, statusFilter]);

  if (selectedUser) {
    return (
      <div className="container mx-auto py-6 px-6">
        <button
          onClick={() => setSelectedUser(null)}
          className="mb-4 text-blue-600 hover:underline"
        >
          &larr; Back to Users
        </button>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
          {selectedUser.name}
        </h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="text-sm text-gray-500">Total Deliveries</h2>
            <p className="text-2xl font-semibold">{selectedUser.totalDeliveries}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="text-sm text-gray-500">Driving Score</h2>
            <p className="text-2xl font-semibold">{selectedUser.drivingScore}%</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="text-sm text-gray-500">Total KM</h2>
            <p className="text-2xl font-semibold">{selectedUser.totalKm.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="text-sm text-gray-500">Status</h2>
            <p className="text-2xl font-semibold capitalize">{selectedUser.status.replace("_", " ")}</p>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Personal Info</h3>
            <dl className="space-y-3 text-gray-700">
              <div>
                <dt className="font-medium">Email</dt>
                <dd>{selectedUser.email}</dd>
              </div>
              <div>
                <dt className="font-medium">Phone</dt>
                <dd>{selectedUser.phoneNumber}</dd>
              </div>
              <div>
                <dt className="font-medium">Age</dt>
                <dd>{selectedUser.age}</dd>
              </div>
              <div>
                <dt className="font-medium">Driving License</dt>
                <dd>{selectedUser.drivingLicense}</dd>
              </div>
              <div>
                <dt className="font-medium">Home Base</dt>
                <dd>{selectedUser.homeBase}</dd>
              </div>
              <div>
                <dt className="font-medium">Last Trip</dt>
                <dd>{selectedUser.lastTrip}</dd>
              </div>
              <div>
                <dt className="font-medium">Risk Flags</dt>
                <dd>
                  {selectedUser.riskFlags.length === 0 ? (
                    <span className="text-green-700">None</span>
                  ) : (
                    <ul className="list-disc list-inside">
                      {selectedUser.riskFlags.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Allocated Trucks</h3>
            {selectedUser.trucksAllocated.length === 0 ? (
              <p className="text-gray-600">No trucks allocated.</p>
            ) : (
              <div className="space-y-4">
                {selectedUser.trucksAllocated.map((truck, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl shadow">
                    <h4 className="text-base font-semibold">{truck.truckName}</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mt-2">
                      <p><strong>Device ID:</strong> {truck.deviceId}</p>
                      <p><strong>Vehicle No.:</strong> {truck.vehicleNumber}</p>
                      <p><strong>Weight:</strong> {truck.weight} KG</p>
                      <p><strong>RTO:</strong> {truck.rtoLocation}</p>
                      <p><strong>Insurance:</strong> {truck.insuranceStatus}</p>
                      <p><strong>Regd.:</strong> {truck.registrationDate}</p>
                      <p><strong>Last Service:</strong> {truck.lastServiceDate}</p>
                      <p><strong>Mileage:</strong> {truck.mileage.toLocaleString()} KM</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="container mx-auto py-6 px-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Registered Users</h1>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, phone, license..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="status" className="text-sm text-gray-600">Status:</label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="on_trip">On Trip</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left text-sm text-gray-600">
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Phone</th>
              <th className="p-3 border-b">Score</th>
              <th className="p-3 border-b">Total KM</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Trucks</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="p-3 border-b font-medium">{u.name}</td>
                <td className="p-3 border-b">{u.email}</td>
                <td className="p-3 border-b">{u.phoneNumber}</td>
                <td className="p-3 border-b">{u.drivingScore}%</td>
                <td className="p-3 border-b">{u.totalKm.toLocaleString()}</td>
                <td className="p-3 border-b capitalize">{u.status.replace("_", " ")}</td>
                <td className="p-3 border-b">{u.trucksAllocated.length}</td>
                <td className="p-3 border-b">
                  <button
                    onClick={() => setSelectedUser(u)}
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={8}>
                  No users match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
