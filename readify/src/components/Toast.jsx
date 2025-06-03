import { useEffect } from "react";

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-7 py-4 rounded-xl shadow-lg text-black text-sm ${
        type === "success" ? "bg-white" : "bg-red-600"
      }`}
    >
      {message}
    </div>
  );
}

export default Toast;
