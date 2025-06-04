// [Imports remain unchanged]
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
import ReviewSearchBar from "../components/ReviewSearchBar";
import { auth, db } from "../config/firebaseConfig";

function Home() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [readingList, setReadingList] = useState([]);
  const [bookreview, setBookReview] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortMode, setSortMode] = useState("default");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchReadingList() {
    try {
      const snapshot = await getDocs(collection(db, "users", user.uid, "myreading"));
      const booksArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(0), // Convert Firestore Timestamp to JS Date
      }));

      // Sort by date (oldest first)
      booksArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setReadingList(booksArray);
    } catch (error) {
      console.error("Error fetching reading list:", error);
    }
  }


    async function fetchBookReviews() {
      try {
        const querySnapshot = await getDocs(collection(db, "allreview"));
        const reviewsArray = querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
            photoURL: data.userPhoto || null,
            createdAt: (data.createdAt && typeof data.createdAt.toDate === "function")
  ? data.createdAt.toDate()
  : new Date(0),

          };
        });

        setBookReview(reviewsArray);
      } catch (error) {
        console.error("Error fetching book reviews:", error);
      }
    }

    const fetchFavorites = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users", user.uid, "favorites"));
        const favoriteIds = snapshot.docs.map((doc) => doc.id);
        const updatedFavorites = bookreview.map((review) => favoriteIds.includes(review.id));
        setFavorites(updatedFavorites);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchBookReviews();

    if (user) {
      fetchReadingList();
      fetchFavorites();
    }
  }, [user]);

  useEffect(() => {
    let filtered = [...bookreview];

    if (selectedCategory !== "All") {
      filtered = filtered.filter((review) => review.category === selectedCategory);
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const queryParts = query.split(",").map((part) => part.trim()).filter((part) => part.length > 0);

      filtered = filtered.filter((review) => {
        const title = review.title?.toLowerCase() || "";
        const createdBy = review.createdBy?.toLowerCase() || "";

        if (queryParts.length === 2) {
          return (
            (title.includes(queryParts[0]) && createdBy.includes(queryParts[1])) ||
            (title.includes(queryParts[1]) && createdBy.includes(queryParts[0]))
          );
        } else if (queryParts.length === 1) {
          return title.includes(queryParts[0]) || createdBy.includes(queryParts[0]);
        } else {
          return false;
        }
      });
    }

    if (sortMode === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortMode === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredReviews(filtered);
  }, [searchQuery, selectedCategory, bookreview, sortMode]);

  const toggleFavorite = async (index) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const selectedReview = filteredReviews[index];
    const updatedFavorites = [...favorites];
    const actualIndex = bookreview.findIndex((r) => r.id === selectedReview.id);

    updatedFavorites[actualIndex] = !updatedFavorites[actualIndex];
    setFavorites(updatedFavorites);

    if (updatedFavorites[actualIndex]) {
      await addToFavorites(user.uid, selectedReview);
    } else {
      await removeFromFavorites(user.uid, selectedReview.id);
    }
  };

  const [readingPage, setReadingPage] = useState(0);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(readingList.length / itemsPerPage);
  const paginatedReadingList = readingList.slice(
    readingPage * itemsPerPage,
    (readingPage + 1) * itemsPerPage
  );

  return (
    <>
      <Header />
      <div className="p-5 w-[1400px] mx-auto min-w-[1200px]">
        {showPopup && (
          <ReadingPopup
            user={user}
            onClose={() => setShowPopup(false)}
            onReadingAdded={async () => {
              const snapshot = await getDocs(collection(db, "users", user.uid, "myreading"));
              const booksArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(0),
              }));

              booksArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
            {totalPages > 1 && readingPage > 0 && (
              <button
                onClick={() => setReadingPage((prev) => Math.max(prev - 1, 0))}
                className="absolute left-2 top-1/2 text-gray-500 -translate-y-1/2 bg-gray-300 rounded-full p-[7px] hover:bg-gray-400"
              >
                <FiChevronLeft size={20} />
              </button>
            )}

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

            {totalPages > 1 && readingPage < totalPages - 1 && (
              <button
                onClick={() => setReadingPage((prev) => Math.min(prev + 1, totalPages - 1))}
                className="absolute right-2 top-1/2 text-gray-500 -translate-y-1/2 bg-gray-300 rounded-full p-[7px] hover:bg-gray-400"
              >
                <FiChevronRight size={20} />
              </button>
            )}

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

        <div className="mt-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Reviews</h3>
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <ReviewSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} className="w-[600px]" />

            <label htmlFor="category" className="text-gray-700 font-medium">Filter By :</label>
            <select
              id="category"
              className="border border-gray-300 rounded-md px-4 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-fiction</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Romance">Romance</option>
              <option value="Historail">Historial</option>
              <option value="Others">Others</option>
            </select>

            <button
              onClick={() =>
                setSortMode((prev) => (prev === "newest" ? "default" : "newest"))
              }
              className={`px-4 py-1 rounded-md border text-sm transition duration-200 ${
                sortMode === "newest"
                  ? "bg-gray-700 text-white"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Newest
            </button>

            <button
              onClick={() =>
                setSortMode((prev) => (prev === "oldest" ? "default" : "oldest"))
              }
              className={`px-4 py-1 rounded-md border text-sm transition duration-200 ${
                sortMode === "oldest"
                  ? "bg-gray-700 text-white"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Oldest
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mt-4 min-h-[260px]">
          {filteredReviews.length === 0 ? (
            <div className="col-span-4 text-center text-gray-600 text-lg py-10">
              No reviews found.
            </div>
          ) : (
            filteredReviews.map((review, index) => (
              <Bookreview
                key={review.id}
                review={review}
                isFavorite={favorites[bookreview.findIndex((r) => r.id === review.id)]}
                onToggleFavorite={() => toggleFavorite(index)}
                onClick={() => setSelectedReview(review)}
              />
            ))
          )}

          {selectedReview && (
            <AllReviewPopup review={selectedReview} onClose={() => setSelectedReview(null)} />
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
