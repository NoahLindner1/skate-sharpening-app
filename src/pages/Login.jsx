import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [store, setStore] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!store) {
      setError("Please select a store.");
      return;
    }

    try {
      setLoading(true);
      await login(email, password, store);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <form onSubmit={handleSubmit} style={cardStyle}>
        <h1 style={{ marginBottom: 24 }}>Login</h1>

        <div style={fieldStyle}>
          <label>Email</label>
          <input
            style={inputStyle}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={fieldStyle}>
          <label>Password</label>
          <input
            style={inputStyle}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div style={fieldStyle}>
          <label>Store</label>
          <select
            style={inputStyle}
            value={store}
            onChange={(e) => setStore(e.target.value)}
            required
          >
            <option value="">Select store</option>
            <option value="albertville">Albertville</option>
            <option value="anoka">Anoka</option>
          </select>
        </div>

      {error && <div style={errorStyle}>{error}</div>}

        <button style={buttonStyle} type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f9fafb",
  padding: 16
};

const cardStyle = {
  width: "100%",
  maxWidth: 360,
  backgroundColor: "#fff",
  padding: 32,
  borderRadius: 12,
  boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
};

const fieldStyle = {
  display: "flex",
  flexDirection: "column",
  marginBottom: 16
};

const inputStyle = {
  minHeight: 48,
  padding: "0 12px",
  fontSize: 16,
  borderRadius: 8,
  border: "1px solid #ccc"
};

const buttonStyle = {
  marginTop: 16,
  minHeight: 48,
  fontSize: 16,
  borderRadius: 8,
  border: "none",
  backgroundColor: "#2563eb",
  color: "white",
  cursor: "pointer"
};

const errorStyle = {
  marginTop: 8,
  marginBottom: 8,
  padding: 12,
  backgroundColor: "#fee2e2",
  color: "#991b1b",
  borderRadius: 8,
  fontSize: 14
};


export default Login;
