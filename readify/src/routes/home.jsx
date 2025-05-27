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
       
          <>
            {/* <h2 className="text-xl font-semibold">Hello {user.displayName} :)</h2> */}

            <div className="mt-4">
              <h3 className="text-lg font-bold">
                <div className="text-black text-3xl ml-3">
                  {user?.displayName ? `${user.displayName}'s Readings` : "My Readings"}
                </div>
              </h3>
              <div className="flex flex-wrap border border-white rounded-3xl bg-blue-900 overflow-x-auto mt-2">
                <Plus />
                <MyReadingList readingList={readingList} />
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-3xl font-bold ml-3">Reviews</h3>
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
        
      </div>
    </>
  );
}

export default Home;
