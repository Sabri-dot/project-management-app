import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FiUser, FiTrash2, FiClock } from "react-icons/fi";
import { io } from "socket.io-client";

function ActivityLogs() {
  const token = localStorage.getItem("token");

  const socketRef = useRef(null);

  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  const [toast, setToast] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  /* ================= FETCH ================= */
  const fetchLogs = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/activity-logs",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setLogs(res.data);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  /* ================= SOCKET ================= */
  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("new_activity_log", (newLog) => {
      setLogs((prev) => [newLog, ...prev]);
    });

    return () => socketRef.current.disconnect();
  }, []);

  const showToast = (type, message) => {
  setTimeout(() => {
    setToast({ type, message });
  }, 10);

  setTimeout(() => {
    setToast(null);
  }, 4500);
};
  /* ================= DELETE ================= */
const handleDelete = async () => {
  try {
    await axios.delete(
      `http://localhost:5000/api/admin/activity-logs/${deleteId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setShowDelete(false);

    setLogs((prev) => prev.filter((l) => l.id !== deleteId));

    showToast("success", "Activity log deleted successfully");

    setDeleteId(null);

  } catch (err) {
    showToast("error", "Delete failed");
  }
};

  /* ================= FILTER ================= */
  const filteredLogs = logs.filter((log) => {
    return (
      log.full_name?.toLowerCase().includes(search.toLowerCase()) &&
      (actionFilter
        ? log.action?.toLowerCase().includes(actionFilter.toLowerCase())
        : true)
    );
  });

  /* ================= GROUP ================= */
  const groupByDate = (data) => {
    return data.reduce((acc, item) => {
      const date = new Date(item.created_at).toDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});
  };

  const grouped = groupByDate(filteredLogs);

  return (
    <div className="container-fluid p-4">

   {toast?.message && (
  <div className={`toast ${toast.type}`}>
    {toast.message}
  </div>
)}

      {/* HEADER */}
      <div className="header">
        <h2>Activity Logs 📜</h2>

        <div className="filters">
          <input
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input
            placeholder="Filter action..."
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          />
        </div>
      </div>

      {/* LIST */}
      {Object.keys(grouped).map((date) => (
        <div key={date} className="date-group">

          <div className="date-title">{date}</div>

          <div className="card-ui">

            {grouped[date].map((log) => (
              <div
                key={log.id}
                className="log-row"
                onClick={() => setSelectedLog(log)}
              >

                <div className="user-badge">
                  <FiUser />
                  {log.full_name}
                </div>

                <div className="action">{log.action}</div>

                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(log.id);
                    setShowDelete(true);
                  }}
                >
                  <FiTrash2 size={18} />
                </button>

              </div>
            ))}

          </div>
        </div>
      ))}

      {/* ================= DELETE MODAL ================= */}
      {showDelete && (
        <div className="modal">
          <div className="modal-box danger">

            <div className="icon">⚠️</div>

            <h3>Delete Activity Log?</h3>
            <p>This action cannot be undone.</p>

            <div className="modal-actions">
              <button className="cancel" onClick={() => setShowDelete(false)}>
                Cancel
              </button>

              <button className="danger-btn" onClick={handleDelete}>
                Delete
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= DETAILS DRAWER (IMPROVED UI) ================= */}
      {selectedLog && (
        <div className="drawer-overlay" onClick={() => setSelectedLog(null)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>

            <div className="drawer-header">
              <h3>Activity Details</h3>
              <FiClock />
            </div>

            <div className="drawer-card">
              <div><b>User</b><p>{selectedLog.full_name}</p></div>
              <div><b>Action</b><p>{selectedLog.action}</p></div>
              <div>
                <b>Date</b>
                <p>{new Date(selectedLog.created_at).toLocaleString()}</p>
              </div>
            </div>

            <button className="close-btn" onClick={() => setSelectedLog(null)}>
              Close
            </button>

          </div>
        </div>
      )}

      {/* ================= STYLE ================= */}
      <style>{`

        .header{
          display:flex;
          justify-content:space-between;
          margin-bottom:20px;
        }

        .filters{
          display:flex;
          gap:10px;
        }

        .filters input{
          padding:10px;
          border-radius:10px;
          border:1px solid #ddd;
        }

        .date-group{ margin-bottom:20px; }

        .date-title{
          font-size:12px;
          font-weight:700;
          color:#64748b;
          margin-bottom:10px;
        }

        .card-ui{
          background:white;
          border-radius:16px;
          padding:10px;
          box-shadow:0 5px 20px rgba(0,0,0,0.05);
        }

        .log-row{
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:14px;
          border-bottom:1px solid #eee;
          cursor:pointer;
        }

        .log-row:hover{
          background:#f8fafc;
        }

        .user-badge{
          display:flex;
          align-items:center;
          gap:8px;
          background:#dbeafe;
          color:#1d4ed8;
          padding:6px 10px;
          border-radius:999px;
          font-weight:600;
        }

        .action{
          flex:1;
          padding-left:15px;
        }

        .delete-btn{
          background:#dc2626;
          color:white;
          border:none;
          padding:10px;
          border-radius:12px;
          cursor:pointer;
        }

       .toast{
  position:fixed;
  top:20px;
  right:20px;
  padding:14px 18px;
  border-radius:12px;
  color:white;
  z-index:999999; /* 🔥 KY ËSHTË FIX REAL */
  animation:slideIn 0.3s ease;
}

        .toast.success{ background:#16a34a; }
        .toast.error{ background:#dc2626; }

        @keyframes slideIn{
          from{ transform:translateX(100%); opacity:0; }
          to{ transform:translateX(0); opacity:1; }
        }

        /* ================= MODAL ================= */
        .modal{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,0.5);
          display:flex;
          justify-content:center;
          align-items:center;
        }

        .modal-box{
          background:white;
          padding:25px;
          border-radius:16px;
          width:420px;
          text-align:center;
        }

        .icon{ font-size:30px; }

        .modal-actions{
          display:flex;
          justify-content:center;
          gap:10px;
          margin-top:20px;
        }

        .cancel{
          background:#e5e7eb;
          padding:10px 14px;
          border:none;
          border-radius:10px;
        }

        .danger-btn{
          background:#dc2626;
          color:white;
          padding:10px 14px;
          border:none;
          border-radius:10px;
        }

        /* ================= DRAWER ================= */
        .drawer-overlay{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,0.4);
          display:flex;
          justify-content:flex-end;
        }

        .drawer{
          width:400px;
          height:100%;
          background:white;
          padding:20px;
          animation:slide 0.25s ease;
        }

        .drawer-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
        }

        .drawer-card{
          margin-top:20px;
          background:#f8fafc;
          padding:15px;
          border-radius:12px;
        }

        .drawer-card div{
          margin-bottom:10px;
        }

        .close-btn{
          margin-top:20px;
          width:100%;
          padding:10px;
          border:none;
          background:#2563eb;
          color:white;
          border-radius:10px;
        }

        @keyframes slide{
          from{transform:translateX(100%)}
          to{transform:translateX(0)}
        }

      `}</style>

    </div>
  );
}

export default ActivityLogs;