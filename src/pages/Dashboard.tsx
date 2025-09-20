// Dashboard.tsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface Activity {
  id: number;
  title: string;
  time: string;
}

// Sample data for the bar chart
const drivingData = [
  { name: "Rakesh Kumar", score: 90 },
  { name: "Amit Pal", score: 70 },
  { name: "Vikram Yadav", score: 85 },
  { name: "Suren", score: 40 },
  { name: "Rakesh", score: 99 },
];

// Sample recent activities
const activities: Activity[] = [
  {
    id: 1,
    title: "Rakesh Kumar using Tata Bolero",
    time: "5 mins ago",
  },
  {
    id: 2,
    title: "New Vehicle Added: Mahindra Scorpio",
    time: "20 mins ago",
  },
  {
    id: 3,
    title: "Ajay Kapoor assigned to truck #12",
    time: "1 hour ago",
  },
  {
    id: 4,
    title: "Vehicle Repair scheduled",
    time: "2 hours ago",
  },
  {
    id: 5,
    title: "Delivery Completed using Ashok Leyland",
    time: "3 hours ago",
  },
];

const Dashboard: React.FC = () => {
  return (
    <div className="p-8">
      {/* Greeting */}
      <h1 className="text-3xl font-bold mb-4">Hi, Welcome back 👋</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded shadow text-center">
          <h2 className="text-sm text-gray-500">Total Run</h2>
          <p className="text-2xl font-semibold">423 km</p>
        </div>
        <div className="p-4 bg-white rounded shadow text-center">
          <h2 className="text-sm text-gray-500">Total Driver</h2>
          <p className="text-2xl font-semibold">29</p>
        </div>
        <div className="p-4 bg-white rounded shadow text-center">
          <h2 className="text-sm text-gray-500">Total Trucks</h2>
          <p className="text-2xl font-semibold">17</p>
        </div>
        <div className="p-4 bg-white rounded shadow text-center">
          <h2 className="text-sm text-gray-500">Carbon Emission</h2>
          <p className="text-2xl font-semibold">346.32 kg</p>
        </div>
      </div>

      {/* Main Content: Driving Score & Recent Activities */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Driving Score (Bar Chart) */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Driving Score</h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={drivingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <ul>
            {activities.map((activity) => (
              <li key={activity.id} className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{activity.title}</span>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
