import { useEffect, useState } from "react";
import { collection, getDoc, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import Header from "../../components/header";

function AdminAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", target: 0, trackKey: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);



  const fetchAchievements = async () => {
  setLoading(true);
  try {
    const snapshot = await getDocs(collection(db, "achievements"));
    setAchievements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (err) {
    console.error("Failed to fetch achievements:", err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchAchievements();
  }, []);

    const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === "target" ? Number(value) : value }));
  };

  const handleAdd = async () => {
  if (!form.title.trim()) return alert("Title required");

  setLoading(true);
  try {
    const newDoc = await addDoc(collection(db, "achievements"), form);

    const userSnapshot = await getDocs(collection(db, "users"));

    const promises = userSnapshot.docs.map(async (userDoc) => {
      const userId = userDoc.id;
      const userAchRef = doc(db, "userAchievements", userId);
      const achSnap = await getDoc(userAchRef);

      if (achSnap.exists()) {
        const data = achSnap.data();
        const updated = {
          ...data.achievements,
          [newDoc.id]: false,
        };
        await updateDoc(userAchRef, { achievements: updated });
      } else {
        await setDoc(userAchRef, {
          achievements: {
            [newDoc.id]: false,
          },
        });
      }
    });

    await Promise.all(promises);
    setForm({ title: "", description: "", target: 0, trackKey: "" });
    fetchAchievements();
  } catch (err) {
    console.error("Failed to add achievement:", err);
  } finally {
    setLoading(false);
  }
};


  const handleEdit = (achievement) => {
  setEditId(achievement.id);
  setForm({
    title: achievement.title,
    description: achievement.description,
    target: achievement.target,
    trackKey: achievement.trackKey || "", 
  });
};


  const handleUpdate = async () => {
  if (!form.title.trim()) return alert("Title required");

  setLoading(true);
  try {
    const docRef = doc(db, "achievements", editId);
    await updateDoc(docRef, form);
    setEditId(null);
    setForm({ title: "", description: "", target: 0, trackKey: "" });
    fetchAchievements();
  } catch (err) {
    console.error("Failed to update achievement:", err);
  } finally {
    setLoading(false);
  }
};


  const handleDelete = (id) => {
  setDeleteTargetId(id);
  setShowDeleteModal(true);
};

  const confirmDelete = async () => {
  if (!deleteTargetId) return;
  setDeleteLoading(true);
  try {
    await deleteDoc(doc(db, "achievements", deleteTargetId));
    fetchAchievements();
  } catch (err) {
    console.error("Failed to delete achievement:", err);
  } finally {
    setDeleteLoading(false);
    setShowDeleteModal(false);
    setDeleteTargetId(null);
  }
};



  return (
    
    <div>
     <Header />
     {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-2">Confirm Deletion</h2>
            <p className="mb-5">Are you sure you want to delete this achievement?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className={`px-4 py-2 rounded-lg text-white transition duration-200 ${
                  deleteLoading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

     <div className="p-10 min-h-[calc(100vh-60px)] ">
      <h1 className="text-2xl font-bold mb-4">Manage Achievements</h1>

      <div className="mb-5 space-y-2">
        <div className="flex flex-row gap-2">
        <label className="font-medium">Track Key:</label>
        <div className="flex gap-4">
            {["totalRead", "totalReviews"].map((key) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                type="radio"
                name="trackKey"
                value={key}
                checked={form.trackKey === key}
                onChange={handleChange}
                className="appearance-none w-3 h-3 rounded-full border border-gray-400 checked:bg-blue-600 checked:border-blue-600"
                />
                <span className="text-sm">{key}</span>
            </label>
            ))}
        </div>
        </div>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="target"
          placeholder="Target value"
          value={form.target}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {editId ? (
        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            className="bg-blue-500 px-4 py-2 mt-2 rounded text-white  hover:bg-blue-600 transition duration-200"
          >
            Update Achievement
          </button>
          </div>
        ) : (
          <div className="flex justify-end">
            <button
                onClick={handleAdd}
                className="bg-blue-500 px-4 py-2 mt-2 rounded text-white  hover:bg-blue-600 transition duration-200"
            >
                Add Achievement
            </button>
            </div>
        )}
      </div>

    <div className="rounded-lg overflow-hidden shadow border">
      <table className="min-w-full border shadow">
        <thead>
          <tr className="bg-gray-200 rounded-full">
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Description</th>
            <th className="p-2">Target</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {achievements.map((ach) => (
            <tr key={ach.id} className="border-t">
              <td className="p-2">{ach.title}</td>
              <td className="p-2">{ach.description}</td>
              <td className="p-2 text-center">{ach.target}</td>
              <td className="p-2 space-x-2 text-center">
                <button
                  onClick={() => handleEdit(ach)}
                  className="bg-blue-500 px-2 py-1 rounded-lg text-white  hover:bg-blue-600 transition duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ach.id)}
                  className="bg-red-500 px-2 py-1 rounded-lg text-white  hover:bg-red-600 transition duration-200"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {achievements.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                No achievements found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
      </div>
    </div>
  );
}

export default AdminAchievements;
