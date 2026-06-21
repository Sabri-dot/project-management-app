import { useEffect, useState } from "react";
import axios from "axios";

function AdminAttachments() {
  const token = localStorage.getItem("token");

  const [attachments, setAttachments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // FETCH
  const fetchAttachments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/attachments",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAttachments(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttachments();
  }, []);

  // SEARCH
  useEffect(() => {
    const f = attachments.filter(
      (a) =>
        a.file_name?.toLowerCase().includes(search.toLowerCase()) ||
        a.task_title?.toLowerCase().includes(search.toLowerCase()) ||
        a.project_title?.toLowerCase().includes(search.toLowerCase()) ||
        a.uploaded_by_name?.toLowerCase().includes(search.toLowerCase())
    );

    setFiltered(f);
  }, [search, attachments]);

  // DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/attachments/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage("Attachment deleted successfully");

      fetchAttachments();

      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setErrorMessage("Failed to delete attachment");

      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  return (
    <>
      {/* BLUE CARD STYLE */}
      <style>{`
        .att-card {
          border-radius: 20px;
          padding: 18px;
          background: rgba(59,130,246,0.12);
          border: 1px solid rgba(59,130,246,0.25);
          transition: 0.3s ease;
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
        }

        .att-card:hover {
          transform: scale(1.05);
          box-shadow: 0 15px 40px rgba(59,130,246,0.35);
        }
      `}</style>

      <div className="container-fluid" style={{ padding: "30px", minHeight: "100vh", background: "#f8fafc" }}>
        
        <h1 className="fw-bold mb-1">All Attachments</h1>
        <p className="text-secondary mb-3">{filtered.length} attachments</p>

        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        {/* SEARCH */}
        <input
          className="form-control mb-4"
          placeholder="Search attachments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ height: "55px", borderRadius: "15px" }}
        />

        {/* LOADING */}
        {loading ? (
          <h4>Loading...</h4>
        ) : (
          <div className="row row-cols-1 row-cols-md-3 g-4">

            {filtered.map((a) => (
              <div key={a.id} className="col">
                <div className="att-card h-100">

                  {/* FILE */}
                  <h5 className="fw-bold">{a.file_name}</h5>

                  <a
                    href={`http://localhost:5000/${a.file_url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-primary mb-3"
                  >
                    Open File
                  </a>

                  <p className="mb-1">
                    <strong>Project:</strong> {a.project_title}
                  </p>

                  <p className="mb-1">
                    <strong>Task:</strong> {a.task_title}
                  </p>

                  <p className="mb-1">
                    <strong>By:</strong> {a.uploaded_by_name}
                  </p>

                  <small className="text-secondary">
                    {new Date(a.created_at).toLocaleString()}
                  </small>

                  {/* DELETE */}
                  <div className="mt-3">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setDeleteId(a.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

        {/* DELETE MODAL */}
        {showDeleteModal && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}>
            <div style={{
              background: "white",
              padding: "25px",
              borderRadius: "20px",
              width: "400px",
              textAlign: "center"
            }}>
              <h4>Delete Attachment?</h4>

              <p className="text-secondary">
                Are you sure you want to delete this attachment?
              </p>

              <div className="d-flex justify-content-center gap-2 mt-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => {
                    handleDelete(deleteId);
                    setShowDeleteModal(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default AdminAttachments;