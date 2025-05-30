import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import ReadingPopup from "../components/AddReadingPopup";
import Header from "../components/header";
import { db } from "../config/firebaseConfig";

function MyReading() {
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState(null);
  const [readingList, setReadingList] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchReadingList(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchReadingList = async (uid) => {
    const snapshot = await getDocs(collection(db, "users", uid, "myreading"));
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setReadingList(list);
  };

  const handleReadingAdded = () => {
    fetchReadingList(user.uid);
    setShowPopup(false);
  };

  return (
    <>
      <Header />
      <div className="p-5 min-h-[calc(100vh-60px)] bg-[#eaf6ff] font-['Segoe_UI']">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Reading List</h2>
          <button
            onClick={() => setShowPopup(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiPlus className="mr-2" /> Add Reading
          </button>
        </div>

        {readingList.length === 0 ? (
          <p>No readings yet.</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {readingList.map((book) => (
              <div key={book.id} className="bg-white p-4 rounded-xl shadow">
                <img src={book.booksCover} className="w-full h-64 object-cover rounded-lg" />
                <h3 className="mt-2 font-bold text-lg">{book.category}</h3>
                <p className="text-gray-600">Pages: {book.numberOfPage}</p>
                <p className="text-sm text-gray-400">Date: {book.createDate}</p>
                <p className="text-sm text-gray-500">Progress: {book.progress}%</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showPopup && (
        <ReadingPopup
          user={user}
          onClose={() => setShowPopup(false)}
          onReadingAdded={handleReadingAdded}
        />
      )}
    </>
  );
}

export default MyReading;
