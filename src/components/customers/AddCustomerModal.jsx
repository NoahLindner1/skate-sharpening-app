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
      remaining: Number(remaining)
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
        <h2>Add Customer</h2>

        <input
          placeholder="Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          value={remaining}
          onChange={(e) => setRemaining(e.target.value)}
        >
          <option value={0}>0 sharpenings</option>
          <option value={1}>+1 sharpening</option>
          <option value={10}>+10 sharpenings</option>
        </select>

        <div style={{ marginTop: 16 }}>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Create"}
          </button>
          <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>
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
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modalStyle = {
  background: "#fff",
  padding: 24,
  width: 320,
  borderRadius: 8,
  display: "flex",
  flexDirection: "column",
  gap: 12
};

export default AddCustomerModal;
