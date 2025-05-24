import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CheckEmail() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/login");
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-white to-purple-100 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-fade-in">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Check Your Email</h1>
        <p className="text-gray-700 text-lg mb-2">
          We've sent a verification link to your email address.
        </p>
        <p className="text-gray-500 mb-6">
          Please verify your account to continue.
        </p>

        <div className="text-blue-600 font-semibold text-xl mb-4">
          Redirecting in{" "}
          <span className="animate-pulse font-bold text-2xl">{countdown}</span> second{countdown !== 1 ? "s" : ""}
        </div>

        <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto animate-pulse" />
      </div>
    </div>
  );
}

export default CheckEmail;
