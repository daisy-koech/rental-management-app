import { useEffect, useState } from "react";
import {
  getLandlordUnits,
  createLandlordUnit,
  updateLandlordUnit,
  deleteLandlordUnit,
} from "../../services/api";
import StatusBadge from "../../components/StatusBadge";
import DashboardTabs from "../../components/DashboardTabs";
import "./LandlordUnitsView.css";

const TABS = [
  { label: "Overview", to: "/landlord", end: true },
  { label: "Property", to: "/landlord/property" },
  { label: "Units", to: "/landlord/units" },
  { label: "Maintenance", to: "/landlord/tickets" },
  { label: "Payments", to: "/landlord/payments" },
  { label: "Leases", to: "/landlord/leases" },
  { label: "Notices", to: "/landlord/notices" },
];

function LandlordUnitsView() {
  const [units, setUnits] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);

  const [unitNumber, setUnitNumber] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadUnits();
  }, []);

  async function loadUnits() {
    try {
      setError("");

      const data = await getLandlordUnits();

      setUnits(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function openAddForm() {
    setEditingUnit(null);
    setUnitNumber("");
    setMonthlyRent("");
    setShowForm(true);
    setError("");
  }

  function openEditForm(unit) {
    setEditingUnit(unit);
    setUnitNumber(unit.unit_number || "");
    setMonthlyRent(unit.monthly_rent ?? "");
    setShowForm(true);
    setError("");
  }

  function closeForm() {
    setShowForm(false);
    setEditingUnit(null);
    setUnitNumber("");
    setMonthlyRent("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!unitNumber.trim()) {
      setError("Unit number is required.");
      return;
    }

    if (monthlyRent === "" || Number(monthlyRent) < 0) {
      setError("Monthly rent must be a valid amount.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editingUnit) {
        const updatedUnit = await updateLandlordUnit(
          editingUnit.id,
          {
            unit_number: unitNumber.trim(),
            monthly_rent: Number(monthlyRent),
          }
        );

        setUnits((prev) =>
          prev.map((unit) =>
            unit.id === editingUnit.id ? updatedUnit : unit
          )
        );
      } else {
        const newUnit = await createLandlordUnit({
          unit_number: unitNumber.trim(),
          monthly_rent: Number(monthlyRent),
        });

        setUnits((prev) => [...prev, newUnit]);
      }

      closeForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(unit) {
    const confirmed = window.confirm(
      `Are you sure you want to delete Unit ${unit.unit_number}?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(unit.id);
    setError("");

    try {
      await deleteLandlordUnit(unit.id);

      setUnits((prev) =>
        prev.filter((item) => item.id !== unit.id)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="landlord-units-view">
      <h1>Units</h1>

      <DashboardTabs tabs={TABS} />

      <div className="units-header">
        <p>
          Manage the units in your property.
        </p>

        <button
          type="button"
          className="btn-primary"
          onClick={openAddForm}
        >
          Add unit
        </button>
      </div>

      {error && (
        <p className="dashboard-hint error-message">
          {error}
        </p>
      )}

      {showForm && (
        <section className="unit-form-section">
          <h2>
            {editingUnit ? "Edit unit" : "Add unit"}
          </h2>

          <form onSubmit={handleSubmit} className="unit-form">
            <div className="form-group">
              <label htmlFor="unit-number">
                Unit number
              </label>

              <input
                id="unit-number"
                type="text"
                value={unitNumber}
                onChange={(event) =>
                  setUnitNumber(event.target.value)
                }
                placeholder="e.g. A1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="monthly-rent">
                Monthly rent
              </label>

              <input
                id="monthly-rent"
                type="number"
                min="0"
                value={monthlyRent}
                onChange={(event) =>
                  setMonthlyRent(event.target.value)
                }
                placeholder="e.g. 25000"
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingUnit
                  ? "Save changes"
                  : "Add unit"}
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {loading && (
        <p>Loading units...</p>
      )}

      {!loading && units.length === 0 && (
        <p className="empty-text">
          No units have been added yet.
        </p>
      )}

      {!loading && units.length > 0 && (
        <table className="units-table">
          <thead>
            <tr>
              <th>Unit</th>
              <th>Monthly rent</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {units.map((unit) => (
              <tr key={unit.id}>
                <td>
                  <strong>
                    {unit.unit_number}
                  </strong>
                </td>

                <td>
                  KSh{" "}
                  {Number(unit.monthly_rent).toLocaleString()}
                </td>

                <td>
                  <StatusBadge
                    status={unit.status || "vacant"}
                  />
                </td>

                <td>
                  <div className="unit-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => openEditForm(unit)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleDelete(unit)}
                      disabled={deletingId === unit.id}
                    >
                      {deletingId === unit.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LandlordUnitsView;

