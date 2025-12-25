import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomerById, applyTransaction } from "../firebase/customerProfile";
import { useAuth } from "../context/AuthContext";
import { softDeleteCustomer } from "../firebase/customers"; // ✅ import it
import TransactionsTable from "../components/customers/TransactionsTable";
import EditCustomerModal from "../components/customers/EditCustomerModal";

const Customer = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const data = await getCustomerById(id);
        setCustomer(data);
      } catch (err) {
        alert("Customer not found");
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [id]);

  const handleTransaction = async (delta) => {
    if (!customer) return;

    // ⛔ Prevent negative balances
   if (customer.remaining + delta < 0) {
     alert("Cannot go below zero");
     return;
   }

    try {
      await applyTransaction({
        customerId: customer.id,
        delta,
        type: delta > 0 ? "add" : "use",
        userEmail: user.email
      });

      setCustomer((prev) => ({
        ...prev,
        remaining: prev.remaining + delta
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };

  const handleSoftDelete = async () => {
    if (!customer) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${customer.name}?`
    );
    if (!confirmDelete) return;

    try {
      await softDeleteCustomer(customer.id);
      alert(`${customer.name} has been deleted`);
      // Navigate to home page ("/") after deletion
      navigate("/"); 
    } catch (err) {
      console.error(err);
      alert("Failed to delete customer");
    }
  };


  if (loading) return <p>Loading...</p>;
  if (!customer) return null;

  return (
    <div style={{ padding: 24 }}>
      <div style={infoContainerStyle}>
        <div style={customerInfoStyle}>
          <h1>{customer.name}</h1>
        {customer.phone && <p>📞 {customer.phone}</p>}
        {customer.email && <p>✉️ {customer.email}</p>}
      </div>

  <div style={counterStyle}>
    <h2 style={{ fontSize: 32, margin: 0 }}>{customer.remaining}</h2>
    <p>Sharpenings Remaining</p>
  </div>
</div>



      <div style={{ display: "flex", gap: 24, marginTop: 32, flexWrap: "wrap" }}>
        <button style={primaryButton} onClick={() => handleTransaction(+1)}>+1</button>
        <button style={secondaryButton} onClick={() => handleTransaction(-1)} disabled={customer.remaining <= 0}>
          –1
        </button>
        <button style={primaryButton} onClick={() => handleTransaction(+10)}>Add Pass (+10)</button>
        <button style={secondaryButton} onClick={() => setShowEditModal(true)}>
          Edit Customer
        </button>
      </div>
      <div style={{ marginTop: 32, flexWrap: "wrap" }}>
        <button onClick={handleSoftDelete} style={dangerButton}>
          Delete Customer
        </button>
      </div>
      
        {showEditModal && (
          <EditCustomerModal
            customer={customer}
            onClose={() => setShowEditModal(false)}
            onSave={(updatedCustomer) => setCustomer(updatedCustomer)}
          />
        )}
      <h3 style={{ marginTop: 32 }}>Customer Transaction History</h3>
      <TransactionsTable customerId={customer.id} />
    </div>
  );
};

const counterStyle = {
  padding: 16,
  border: "1px solid #ccc",
  borderRadius: 8,
  width: 200,
  textAlign: "center"
};

const buttonStyle = {
  minHeight: 48,
  padding: "0 20px",
  fontSize: 16,
  borderRadius: 8,
  cursor: "pointer"
};

const primaryButton = {
  ...buttonStyle,
  backgroundColor: "#2563eb",
  color: "white",
  border: "none"
};

const secondaryButton = {
  ...buttonStyle,
  backgroundColor: "#f3f4f6",
  color: "#111",
  border: "1px solid #ccc"
};

const dangerButton = {
  ...buttonStyle,
  backgroundColor: "#dc2626",
  color: "white",
  border: "none"
};

const infoContainerStyle = {
  display: "flex",
  alignItems: "center", // vertically centers counter
  flexWrap: "wrap", // wraps nicely if screen is narrow
  gap: 30, // space between info and counter
};

const customerInfoStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 2
};

export default Customer;
