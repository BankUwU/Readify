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
    <div className="flex h-screen overflow-hidden">
      {/* Left Side with Animated Gradient */}
      <div className="w-1/2 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 animate-gradient-x flex flex-col justify-center items-center p-8 text-white">
        <h1 className="text-5xl font-bold mb-4 animate-bounce">Readify</h1>
        <p className="mb-4 text-lg">Already have an account?</p>
        <button
          className="px-6 py-2 border border-white text-white rounded hover:bg-white hover:text-blue-600 transition duration-300"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>

      {/* Right Side with Fade-in Form */}
      <div className="w-1/2 flex justify-center items-center p-8 bg-white animate-slide-in-right">
        <div className="w-full max-w-md">
          <form
            onSubmit={handleRegister}
            className="space-y-5 animate-fade-in-up"
          >
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">
              Create Account
            </h2>

            <div>
              <label className="block font-medium text-gray-600">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-600">Username</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-600">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-600">Re-enter password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="text-red-500">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300 disabled:opacity-50"
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
