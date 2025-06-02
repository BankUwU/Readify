import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

function AdminAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", target: 0 });
  const [editId, setEditId] = useState(null);

  // Fetch all achievements
  const fetchAchievements = async () => {
    const snapshot = await getDocs(collection(db, "achievements"));
    setAchievements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === "target" ? Number(value) : value }));
  };

  // Add new achievement
  const handleAdd = async () => {
    if (!form.title.trim()) return alert("Title required");
    await addDoc(collection(db, "achievements"), form);
    setForm({ title: "", description: "", target: 0 });
    fetchAchievements();
  };

  // Start editing an achievement
  const handleEdit = (achievement) => {
    setEditId(achievement.id);
    setForm({ title: achievement.title, description: achievement.description, target: achievement.target });
  };

  // Save update
  const handleUpdate = async () => {
    if (!form.title.trim()) return alert("Title required");
    const docRef = doc(db, "achievements", editId);
    await updateDoc(docRef, form);
    setEditId(null);
    setForm({ title: "", description: "", target: 0 });
    fetchAchievements();
  };

  // Delete achievement
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this achievement?")) return;
    await deleteDoc(doc(db, "achievements", id));
    fetchAchievements();
  };

  return (
    <div className="p-5 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Achievements CRUD</h1>

      <div className="mb-5 space-y-2">
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
          <button
            onClick={handleUpdate}
            className="bg-yellow-500 px-4 py-2 rounded text-white"
          >
            Update Achievement
          </button>
        ) : (
          <button
            onClick={handleAdd}
            className="bg-green-500 px-4 py-2 rounded text-white"
          >
            Add Achievement
          </button>
        )}
      </div>

      <table className="min-w-full border rounded shadow">
        <thead>
          <tr className="bg-gray-200">
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
                  className="bg-blue-500 px-2 py-1 rounded text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ach.id)}
                  className="bg-red-500 px-2 py-1 rounded text-white"
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
  );
}

export default AdminAchievements;
