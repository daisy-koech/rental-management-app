import StatusBadge from "./StatusBadge";
import "./PaymentRow.css";

function PaymentRow({ payment }) {
  return (
    <div className="payment-row">
      <div>
        <strong>{payment.payment_date}</strong>

        <p>
          Payment reference: {payment.reference || "—"}
        </p>
      </div>

      <div>
        <strong>
          KSh {payment.amount.toLocaleString()}
        </strong>

        <StatusBadge status={payment.status} />
      </div>
    </div>
  );
}

export default PaymentRow;
