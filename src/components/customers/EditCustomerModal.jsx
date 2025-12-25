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
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Edit Customer</h2>

        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button type="submit" disabled={loading}>
              Save Changes
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomerModal;
