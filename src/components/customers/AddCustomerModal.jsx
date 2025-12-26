import { useState } from "react";
import { createCustomer } from "../../firebase/customers";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AddCustomerModal = ({ onClose }) => {
  const { store } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [remaining, setRemaining] = useState(0);
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!name.trim()) return alert("Name is required");

  setLoading(true);

  try {
    const customerId = await createCustomer({
      name: name.trim(),
      phone,
      email,
      store,
      initialSharpenings: Number(remaining)
    });

    onClose();
    navigate(`/customer/${customerId}`);
  } catch (err) {
    console.error(err);
    alert("Failed to create customer");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={overlayStyle}>
      <form style={modalStyle} onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: 8 }}>Add Customer</h2>

        <input
          style={inputStyle}
          placeholder="Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          style={inputStyle}
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          style={inputStyle}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          style={inputStyle}
          value={remaining}
          onChange={(e) => setRemaining(e.target.value)}
        >
          <option value={0}>0 sharpenings</option>
          <option value={1}>+1 sharpening</option>
          <option value={10}>+10 sharpenings</option>
        </select>

        <div style={buttonRow}>
          <button type="submit" disabled={loading} style={primaryButton}>
            {loading ? "Saving..." : "Create"}
          </button>
          <button type="button" onClick={onClose} style={secondaryButton}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 16
};

const modalStyle = {
  background: "#fff",
  padding: 24,
  width: "100%",
  maxWidth: 400,
  borderRadius: 12,
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
};

const inputStyle = {
  minHeight: 48,
  padding: "0 14px",
  fontSize: 16,
  borderRadius: 8,
  border: "1px solid #ccc",
  marginBottom: 12
};

const buttonRow = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  marginTop: 16
};

const primaryButton = {
  minHeight: 48,
  fontSize: 16,
  borderRadius: 8,
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  cursor: "pointer"
};

const secondaryButton = {
  minHeight: 48,
  fontSize: 16,
  borderRadius: 8,
  backgroundColor: "#f3f4f6",
  color: "#111",
  border: "1px solid #ccc",
  cursor: "pointer"
};


export default AddCustomerModal;
