import { useEffect, useState } from "react";
import axios from "axios";
import { FiBell } from "react-icons/fi";

function AdminNotifications() {
  const token = localStorage.getItem("token");

  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [toast, setToast] = useState({ type: "", message: "" });

  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    user_id: "",
    title: "",
  });

  const [editId, setEditId] = useState(null);

  const [editData, setEditData] = useState({
    title: "",
    is_read: 0,
  });

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/notifications",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications(res.data);
      setFilteredNotifications(res.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/users",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = notifications.filter(
      (n) =>
        n.title?.toLowerCase().includes(search.toLowerCase()) ||
        n.full_name?.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredNotifications(filtered);
  }, [search, notifications]);

  // 🔥 TOAST
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 4000);
  };

  // CREATE
  const handleCreate = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/admin/notifications",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowCreateModal(false);
      setFormData({ user_id: "", title: "" });
      fetchNotifications();

      showToast("success", "Notification created successfully");
    } catch {
      showToast("error", "Failed to create notification");
    }
  };

  // EDIT
  const handleEdit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/notifications/${editId}`,
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowEditModal(false);
      fetchNotifications();

      showToast("success", "Notification edited successfully");
    } catch {
      showToast("error", "Failed to edit notification");
    }
  };

  // DELETE
  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/notifications/${deleteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowDeleteModal(false);
      fetchNotifications();

      showToast("success", "Notification deleted successfully");
    } catch {
      showToast("error", "Failed to delete notification");
    }
  };

  const total = filteredNotifications.length;
  const read = filteredNotifications.filter((n) => n.is_read).length;
  const unread = total - read;

  return (
    <div className="container-fluid p-4 dashboard-bg">

      {/* 🔥 TOAST */}
      {toast.message && (
        <div className={`toast-custom ${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* 📊 STATS */}
      <div className="stats-grid mb-4">
        <div className="stat-card">
          <h5>Total</h5>
          <h2>{total}</h2>
        </div>
        <div className="stat-card green">
          <h5>Read</h5>
          <h2>{read}</h2>
        </div>
        <div className="stat-card red">
          <h5>Unread</h5>
          <h2>{unread}</h2>
        </div>
      </div>

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">Notifications 🔔</h2>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          + New Notification
        </button>
      </div>

      <input
        className="form-control mb-3 search"
        placeholder="Search notifications..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <div className="table-card">
        {loading ? (
          <h5>Loading...</h5>
        ) : (
          <table className="table align-middle">
            <thead>
              <tr>
                <th></th>
                <th>User</th>
                <th>Notification</th>
                <th>Status</th>
                <th>Created</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredNotifications.map((n) => (
                <tr key={n.id} className="row-hover">

                  <td>
                    <FiBell color={n.is_read ? "#94a3b8" : "#f59e0b"} />
                  </td>

                  <td className="fw-semibold">{n.full_name}</td>

                  <td>{n.title}</td>

                  <td>
                    {n.is_read ? (
  <span className="status-badge read">READ</span>
) : (
  <span className="status-badge unread">UNREAD</span>
)}
                  </td>

                  <td>{new Date(n.created_at).toLocaleString()}</td>

                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => {
                        setEditId(n.id);
                        setEditData({ title: n.title, is_read: n.is_read });
                        setShowEditModal(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        setDeleteId(n.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Create Notification</h3>

            <select
              className="form-select mb-2"
              value={formData.user_id}
              onChange={(e) =>
                setFormData({ ...formData, user_id: e.target.value })
              }
            >
              <option>Select User</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name}
                </option>
              ))}
            </select>

            <textarea
              className="form-control mb-3"
              rows="4"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <button className="btn btn-primary me-2" onClick={handleCreate}>
              Send
            </button>
            <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Edit Notification</h3>

            <textarea
              className="form-control mb-2"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
            />

            <select
              className="form-select mb-3"
              value={editData.is_read}
              onChange={(e) =>
                setEditData({ ...editData, is_read: Number(e.target.value) })
              }
            >
              <option value={0}>Unread</option>
              <option value={1}>Read</option>
            </select>

            <button className="btn btn-warning me-2" onClick={handleEdit}>
              Save
            </button>
            <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="modal-backdrop">
          <div className="modal-box text-center">
            <h4>Are you sure?</h4>
            <p>This action cannot be undone.</p>

            <button className="btn btn-danger me-2" onClick={handleDelete}>
              Delete
            </button>
            <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* STYLE */}
      <style>{`
        .dashboard-bg{
          background:#f8fafc;
          min-height:100vh;
        }

        .stats-grid{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:16px;
        }

        .stat-card{
          background:white;
          padding:20px;
          border-radius:16px;
          box-shadow:0 6px 20px rgba(0,0,0,0.05);
          transition:0.3s;
        }

        .stat-card:hover{
          transform:translateY(-4px);
        }

        .green h2{color:#16a34a;}
        .red h2{color:#dc2626;}

        .search{
          height:50px;
          border-radius:12px;
        }

        .table-card{
          background:white;
          border-radius:16px;
          padding:10px;
          box-shadow:0 6px 20px rgba(0,0,0,0.05);
        }

        .row-hover{
          transition:0.2s;
        }

        .row-hover:hover{
          background:#f1f5f9;
          transform:scale(1.01);
        }

        .modal-backdrop{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,0.5);
          display:flex;
          align-items:center;
          justify-content:center;
          z-index:999;
        }

        .modal-box{
          background:white;
          padding:24px;
          border-radius:16px;
          width:420px;
        }

        .toast-custom{
          position:fixed;
          top:20px;
          right:20px;
          padding:12px 18px;
          border-radius:12px;
          color:white;
          z-index:1000;
          animation:fade 0.3s ease;
        }

        .toast-custom.success{background:#16a34a;}
        .toast-custom.error{background:#dc2626;}

        @keyframes fade{
          from{opacity:0; transform:translateY(-10px);}
          to{opacity:1; transform:translateY(0);}
        }
          .status-badge{
  display:inline-flex;
  justify-content:center;
  align-items:center;
  width:85px;   /* 🔥 kjo i bën të barabartë */
  height:32px;
  border-radius:10px;
  font-size:12px;
  font-weight:600;
  letter-spacing:0.5px;
}

.status-badge.read{
  background:#16a34a;
  color:white;
}

.status-badge.unread{
  background:#f59e0b;
  color:#111827;
}
      `}</style>

    </div>
  );
}

export default AdminNotifications;