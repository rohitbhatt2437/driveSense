import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import UserForm from './pages/UserForm';
import DriverDetailsPage from './pages/DriverScore';
import VehicleTracking from './pages/VehicleTracking';
import LocationTracker from './pages/LocationTracker';
import VehicleRegistrationForm from './pages/RegisterNewVehicle';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import DriverRegistrationForm from './pages/DriverRegistrationForm';
import TruckAllocation from './pages/TruckAllocation';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page rendered without layout */}
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route path="vehicle-tracking" element={<VehicleTracking />} />
          <Route path="home" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="register-new-driver" element={<DriverRegistrationForm />} />
          <Route path="form" element={<UserForm />} />
          <Route path="driver-score" element={<DriverDetailsPage />} />
          <Route path="register-new-vehicle" element={<VehicleRegistrationForm />} />
          <Route path="truck-allocation" element={<TruckAllocation />} />
          <Route path="test" element={<LocationTracker />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
