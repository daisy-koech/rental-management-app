import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import HomeView from "./views/HomeView";
import PropertyView from "./views/PropertyView";
import AreaView from "./views/AreaView";
import AboutView from "./views/AboutView";
import LoginView from "./views/LoginView";

import TenantDashboard from "./views/tenant/TenantDashboard";
import TenantLeaseView from "./views/tenant/TenantLeaseView";
import TenantPaymentsView from "./views/tenant/TenantPaymentsView";
import MaintenanceView from "./views/tenant/MaintenanceView";
import TenantNoticesView from "./views/tenant/TenantNoticesView";

import LandlordDashboard from "./views/landlord/LandlordDashboard";
import LandlordUnitsView from "./views/landlord/LandlordUnitsView";
import LandlordTicketsView from "./views/landlord/LandlordTicketsView";
import LandlordPaymentsView from "./views/landlord/LandlordPaymentsView";
import LandlordLeasesView from "./views/landlord/LandlordLeasesView";
import LandlordNoticesView from "./views/landlord/LandlordNoticesView";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="app-content">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/property" element={<PropertyView />} />
          <Route path="/area" element={<AreaView />} />
          <Route path="/about" element={<AboutView />} />

          <Route path="/tenant" element={<ProtectedRoute role="tenant"><TenantDashboard /></ProtectedRoute>} />
          <Route path="/tenant/lease" element={<ProtectedRoute role="tenant"><TenantLeaseView /></ProtectedRoute>} />
          <Route path="/tenant/payments" element={<ProtectedRoute role="tenant"><TenantPaymentsView /></ProtectedRoute>} />
          <Route path="/tenant/maintenance" element={<ProtectedRoute role="tenant"><MaintenanceView /></ProtectedRoute>} />
          <Route path="/tenant/notices" element={<ProtectedRoute role="tenant"><TenantNoticesView /></ProtectedRoute>} />

          <Route path="/landlord" element={<ProtectedRoute role="landlord"><LandlordDashboard /></ProtectedRoute>} />
          <Route path="/landlord/units" element={<ProtectedRoute role="landlord"><LandlordUnitsView /></ProtectedRoute>} />
          <Route path="/landlord/tickets" element={<ProtectedRoute role="landlord"><LandlordTicketsView /></ProtectedRoute>} />
          <Route path="/landlord/payments" element={<ProtectedRoute role="landlord"><LandlordPaymentsView /></ProtectedRoute>} />
          <Route path="/landlord/leases" element={<ProtectedRoute role="landlord"><LandlordLeasesView /></ProtectedRoute>} />
          <Route path="/landlord/notices" element={<ProtectedRoute role="landlord"><LandlordNoticesView /></ProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;


