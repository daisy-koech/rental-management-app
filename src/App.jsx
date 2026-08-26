import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
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

          <Route path="/tenant" element={<TenantDashboard />} />
          <Route path="/tenant/lease" element={<TenantLeaseView />} />
          <Route path="/tenant/payments" element={<TenantPaymentsView />} />
          <Route path="/tenant/maintenance" element={<MaintenanceView />} />
          <Route path="/tenant/notices" element={<TenantNoticesView />} />

          <Route path="/landlord" element={<LandlordDashboard />} />
          <Route path="/landlord/units" element={<LandlordUnitsView />} />
          <Route path="/landlord/tickets" element={<LandlordTicketsView />} />
          <Route path="/landlord/payments" element={<LandlordPaymentsView />} />
          <Route path="/landlord/leases" element={<LandlordLeasesView />} />
          <Route path="/landlord/notices" element={<LandlordNoticesView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;


