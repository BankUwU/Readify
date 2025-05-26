import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchReadingList() {
      try {
        const querySnapshot = await getDocs(collection(db, "reviews"));
        const booksArray = [];
        querySnapshot.forEach((doc) => {
          booksArray.push({ id: doc.id, ...doc.data() });
        });
        setReadingList(booksArray);
      } catch (error) {
        console.error("Error fetching reading list:", error);
      }
    }

    async function fetchBookReviews() {
      try {
        const querySnapshot = await getDocs(collection(db, "allreviews"));
        const reviewsArray = [];
        querySnapshot.forEach((doc) => {
          reviewsArray.push({ id: doc.id, ...doc.data() });
        });
        setBookReview(reviewsArray);
      } catch (error) {
        console.error("Error fetching book reviews:", error);
      }
    }

    fetchReadingList();
    fetchBookReviews();
  }, []);

  const toggleFavorite = (index) => {
    const updatedFavorites = [...favorites];
    updatedFavorites[index] = !updatedFavorites[index];
    setFavorites(updatedFavorites);
  };

  return (
    <>
      <Header />
      <div className="p-5">
        {user ? (
          <>
            <h2 className="text-xl font-semibold">Hello {user.displayName} :)</h2>

            <div className="mt-8">
              <h3 className="text-lg font-bold">
                <div className="text-black">My Reading</div>
              </h3>
              <div className="flex flex-wrap gap-4 p-4 border border-white rounded-lg bg-[rgba(205,209,228,0.5)] overflow-x-auto">
                <MyReadingList readingList={readingList} />
                <Plus />
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold">Review</h3>
              {bookreview.map((_, index) => (
                <div
                  key={index}
                  className="relative flex items-start border border-black rounded-lg p-3 mb-4"
                >
                  <Bookreview bookreview={bookreview} />
                  <button
                    className="absolute top-3 right-3 bg-transparent border-none cursor-pointer"
                    onClick={() => toggleFavorite(index)}
                    aria-label="Favorite"
                  >
                    <FaStar
                      size={20}
                      color={favorites[index] ? "#000" : "#e0e0e0"}
                      style={{ stroke: "#000", strokeWidth: 1 }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <h2 className="text-lg font-semibold">Please Login</h2>
        )}
      </div>
    </>
  );
}

export default Home;
