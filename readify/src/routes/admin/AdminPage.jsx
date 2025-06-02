import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig"

function AdminPage() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const userList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(userList);
  };

  const changeRole = async (userId, newRole) => {
    await updateDoc(doc(db, "users", userId), { role: newRole });
    fetchUsers(); // Refresh user list
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <table className="min-w-full bg-white border rounded shadow">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Username</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="p-2">{user.displayName || user.username}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2 capitalize">{user.role || "user"}</td>
              <td className="p-2 space-x-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => changeRole(user.id, "admin")}
                >
                  Make Admin
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => changeRole(user.id, "user")}
                >
                  Revoke Admin
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;
