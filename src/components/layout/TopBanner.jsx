import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TopBanner = ({ onAddCustomer }) => {
  const { logout, store } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
  <div style={bannerStyle}>
    <div style={leftButtons}>
      <button style={secondaryButton} onClick={() => navigate("/")}>Home</button>
      <button style={secondaryButton} onClick={onAddCustomer}>Add Customer</button>
    </div>

    <div style={rightButtons}>
      <span style={{ marginRight: 12 }}>{store?.toUpperCase()}</span>
      <button style={secondaryButton} onClick={handleLogout}>Logout</button>
    </div>
  </div>

  );
};

const bannerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 12,
  borderBottom: "1px solid #ccc",
  flexWrap: "wrap" // ensures it doesn’t break on small screens
};

const leftButtons = {
  display: "flex",
  gap: 12
};

const rightButtons = {
  display: "flex",
  alignItems: "center",
  gap: 12
};

const buttonStyle = {
  minHeight: 48,
  padding: "0 20px",
  fontSize: 16,
  borderRadius: 8,
  cursor: "pointer"
};

const secondaryButton = {
  ...buttonStyle,
  backgroundColor: "#f3f4f6",
  color: "#111",
  border: "1px solid #ccc"
};

export default TopBanner;
