import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/header";
import { useState } from "react";
import BookLogPopup from "../components/BookLogPopup";
import { getAuth } from "firebase/auth";
import BookLogList from "../components/BookLogList";


function BookInformation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogPopup, setShowLogPopup] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const book = location.state?.book;

  if (!book) {
    return (
      <div className="p-6">
        <p>Book not found. <button onClick={() => navigate(-1)} className="text-blue-500 underline">Go back</button></p>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-0  w-full z-10">
        <Header />
      </div>
      <div className="p-12 mt-12 flex flex-col md:flex-row gap-8">
         <div className="sticky top-24 self-start">
            <img
              src={book.booksCover}
              alt="Book Cover"
              className="w-[600px] h-[850px] object-cover rounded-2xl shadow-lg"
            />
          </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="text-gray-600 mt-2">📚 {book.category}</p>
          <p className="text-gray-600">📄 Pages: {book.numberOfPage}</p>
          <p className="text-gray-500 text-sm mt-1">📅 Added on: {book.createDate}</p>

          <div className="mt-4">
            <h2 className="font-semibold text-lg mb-1">Progress</h2>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-600 h-4 rounded-full"
                style={{ width: `${book.progress || 0}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-700 mt-1">{book.progress || 0}% completed</p>
          </div>

          <div className="flex justify-end">
          <button
            onClick={() => setShowLogPopup(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded  hover:bg-blue-700"
          >
            ➕ Add Log
          </button>
          </div>

          <BookLogList userId={user.uid} bookId={book.id} />

        </div>

        {showLogPopup && user && (
        <BookLogPopup
          reading={book}
          user={user}
          onClose={() => setShowLogPopup(false)}
          // refresh={() => window.location.reload()}
        />
      )}

      </div>
    </>
  );
}

export default BookInformation;
