import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

function BookLogList({ userId, bookId, setTotalPagesRead }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logRef = collection(db, "users", userId, "myreading", bookId, "logs");
        const q = query(logRef, orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);

        const logsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLogs(logsData);

        const totalRead = logsData.reduce((sum, log) => sum + (log.pagesRead || 0), 0);
        setTotalPagesRead(totalRead);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      }
    };

    fetchLogs();
  }, [userId, bookId, setTotalPagesRead]);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Reading Logs</h3>
      {logs.length === 0 ? (
        <p className="text-gray-500">No logs yet.</p>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="border rounded-xl p-4 bg-white shadow-md border-l-3 border-gray-100 ">
              <p className="text-gray-800 font-medium"> {log.date}</p>
              <p className="text-gray-800">Pages Read : {log.pagesRead}</p>
              {log.note && <p className="text-gray-800">Note : {log.note}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookLogList;
