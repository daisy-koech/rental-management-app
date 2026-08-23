import StatusBadge from "./StatusBadge";
import "./PaymentRow.css";

function PaymentRow({ payment, showTenant = false }) {
  return (
    <div className="payment-row">
      <div className="payment-row-main">
        <p className="payment-period">
          {payment.period}
          {showTenant && <span className="payment-tenant"> · {payment.tenantName} (Unit {payment.unit})</span>}
        </p>
        <p className="payment-breakdown">
          Rent KSh {payment.rent.toLocaleString()} + Water KSh {payment.water.toLocaleString()} + Electricity KSh {payment.electricity.toLocaleString()}
        </p>
      </div>
      <div className="payment-row-side">
        <p className="payment-total">KSh {payment.total.toLocaleString()}</p>
        <StatusBadge status={payment.status} />
      </div>
    </div>
  );
}

export default PaymentRow;
