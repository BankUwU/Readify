// components/BackButton.jsx
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="text-blue-600 font-medium hover:underline flex items-center"
    >
      <FiArrowLeft className="mr-2" /> Back
    </button>
  );
}

export default BackButton;
