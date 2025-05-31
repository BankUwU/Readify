import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

function BookLogList({ userId, bookId }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logRef = collection(db, "users", userId, "myreading", bookId, "logs");
        const q = query(logRef, orderBy("date", "desc")); // optional: order by date
        const querySnapshot = await getDocs(q);

        const logsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLogs(logsData);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      }
    };

    fetchLogs();
  }, [userId, bookId]);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Reading Logs</h3>
      {logs.length === 0 ? (
        <p className="text-gray-500">No logs yet.</p>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="border rounded-md p-4 bg-gray-50 shadow-sm">
              <p><strong>Date:</strong> {log.date}</p>
              <p><strong>Pages Read:</strong> {log.pagesRead}</p>
              {log.note && <p><strong>Note:</strong> {log.note}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookLogList;
