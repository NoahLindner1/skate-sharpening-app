import { useNavigate } from "react-router-dom";

const CustomerList = ({ customers }) => {
  const navigate = useNavigate();

  if (customers.length === 0) {
    return <p>No customers yet.</p>;
  }

  return (
    <div style={tableWrapper}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
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
              <td style={tdStyle}>{customer.remaining}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const tableStyle = {
  marginTop: 24,
  width: "100%",
  borderCollapse: "collapse"
};

const tableWrapper = {
  marginTop: 24,
  overflowX: "auto"
};

const thStyle = {
  textAlign: "left",
  padding: "12px 16px",
  borderBottom: "2px solid #e5e7eb",
  fontSize: 14,
  fontWeight: 600,
  color: "#374151",
  backgroundColor: "#f9fafb"
};

const tdStyle = {
  padding: "12px 16px",
  borderBottom: "1px solid #e5e7eb",
  fontSize: 14,
  verticalAlign: "middle"
};

const numericCell = {
  textAlign: "right",
  fontWeight: 600
};
export default CustomerList;
