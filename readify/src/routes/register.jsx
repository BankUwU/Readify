import { sendEmailVerification } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/registerapi";

function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    const result = await registerUser(email, username, password);

    if (result.success) {
      await sendEmailVerification(result.user);
      navigate("/check-email");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen">
      {/* Left Side */}
      <div className="w-1/2 bg-blue-100 flex flex-col justify-center items-center p-8">
        <h1 className="text-4xl font-bold mb-4">Readify</h1>
        <p className="mb-4">Already have an account?</p>
        <button
          className="px-6 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>

      {/* Right Side (Form) */}
      <div className="w-1/2 flex justify-center items-center p-8">
        <div className="w-full max-w-md">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded px-4 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-medium">Username</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-4 py-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-medium">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-4 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-medium">Re-enter password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-4 py-2"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="text-red-500">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;