import { useEffect, useState } from "react";
import { listenToTransactions } from "../../firebase/transactions";

const TransactionTable = ({ customerId }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!customerId) return;

    const unsubscribe = listenToTransactions(customerId, setTransactions);
    return unsubscribe;
  }, [customerId]);

  if (!transactions.length) {
    return <p style={{ marginTop: 24 }}>No history yet</p>;
  }

  return (
    <div style={tableWrapper}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Time</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Change</th>
            <th style={thStyle}>User</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td style={tdStyle}>
                {tx.createdAt?.toDate().toLocaleString() || "—"}
              </td>

              <td
                style={{
                  ...tdStyle,
                  ...numericCell,
                  color: tx.delta > 0 ? "#16a34a" : "#dc2626"
                }}
              >
              {tx.delta > 0 ? `+${tx.delta}` : tx.delta}
              </td>

              <td style={tdStyle}>{tx.userEmail || "—"}</td>
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

const tableWrapper = {
  marginTop: 24,
  overflowX: "auto"
};


export default TransactionTable;
