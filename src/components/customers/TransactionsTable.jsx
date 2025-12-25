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
    <table style={tableStyle}>
      <thead>
        <tr>
          <th>Time</th>
          <th>Change</th>
          <th>User</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx) => (
          <tr key={tx.id}>
            <td>
              {tx.createdAt?.toDate().toLocaleString() || "—"}
            </td>
            <td style={{ color: tx.delta > 0 ? "green" : "red" }}>
              {tx.delta > 0 ? `+${tx.delta}` : tx.delta}
            </td>
            <td>{tx.userEmail || "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const tableStyle = {
  marginTop: 24,
  width: "100%",
  borderCollapse: "collapse"
};

export default TransactionTable;
