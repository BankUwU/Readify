import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Bookreview from "../components/bookreview";
import Header from "../components/header";
import MyReadingList from "../components/myreadinglist";
import Plus from "../components/plus";
import { auth, db } from "../config/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";

function Home() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([false, false]);
  const [readingList, setReadingList] = useState([]);
  const [bookreview, setBookReview] = useState([]);
  const [userPhotos, setUserPhotos] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // async function fetchReadingList() {
    //   try {
    //     const querySnapshot = await getDocs(collection(db, "reviews"));
    //     const booksArray = [];
    //     querySnapshot.forEach((doc) => {
    //       booksArray.push({ id: doc.id, ...doc.data() });
    //     });
    //     setReadingList(booksArray);
    //   } catch (error) {
    //     console.error("Error fetching reading list:", error);
    //   }
    // }

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



    // fetchReadingList();
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
              <div className="flex flex-wrap rounded-3xl bg-blue-900 overflow-x-auto mt-2">
                <Plus />
                {/* <MyReadingList readingList={readingList} /> */}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-3xl font-bold ml-3">Reviews</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
              {bookreview.map((review, index) => (
              <div 
                key={review.id} 
                className=" flex items-start border bg-blue-100 rounded-3xl p-3 mt-2 mb-4">

              <Bookreview 
                review={review}
                isFavorite={favorites[index]}
                onToggleFavorite={() => toggleFavorite(index)}/>
              </div>
             
            ))}

            </div>
            </div>
          </>
        
      </div>
    </>
  );
}

export default Home;
