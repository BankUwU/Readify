import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/header";
import { useState } from "react";
import BookLogPopup from "../components/BookLogPopup";
import { getAuth } from "firebase/auth";
import BookLogList from "../components/BookLogList";
import { FiPlus } from "react-icons/fi";


function BookInformation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogPopup, setShowLogPopup] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const book = location.state?.book;
  const [totalPagesRead, setTotalPagesRead] = useState(0);


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
         <div className="sticky top-[100px] self-start">
            <img
              src={book.booksCover}
              alt="Book Cover"
              className="w-[500px] h-[700px] object-cover rounded-2xl shadow-lg"
            />
          </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="text-md text-purple-700 mt-1">{book.category}</p>
          <p className="text-md text-gray-600">Created : {book.createDate}</p>
          {/* <p className="text-sm text-purple-700">{book.category}</p> */}
          <p className="text-md text-gray-600">Pages : {totalPagesRead} / {book.numberOfPage}</p>

          <div className="mt-4">
            <h2 className="font-semibold text-lg mb-1">Progress</h2>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full"
                style={{ width: `${book.progress || 0}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{book.progress || 0}% completed</p>
          </div>

          <div className="flex justify-end">
          <button
            onClick={() => setShowLogPopup(true)}
            className="flex items-center mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg  hover:bg-blue-700"
          >
            <FiPlus className="mr-2" /> Add Logs
          </button>
          </div>

          <BookLogList 
            userId={user.uid} 
            bookId={book.id} 
            setTotalPagesRead={setTotalPagesRead}
          />

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
