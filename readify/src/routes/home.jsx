import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { addToFavorites, removeFromFavorites } from "../api/favorites";
import ReadingPopup from "../components/AddReadingPopup";
import AllReviewPopup from "../components/AllReviewPopup";
import Bookreview from "../components/bookreview";
import Header from "../components/header";
import MyReadingList from "../components/myreadinglist";
import Plus from "../components/plus";
import { auth, db } from "../config/firebaseConfig";

function Home() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([false, false]);
  const [readingList, setReadingList] = useState([]);
  const [bookreview, setBookReview] = useState([]);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchReadingList() {
      if (!user) return;
      try {
        const snapshot = await getDocs(collection(db, "users", user.uid, "myreading"));
        const booksArray = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setReadingList(booksArray);
      } catch (error) {
        console.error("Error fetching reading list:", error);
      }
    }

    async function fetchBookReviews() {
      try {
        const querySnapshot = await getDocs(collection(db, "allreview"));
        const reviewsArray = [];

        for (const docSnap of querySnapshot.docs) {
          const data = docSnap.data();
          const review = {
            id: docSnap.id,
            ...data,
            photoURL: data.userPhoto || null,
          };
          reviewsArray.push(review);
        }

        setBookReview(reviewsArray);
      } catch (error) {
        console.error("Error fetching book reviews:", error);
      }
    }

    const fetchFavorites = async () => {
      if (!user) return;
      try {
        const snapshot = await getDocs(collection(db, "users", user.uid, "favorites"));
        const favoriteIds = snapshot.docs.map((doc) => doc.id);

        const updatedFavorites = bookreview.map((review) => favoriteIds.includes(review.id));
        setFavorites(updatedFavorites);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    if (user) {
      fetchReadingList();
      fetchBookReviews();
      fetchFavorites();
    }
  }, [user]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      try {
        const snapshot = await getDocs(collection(db, "users", user.uid, "favorites"));
        const favoriteIds = snapshot.docs.map((doc) => doc.id);
        const updatedFavorites = bookreview.map((review) => favoriteIds.includes(review.id));
        setFavorites(updatedFavorites);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
    if (user) fetchFavorites();
  }, [bookreview]);

  const toggleFavorite = async (index) => {
    const selectedReview = bookreview[index];
    const updatedFavorites = [...favorites];
    updatedFavorites[index] = !updatedFavorites[index];
    setFavorites(updatedFavorites);

    if (updatedFavorites[index]) {
      await addToFavorites(user.uid, selectedReview);
    } else {
      await removeFromFavorites(user.uid, selectedReview.id);
    }
  };

  const [readingPage, setReadingPage] = useState(0);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(readingList.length / itemsPerPage);
  const paginatedReadingList = readingList.slice(
    readingPage * itemsPerPage,
    (readingPage + 1) * itemsPerPage
  );

  return (
    <>
      <Header />
      <div className="p-5 w-[1200px] mx-auto min-w-[1200px]">
        {showPopup && (
          <ReadingPopup
            user={user}
            onClose={() => setShowPopup(false)}
            onReadingAdded={async () => {
              const snapshot = await getDocs(collection(db, "users", user.uid, "myreading"));
              const booksArray = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
              setReadingList(booksArray);
            }}
          />
        )}

        <div className="mt-4">
          <h3 className="text-2xl font-bold text-slate-800 ml-2">
            {user?.displayName ? `${user.displayName}'s Readings` : "My Readings"}
          </h3>

          <div
            className="relative rounded-2xl bg-blue-100 mt-2 p-4 min-h-[200px] overflow-hidden"
            style={{ boxShadow: "0 10px 15px -5px rgba(0, 0, 0, 0.2)" }}
          >
            {/* Left Arrow */}
            {totalPages > 1 && readingPage > 0 && (
              <button
                onClick={() => setReadingPage((prev) => Math.max(prev - 1, 0))}
                className="absolute left-2 top-1/2 text-gray-500 -translate-y-1/2 bg-gray-300 rounded-full p-[7px] hover:bg-gray-400"
              >
                <FiChevronLeft size={20} />
              </button>
            )}

            {/* Content */}
            <div className="flex items-center ml-4 overflow-x-auto w-full max-w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <Plus
                onClick={() => {
                  if (!user) {
                    navigate("/login");
                  } else {
                    setShowPopup(true);
                  }
                }}
              />
              <MyReadingList readingList={paginatedReadingList} />
            </div>

            {/* Right Arrow */}
            {totalPages > 1 && readingPage < totalPages - 1 && (
              <button
                onClick={() => setReadingPage((prev) => Math.min(prev + 1, totalPages - 1))}
                className="absolute right-2 top-1/2 text-gray-500 -translate-y-1/2 bg-gray-300 rounded-full p-[7px] hover:bg-gray-400"
              >
                <FiChevronRight size={20} />
              </button>
            )}

            {/* Pagination Dots */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 cursor-pointer mt-4">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-[9px] h-[9px] rounded-full ${
                      i === readingPage ? "bg-black" : "bg-gray-300"
                    }`}
                    onClick={() => setReadingPage(i)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 px-0">
          <h3 className="text-2xl font-bold text-slate-800">Reviews</h3>
          <div className="grid grid-cols-4 gap-6 mt-4">
            {bookreview.map((review, index) => (
              <Bookreview
                key={review.id}
                review={review}
                isFavorite={favorites[index]}
                onToggleFavorite={() => toggleFavorite(index)}
                onClick={() => setSelectedReview(review)}
              />
            ))}
          </div>
        </div>

        {selectedReview && (
          <AllReviewPopup review={selectedReview} onClose={() => setSelectedReview(null)} />
        )}
      </div>
    </>
  );
}

export default Home;
