import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithEmailAndPassword } from "../api/auth";
import BG1 from "../img/BG1.png";
import BG2 from "../img/BG2.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await loginWithEmailAndPassword(email, password);

    if (response.success) {
      navigate("/"); // Redirect to home if login is successful
    } else {
      setError(response.error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundLeft}></div>

      <div style={styles.loginCenter}>
        <h1 style={styles.title}>Readify</h1>
        <div style={styles.loginBox}>
          <label>Email</label>
          <input
            type="email"
            style={styles.inputField}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          <label>Password</label>
          <input
            type="password"
            style={styles.inputField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          {error && <div style={styles.error}>{error}</div>}

          <button style={styles.loginBtn} onClick={handleLogin}>
            Login
          </button>

          <div style={styles.registerLink}>
            <p>Don’t have an account?</p>
            <button style={styles.registerBtn} onClick={() => navigate("/register")}>
              Register
            </button>
            <a style={styles.forgotPassword} onClick={() => navigate("/forgot-password")}>
              Forgot password?
            </a>
          </div>
        </div>
      </div>

      <div style={styles.backgroundRight}></div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100%",
    overflow: "hidden",
  },
  backgroundLeft: {
    flex: 1,
    backgroundImage: `url(${BG1})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  backgroundRight: {
    flex: 1,
    backgroundImage: `url(${BG2})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  loginCenter: {
    flex: 2,
    background: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "30px",
    color: "#333",
  },
  loginBox: {
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  inputField: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  loginBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4a90e2",
    color: "white",
    fontWeight: "bold",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background-color 0.3s ease",
  },
  registerLink: {
    marginTop: "20px",
    textAlign: "center",
  },
  registerBtn: {
    marginTop: "10px",
    padding: "8px 16px",
    backgroundColor: "transparent",
    border: "1px solid #4a90e2",
    color: "#4a90e2",
    borderRadius: "4px",
    cursor: "pointer",
  },
  forgotPassword: {
    display: "block",
    marginTop: "10px",
    fontSize: "14px",
    color: "#4a90e2",
    textDecoration: "none",
    cursor: "pointer",
  },
  error: {
    color: "#e74c3c",
    marginBottom: "10px",
  },
};

export default Login;
