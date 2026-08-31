import { useEffect, useState } from "react";
import {
  getLandlordLeases,
  getLandlordTenants,
  createLandlordLease,
  updateLandlordLease,
  deleteLandlordLease,
} from "../../services/api";
import StatusBadge from "../../components/StatusBadge";
import DashboardTabs from "../../components/DashboardTabs";
import "./LandlordLeasesView.css";

const TABS = [
  { label: "Overview", to: "/landlord", end: true },
  { label: "Property", to: "/landlord/property" },
  { label: "Units", to: "/landlord/units" },
  { label: "Maintenance", to: "/landlord/tickets" },
  { label: "Payments", to: "/landlord/payments" },
  { label: "Leases", to: "/landlord/leases" },
  { label: "Notices", to: "/landlord/notices" },
];

const EMPTY_FORM = {
  tenant_id: "",
  unit_id: "",
  start_date: "",
  end_date: "",
  status: "active",
};

function LandlordLeasesView() {
  const [leases, setLeases] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingLease, setEditingLease] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadLeases();
    loadTenants();
  }, []);

  async function loadLeases() {
    try {
      setLoading(true);
      setError("");

      const data = await getLandlordLeases();
      setLeases(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadTenants() {
    try {
      const data = await getLandlordTenants();
      setTenants(data);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function openAddForm() {
    setEditingLease(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowForm(true);
  }

  function openEditForm(lease) {
    setEditingLease(lease);

    setForm({
      tenant_id: lease.tenant_id || "",
      unit_id: lease.unit_id || "",
      start_date: lease.start_date || "",
      end_date: lease.end_date || "",
      status: lease.status || "active",
    });

    setError("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingLease(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      if (editingLease) {
        const updatedLease = await updateLandlordLease(
          editingLease.id,
          {
            start_date: form.start_date,
            end_date: form.end_date,
            status: form.status,
          }
        );

        setLeases((currentLeases) =>
          currentLeases.map((lease) =>
            lease.id === updatedLease.id
              ? updatedLease
              : lease
          )
        );
      } else {
        const newLease = await createLandlordLease(
          form.unit_id,
          {
            tenant_id: form.tenant_id,
            start_date: form.start_date,
            end_date: form.end_date,
          }
        );

        setLeases((currentLeases) => [
          newLease,
          ...currentLeases,
        ]);
      }

      closeForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(lease) {
    const confirmed = window.confirm(
      `Delete lease ${lease.id}? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteLandlordLease(lease.id);

      setLeases((currentLeases) =>
        currentLeases.filter(
          (currentLease) =>
            currentLease.id !== lease.id
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  let submitButtonText = "Add Lease";

  if (saving) {
    submitButtonText = "Saving...";
  } else if (editingLease) {
    submitButtonText = "Save Changes";
  }

  return (
    <div className="landlord-leases-view">
      <h1>Leases</h1>

      <DashboardTabs tabs={TABS} />

      <div className="leases-actions">
        <button type="button" onClick={openAddForm}>
          Add Lease
        </button>
      </div>

      {error && <p className="dashboard-error">{error}</p>}

      {loading && <p>Loading leases...</p>}

      {!loading && !error && leases.length === 0 && (
        <p className="empty-text">No leases have been recorded.</p>
      )}

      {!loading && leases.length > 0 && (
        <table className="leases-table">
          <thead>
            <tr>
              <th>Lease ID</th>
              <th>Tenant</th>
              <th>Unit</th>
              <th>Start</th>
              <th>End</th>
              <th>Rent</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {leases.map((lease) => (
              <tr key={lease.id}>
                <td>{lease.id}</td>
                <td>{lease.tenant_name || lease.tenant_id}</td>
                <td>{lease.unit_number || lease.unit_id}</td>
                <td>{lease.start_date}</td>
                <td>{lease.end_date || "—"}</td>
                <td>
                  KSh{" "}
                  {Number(lease.monthly_rent).toLocaleString()}
                </td>
                <td>
                  <StatusBadge status={lease.status} />
                </td>
                <td className="lease-actions">
                  <button
                    type="button"
                    onClick={() => openEditForm(lease)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(lease)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <div className="lease-form-container">
          <h2>{editingLease ? "Edit Lease" : "Add Lease"}</h2>

          <form className="lease-form" onSubmit={handleSubmit}>
            <label htmlFor="tenant_id">Tenant</label>

            <select
              id="tenant_id"
              name="tenant_id"
              value={form.tenant_id}
              onChange={handleChange}
              required
              disabled={Boolean(editingLease)}
            >
              <option value="">Select a tenant</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name} ({tenant.email})
                </option>
              ))}
            </select>

            <label htmlFor="unit_id">Unit ID</label>

            <input
              id="unit_id"
              name="unit_id"
              type="number"
              value={form.unit_id}
              onChange={handleChange}
              required
              disabled={Boolean(editingLease)}
            />

            <label htmlFor="start_date">Start date</label>

            <input
              id="start_date"
              name="start_date"
              type="date"
              value={form.start_date}
              onChange={handleChange}
              required
            />

            <label htmlFor="end_date">End date</label>

            <input
              id="end_date"
              name="end_date"
              type="date"
              value={form.end_date}
              onChange={handleChange}
            />

            <label htmlFor="status">Status</label>

            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="ended">Ended</option>
            </select>

            <div className="lease-form-actions">
              <button type="submit" disabled={saving}>
                {submitButtonText}
              </button>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default LandlordLeasesView;