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
      <h1>{customer.name}</h1>

      {customer.phone && <p>📞 {customer.phone}</p>}
      {customer.email && <p>✉️ {customer.email}</p>}

      <div style={counterStyle}>
        <h2>{customer.remaining}</h2>
        <p>Sharpenings Remaining</p>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button onClick={() => handleTransaction(+1)}>+1</button>
        <button onClick={() => handleTransaction(-1)} disabled={customer.remaining <= 0}>
          –1
        </button>
        <button onClick={() => handleTransaction(+10)}>Add Pass (+10)</button>
        <button onClick={() => setShowEditModal(true)}>
          Edit
        </button>
        <button onClick={handleSoftDelete} style={{ background: "red", color: "white" }}>
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
      <h3 style={{ marginTop: 32 }}>History</h3>
      <TransactionsTable customerId={customer.id} />
    </div>
  );
};

const counterStyle = {
  marginTop: 24,
  padding: 16,
  border: "1px solid #ccc",
  borderRadius: 8,
  width: 200,
  textAlign: "center"
};

export default Customer;
