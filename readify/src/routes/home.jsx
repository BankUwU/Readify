import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Bookreview from "../components/bookreview";
import Header from "../components/header";
import MyReadingList from "../components/myreadinglist";
import Plus from "../components/plus";
import { auth, db } from "../config/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ReadingPopup from "../components/AddReadingPopup";

function Home() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([false, false]);
  const [readingList, setReadingList] = useState([]);
  const [bookreview, setBookReview] = useState([]);
  const [userPhotos, setUserPhotos] = useState({});
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

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
      const review = { id: docSnap.id, ...data };

      // Fetch user's photoURL
      if (review.createdBy) {
        const userRef = doc(db, "users", review.createdBy);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          review.photoURL = userData.photoURL || null;
        }
      }

      reviewsArray.push(review);
    }

    setBookReview(reviewsArray);
  } catch (error) {
    console.error("Error fetching book reviews:", error);
  }
}



    fetchReadingList();
    fetchBookReviews();
  }, [user]);

  const toggleFavorite = (index) => {
    const updatedFavorites = [...favorites];
    updatedFavorites[index] = !updatedFavorites[index];
    setFavorites(updatedFavorites);
  };

  return (
    <>
      <Header />
      <div className="p-5">
        {showPopup && (
          <ReadingPopup
            user={user}
            onClose={() => setShowPopup(false)}
            onReadingAdded={() => {
              // Refetch the list
              const fetchReadingList = async () => {
                const snapshot = await getDocs(collection(db, "users", user.uid, "myreading"));
                const booksArray = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setReadingList(booksArray);
              };
              fetchReadingList();
            }}
          />
        )}

       
          <>

            <div className="mt-4">
              <h3 className="text-lg font-bold">
                <div className="text-2xl ml-3 text-slate-800">
                  {user?.displayName ? `${user.displayName}'s Readings` : "My Readings"}
                </div>
              </h3>
              <div className="flex flex-wrap rounded-2xl bg-blue-100 overflow-x-auto mt-2"
              style={{ boxShadow: '0 10px 15px -5px rgba(0, 0, 0, 0.2)' }}>
                <Plus onClick={() => {
                  if (!user) {
                    navigate("/login");
                  } else {
                    setShowPopup(true);
                  }
                }} />

                <MyReadingList readingList={readingList} />
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-bold ml-3 text-slate-800">Reviews</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4 ">
              {bookreview.map((review, index) => (
             <Bookreview 
                review={review}
                isFavorite={favorites[index]}
                onToggleFavorite={() => toggleFavorite(index)}/>
            ))}

            </div>
            </div>
          </>
        
      </div>
    </>
  );
}

export default Home;
