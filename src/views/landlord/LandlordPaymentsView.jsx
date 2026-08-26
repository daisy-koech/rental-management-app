import { useEffect, useState } from "react";
import {
  getLandlordPayments,
  createLandlordPayment,
  updateLandlordPayment,
} from "../../services/api";
import StatusBadge from "../../components/StatusBadge";
import DashboardTabs from "../../components/DashboardTabs";
import "./LandlordPaymentsView.css";

const TABS = [
  { label: "Overview", to: "/landlord", end: true },
  { label: "Units", to: "/landlord/units" },
  { label: "Maintenance", to: "/landlord/tickets" },
  { label: "Payments", to: "/landlord/payments" },
  { label: "Leases", to: "/landlord/leases" },
  { label: "Notices", to: "/landlord/notices" },
];

const EMPTY_FORM = {
  lease_id: "",
  amount: "",
  payment_date: "",
  status: "paid",
  reference: "",
};

function LandlordPaymentsView() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    try {
      setLoading(true);
      setError("");

      const data = await getLandlordPayments();
      setPayments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
    setEditingPayment(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowForm(true);
  }

  function openEditForm(payment) {
    setEditingPayment(payment);

    setForm({
      lease_id: payment.lease_id || "",
      amount: payment.amount || "",
      payment_date: payment.payment_date || "",
      status: payment.status || "paid",
      reference: payment.reference || "",
    });

    setError("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingPayment(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      if (editingPayment) {
        const updatedPayment = await updateLandlordPayment(
          editingPayment.id,
          {
            amount: Number(form.amount),
            payment_date: form.payment_date,
            status: form.status,
            reference: form.reference,
          }
        );

        setPayments((currentPayments) =>
          currentPayments.map((payment) =>
            payment.id === updatedPayment.id
              ? updatedPayment
              : payment
          )
        );
      } else {
        const newPayment = await createLandlordPayment({
          lease_id: Number(form.lease_id),
          amount: Number(form.amount),
          payment_date: form.payment_date,
          status: form.status,
          reference: form.reference,
        });

        setPayments((currentPayments) => [
          newPayment,
          ...currentPayments,
        ]);
      }

      closeForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  let submitButtonText = "Add Payment";

  if (saving) {
    submitButtonText = "Saving...";
  } else if (editingPayment) {
    submitButtonText = "Save Changes";
  }

  return (
    <div className="landlord-payments-view">
      <h1>Payments</h1>

      <DashboardTabs tabs={TABS} />

      <div className="payments-actions">
        <button
          type="button"
          onClick={openAddForm}
        >
          Add Payment
        </button>
      </div>

      {error && (
        <p className="dashboard-error">
          {error}
        </p>
      )}

      {loading && (
        <p>Loading payments...</p>
      )}

      {!loading &&
        !error &&
        payments.length === 0 && (
          <p className="empty-text">
            No payments have been recorded.
          </p>
        )}

      {!loading &&
        payments.length > 0 && (
          <table className="payments-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Lease</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Reference</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>

                  <td>{payment.lease_id}</td>

                  <td>
                    KSh{" "}
                    {Number(
                      payment.amount
                    ).toLocaleString()}
                  </td>

                  <td>
                    {payment.payment_date}
                  </td>

                  <td>
                    <StatusBadge
                      status={payment.status}
                    />
                  </td>

                  <td>
                    {payment.reference || "—"}
                  </td>

                  <td className="payment-actions">
                    <button
                      type="button"
                      onClick={() =>
                        openEditForm(payment)
                      }
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      {showForm && (
        <div className="payment-form-container">
          <h2>
            {editingPayment
              ? "Edit Payment"
              : "Add Payment"}
          </h2>

          <form
            className="payment-form"
            onSubmit={handleSubmit}
          >
            <label htmlFor="lease_id">
              Lease ID
            </label>

            <input
              id="lease_id"
              name="lease_id"
              type="number"
              value={form.lease_id}
              onChange={handleChange}
              required
              disabled={Boolean(editingPayment)}
            />

            <label htmlFor="amount">
              Amount
            </label>

            <input
              id="amount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              required
            />

            <label htmlFor="payment_date">
              Payment date
            </label>

            <input
              id="payment_date"
              name="payment_date"
              type="date"
              value={form.payment_date}
              onChange={handleChange}
              required
            />

            <label htmlFor="status">
              Status
            </label>

            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="paid">
                Paid
              </option>

              <option value="due">
                Due
              </option>

              <option value="overdue">
                Overdue
              </option>

              <option value="not paid">
                Not Paid
              </option>
            </select>

            <label htmlFor="reference">
              Payment reference
            </label>

            <input
              id="reference"
              name="reference"
              type="text"
              value={form.reference}
              onChange={handleChange}
              placeholder="e.g. T002"
            />

            <div className="payment-form-actions">
              <button
                type="submit"
                disabled={saving}
              >
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

export default LandlordPaymentsView;


