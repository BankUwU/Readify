import { getAuth, onAuthStateChanged } from "firebase/auth"; // ใช้ firebase auth
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ต้องมี react-router-dom
import Header from "../components/header";

function Achievement() {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        alert("Please login to continue.");
        navigate("/login");
      }
    });
  }, []);

  return (
    <>
      <Header />
      <div className="bg-[#eaf6ff] p-10 min-h-[calc(100vh-60px)] font-['Segoe_UI']">
        <div className="flex items-center gap-3 mb-5">
          <img
            src="https://img.icons8.com/emoji/48/trophy-emoji.png"
            alt="trophy"
            className="w-10 h-10"
          />
          <h2 className="text-2xl font-bold m-0">Achievements</h2>
        </div>

        <div className="mb-5">
          <button className="mr-2 px-4 py-2 bg-white rounded-md font-semibold shadow hover:bg-gray-100 transition">
            Show Done
          </button>
          <button className="mr-2 px-4 py-2 bg-white rounded-md font-semibold shadow hover:bg-gray-100 transition">
            Show not done
          </button>
        </div>

        <div className="bg-gray-300 p-5 rounded-xl">
          <div className="bg-white h-20 mb-4 rounded-lg"></div>
          <div className="bg-white h-20 mb-4 rounded-lg"></div>
          <div className="bg-white h-20 mb-4 rounded-lg"></div>
          <div className="bg-white h-20 mb-4 rounded-lg"></div>
        </div>
      </div>
    </>
  );
}

export default Achievement;
