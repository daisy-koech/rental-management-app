import { useEffect, useState } from "react";
import {
  getLandlordProperty,
  getLandlordUnits,
  getLandlordLeases,
  getLandlordMaintenanceTickets,
  getLandlordPayments,
} from "../../services/api";
import DashboardTabs from "../../components/DashboardTabs";
import "./LandlordDashboard.css";

const TABS = [
  { label: "Overview", to: "/landlord", end: true },
  { label: "Units", to: "/landlord/units" },
  { label: "Maintenance", to: "/landlord/tickets" },
  { label: "Payments", to: "/landlord/payments" },
  { label: "Leases", to: "/landlord/leases" },
  { label: "Notices", to: "/landlord/notices" },
];

function LandlordDashboard() {
  const [property, setProperty] = useState(null);
  const [units, setUnits] = useState([]);
  const [leases, setLeases] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [
          propertyData,
          unitsData,
          leasesData,
          ticketsData,
          paymentsData,
        ] = await Promise.all([
          getLandlordProperty(),
          getLandlordUnits(),
          getLandlordLeases(),
          getLandlordMaintenanceTickets(),
          getLandlordPayments(),
        ]);

        setProperty(propertyData);
        setUnits(unitsData);
        setLeases(leasesData);
        setTickets(ticketsData);
        setPayments(paymentsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const occupiedCount = leases.filter(
    (lease) => lease.status === "active"
  ).length;

  const openMaintenanceCount = tickets.filter(
    (ticket) => ticket.status !== "resolved"
  ).length;

  const overduePaymentsCount = payments.filter(
    (payment) => payment.status === "overdue"
  ).length;

  let dashboardContent;

  if (loading) {
    dashboardContent = (
      <p className="dashboard-hint">
        Loading dashboard...
      </p>
    );
  } else if (error) {
    dashboardContent = (
      <p className="dashboard-hint">
        {error}
      </p>
    );
  } else {
    dashboardContent = (
      <>
        <div className="dashboard-summary">
          <div className="summary-block">
            <span className="summary-label">
              Occupancy
            </span>

            <span className="summary-value">
              {occupiedCount} / {units.length} units
            </span>
          </div>

          <div className="summary-block">
            <span className="summary-label">
              Open maintenance
            </span>

            <span className="summary-value">
              {openMaintenanceCount}
            </span>
          </div>

          <div className="summary-block">
            <span className="summary-label">
              Overdue payments
            </span>

            <span className="summary-value">
              {overduePaymentsCount}
            </span>
          </div>
        </div>

        <p className="dashboard-hint">
          Use the tabs above to view units, maintenance requests,
          payments, leases and notices.
        </p>
      </>
    );
  }

  return (
    <div className="landlord-dashboard">
      <h1>
        {property?.name || "Rental Property"}
      </h1>

      {property?.location && (
        <p className="dashboard-location">
          {property.location}
        </p>
      )}

      <DashboardTabs tabs={TABS} />

      {dashboardContent}
    </div>
  );
}

export default LandlordDashboard;

