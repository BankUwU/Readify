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
      navigate("/");
    } else {
      setError(response.error);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left background image */}
      <div
        className="w-1/4 bg-cover bg-center hidden md:block"
        style={{ backgroundImage: `url(${BG1})` }}
      />

      {/* Center form */}
      <div className="w-full md:w-2/4 flex items-center justify-center bg-white px-6 py-12 shadow-lg">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">Readify</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition duration-300"
            >
              Login
            </button>

            <div className="text-center mt-4 text-sm">
              Don’t have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-blue-500 hover:underline"
              >
                Register
              </button>
              <br />
              <button
                onClick={() => navigate("/forgot-password")}
                className="mt-2 text-blue-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right background image */}
      <div
        className="w-1/4 bg-cover bg-center hidden md:block"
        style={{ backgroundImage: `url(${BG2})` }}
      />
    </div>
  );
}

export default Login;
