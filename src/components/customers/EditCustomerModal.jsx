import { useState } from "react";
import { updateCustomerInfo } from "../../firebase/customers";

const EditCustomerModal = ({ customer, onClose, onSave }) => {
  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone || "");
  const [email, setEmail] = useState(customer.email || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateCustomerInfo(customer.id, {
        name,
        phone: phone || null,
        email: email || null
      });

      onSave({
        ...customer,
        name,
        phone,
        email
      });

      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <form style={modalStyle} onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: 8 }}>Edit Customer</h2>

          <label style={labelStyle}>Name</label>
          <input
            style={inputStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label style={labelStyle}>Phone</label>
          <input
            style={inputStyle}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <label style={labelStyle}>Email</label>
          <input
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div style={buttonRow}>
            <button type="submit" disabled={loading} style={primaryButton}>
              Save Changes
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

const labelStyle = {
  fontSize: 14,
  fontWeight: 500,
  marginBottom: 4
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


export default EditCustomerModal;
