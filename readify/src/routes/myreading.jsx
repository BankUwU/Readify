import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import ReadingPopup from "../components/AddReadingPopup";
import Header from "../components/header";
import { db } from "../config/firebaseConfig";
import { useNavigate } from "react-router-dom";


function MyReading() {
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState(null);
  const [readingList, setReadingList] = useState([]);
  const [selectedReading, setSelectedReading] = useState(null);
  const navigate = useNavigate();


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

  const handleDelete = async (readingId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "myreading", readingId));
      fetchReadingList(user.uid);
    } catch (error) {
      console.error("Failed to delete reading:", error);
      alert("Error deleting the book. Try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="p-5 min-h-[calc(100vh-60px)]">
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
              <div
                key={book.id}
                onClick={() => navigate("/book-information", { state: { book } })}
                className="bg-white p-4 rounded-xl shadow relative cursor-pointer hover:shadow-lg transition"
              >
                <img
                  src={book.booksCover}
                  alt="Book Cover"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <h3 className="mt-2 font-bold text-lg">{book.title || "Untitled"}</h3>
                <p className="text-gray-600">📚 {book.category}</p>
                <p className="text-gray-600">📄 Pages: {book.numberOfPage}</p>
                <p className="text-sm text-gray-400">📅 Date: {book.createDate}</p>
                <p className="text-sm text-gray-500">📈 Progress: {book.progress || 0}%</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(book.id);
                  }}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <FiTrash2 size={20} />
                </button>
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

      {/* {selectedReading && (
        <BookLogPopup
          reading={selectedReading}
          user={user}
          onClose={() => setSelectedReading(null)}
          refresh={() => fetchReadingList(user.uid)}
        />
      )} */}
    </>
  );
}

export default MyReading;
