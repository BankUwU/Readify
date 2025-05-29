import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { db } from "../config/firebaseConfig";

function Achievement() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [userStats, setUserStats] = useState({});
  const [achievementsLoaded, setAchievementsLoaded] = useState(false);

  const ensureUserAchievementsExists = async (uid) => {
  const achRef = doc(db, "userAchievements", uid);
  const achSnap = await getDoc(achRef);

  if (!achSnap.exists()) {
    const globalAchievementsSnapshot = await getDocs(collection(db, "achievements"));

    const initialProgress = {};
    globalAchievementsSnapshot.forEach((doc) => {
      initialProgress[doc.id] = false;
    });

    await setDoc(achRef, { achievements: initialProgress });
  }
};


  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        alert("Please login to continue.");
        navigate("/login");
      } else {
        setUser(currentUser);

        // ✅ Ensure userAchievements/{uid} document exists
        await ensureUserAchievementsExists(currentUser.uid);

        const achList = await fetchAchievements();
        setAchievements(achList);
        await fetchUserProgress(currentUser.uid);
        setAchievementsLoaded(true);
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  // Real-time listener for user stats
  useEffect(() => {
    if (!user) return;

    const statsDocRef = doc(db, "users", user.uid, "stats", "progress");
    const unsubscribeStats = onSnapshot(statsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserStats(docSnap.data());
      } else {
        setUserStats({});
      }
    });

    return () => unsubscribeStats();
  }, [user]);

  // Fetch global achievements
  const fetchAchievements = async () => {
    const snapshot = await getDocs(collection(db, "achievements"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  // Fetch user completed achievements
  const fetchUserProgress = async (uid) => {
    const userDoc = await getDoc(doc(db, "userAchievements", uid));
    if (userDoc.exists()) {
      setUserProgress(userDoc.data().achievements || {});
    } else {
      setUserProgress({});
    }
  };

  // Mark achievement as completed in Firestore and local state
  const toggleAchievement = async (achievementId) => {
    const updated = {
      ...userProgress,
      [achievementId]: true,
    };
    setUserProgress(updated);
    await setDoc(
      doc(db, "userAchievements", user.uid),
      { achievements: updated },
      { merge: true }
    );
  };

  // Auto-complete achievements when progress reaches 100%
  useEffect(() => {
    if (!user || !achievementsLoaded) return;

    achievements.forEach((ach) => {
      const userValue = userStats[ach.id] || 0;
      const percent = Math.min((userValue / ach.target) * 100, 100);
      const isCompleted = userProgress[ach.id];
      if (percent === 100 && !isCompleted) {
        toggleAchievement(ach.id);
      }
    });
  }, [userStats, userProgress, achievements, user, achievementsLoaded]);

  return (
    <>
      <Header />
      <div className="p-10 min-h-[calc(100vh-60px)] ">
        <div className="flex items-center gap-3 mb-5">
          <img
            src="https://img.icons8.com/emoji/48/trophy-emoji.png"
            alt="trophy"
            className="w-10 h-10"
          />
          <h2 className="text-2xl font-bold m-0">Achievements</h2>
        </div>

        <div className="grid gap-4 bg-gray-300 p-5 rounded-xl">
          {achievements.map((ach) => {
            const userValue = userStats[ach.id] || 0;
            const percent = Math.min((userValue / ach.target) * 100, 100);
            const isCompleted = userProgress[ach.id];

            return (
              <div
                key={ach.id}
                className={`bg-white p-4 rounded-lg shadow flex flex-col gap-2 ${
                  isCompleted ? "border-l-8 border-green-400" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{ach.title}</h3>
                    <p className="text-sm text-gray-600">{ach.description}</p>
                  </div>
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-md ${
                      isCompleted
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {isCompleted ? "Completed" : `${Math.round(percent)}%`}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Achievement;
