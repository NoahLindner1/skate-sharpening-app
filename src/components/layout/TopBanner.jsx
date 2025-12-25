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
    <div style={{ padding: 12, borderBottom: "1px solid #ccc" }}>
      <button onClick={() => navigate("/")}>Home</button>
      <button onClick={onAddCustomer}>Add Customer</button>

      <span style={{ float: "right" }}>
        {store?.toUpperCase()}
        <button
          onClick={handleLogout}
          style={{ marginLeft: 12 }}
        >
          Logout
        </button>
      </span>
    </div>
  );
};

export default TopBanner;
