import { useNavigate } from "react-router-dom";
import { updateSharpenings } from "../../firebase/customers";
import { useAuth } from "../../context/AuthContext";

const CustomerList = ({ customers, setCustomers }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleQuickUpdate = async (e, customer, delta) => {
    e.stopPropagation(); // 🚫 prevent row navigation

    try {
      await updateSharpenings(
        customer.id,
        delta,
        delta > 0 ? "quick_add" : "quick_use",
        user.email
      );

      // ✅ optimistic UI update
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === customer.id
            ? { ...c, remaining: c.remaining + delta }
            : c
        )
      );
    } catch (err) {
      alert(err.message || "Failed to update");
    }
  };

  if (customers.length === 0) {
    return <p>No customers yet.</p>;
  }

  return (
    <div style={tableWrapper}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Add</th>
            <th style={thStyle}>Remove</th>
            <th style={thStyle}>Remaining</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr
              key={customer.id}
              onClick={() => navigate(`/customer/${customer.id}`)}
              style={{ cursor: "pointer" }}
            >
              <td style={tdStyle}>{customer.name}</td>
              <td style={tdStyle}>
                <div style={actionsStyle}>
                  <button
                    onClick={(e) => handleQuickUpdate(e, customer, +1)}
                  >
                    +1
                  </button>
                  <button
                    onClick={(e) => handleQuickUpdate(e, customer, +10)}
                  >
                    +10
                  </button>
                </div>
              </td>
              <td style={tdStyleMin}>
                <div>
                  <button
                    onClick={(e) => handleQuickUpdate(e, customer, -1)}
                    disabled={customer.remaining <= 0}
                  >
                    –1
                  </button>
                </div>
              </td>
              <td style={{ ...tdStyle, ...numericCell }}>
                {customer.remaining}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const actionsStyle = {
  display: "flex",
  gap: 3
};

const tableStyle = {
  marginTop: 10,
  width: "100%",
  borderCollapse: "collapse"
};

const tableWrapper = {
  marginTop: 10,
  overflowX: "auto"
};

const thStyle = {
  textAlign: "left",
  padding: "6px 8px",
  borderBottom: "2px solid #e5e7eb",
  fontSize: 14,
  fontWeight: 500,
  backgroundColor: "#f9fafb"
};

const tdStyle = {
  padding: "8px 2px",
  borderBottom: "1px solid #e5e7eb",
  verticalAlign: "left"
};

const tdStyleMin = {
  padding: "8px 2px",
  borderBottom: "1px solid #e5e7eb",
  textAlign: "right",
};
const numericCell = {
  textAlign: "right",
  fontWeight: 500
};

export default CustomerList;
