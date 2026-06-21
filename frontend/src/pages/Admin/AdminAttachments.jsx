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
  const [selectedFile, setSelectedFile] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);

const [projects, setProjects] = useState([]);
const [users, setUsers] = useState([]);
const [tasks, setTasks] = useState([]);

const [selectedProject, setSelectedProject] = useState("");
const [selectedTask, setSelectedTask] = useState("");
const [selectedUser, setSelectedUser] = useState("");

const [showEditModal, setShowEditModal] =
  useState(false);

const [editAttachmentId, setEditAttachmentId] =
  useState(null);

const [editTask, setEditTask] =
  useState("");

const [editProject, setEditProject] =
  useState("");

const [editFile, setEditFile] =
  useState(null);

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
  const fetchDropdownData = async () => {
  try {
    const [p, u] = await Promise.all([
      axios.get(
        "http://localhost:5000/api/admin/projects",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
      axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    ]);

    setProjects(p.data);
    setUsers(u.data);
  } catch (err) {
    console.log(err);
  }
};

const handleProjectChange = async (
  projectId
) => {
  setSelectedProject(projectId);

  try {
    const res = await axios.get(
      `http://localhost:5000/api/tasks/project/${projectId}/all`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTasks(res.data);
  } catch (err) {
    console.log(err);
  }
};
  useEffect(() => {
  fetchAttachments();
  fetchDropdownData();
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
  const handleCreateAttachment =
  async () => {
    try {
      const formData =
        new FormData();

      formData.append(
        "file",
        selectedFile
      );

      formData.append(
        "task_id",
        selectedTask
      );
      formData.append(
  "uploaded_by",
  selectedUser
);
if (
  !selectedUser ||
  !selectedProject ||
  !selectedTask ||
  !selectedFile
) {
  setErrorMessage(
    "Please fill all fields"
  );

  setTimeout(() => {
    setErrorMessage("");
  }, 5000);

  return;
}
      await axios.post(
        "http://localhost:5000/api/attachments",
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setShowNewModal(false);

      setSelectedFile(null);
      setSelectedProject("");
      setSelectedTask("");
      setSelectedUser("");

      fetchAttachments();

      setSuccessMessage(
        "Attachment created successfully"
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (err) {
      console.log(err);

      setErrorMessage(
        "Failed to create attachment"
      );

      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };
  const handleEditAttachment =
  async () => {
if (!editFile) {

  setErrorMessage(
    "Please choose a file"
  );

  setTimeout(() => {
    setErrorMessage("");
  }, 5000);

  return;
}
    try {

      const formData =
        new FormData();

      formData.append(
        "task_id",
        editTask
      );

      if (editFile) {

        formData.append(
          "file",
          editFile
        );

      }

      await axios.put(
        `http://localhost:5000/api/admin/attachments/${editAttachmentId}`,
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setShowEditModal(false);

      fetchAttachments();

      setSuccessMessage(
        "Attachment updated successfully"
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

    } catch (err) {

      console.log(err);

      setErrorMessage(
        "Failed to update attachment"
      );

      setTimeout(() => {
        setErrorMessage("");
      }, 5000);

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
        <button
  className="btn btn-primary mb-4"
  onClick={() =>
    setShowNewModal(true)
  }
>
  + New Attachment
</button>

      {successMessage && (
  <div
    className="alert alert-success"
    style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: 999999,
      minWidth: "300px",
      boxShadow: "0 10px 30px rgba(0,0,0,.2)"
    }}
  >
    {successMessage}
  </div>
)}

{errorMessage && (
  <div
    className="alert alert-danger"
    style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: 999999,
      minWidth: "300px",
      boxShadow: "0 10px 30px rgba(0,0,0,.2)"
    }}
  >
    {errorMessage}
  </div>
)}
       

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
                 <div className="mt-3 d-flex gap-2">

  <button
    className="btn btn-primary btn-sm"
    onClick={() => {

      setEditAttachmentId(a.id);

      setEditTask(a.task_id);

      setShowEditModal(true);

    }}
  >
    Edit
  </button>

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
        {showEditModal && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 99999,
    }}
  >
    <div
      style={{
        width: "850px",
        background: "#fff",
        padding: "30px",
        borderRadius: "25px",
      }}
    >
    <h2 className="fw-bold mb-4">
  ✏️ Edit Attachment
</h2>

<div
  className="alert alert-info mb-3"
>
  Current File:
  <strong>
    {" "}
    {attachments.find(
      (a) =>
        a.id === editAttachmentId
    )?.file_name}
  </strong>
</div>




      

      <div className="mb-3">
       <small className="text-secondary d-block mb-2">
  <i>    Choose a new file if you want to replace the current one.</i>
  </small>


        <input
          type="file"
          className="form-control"
          onChange={(e) =>
            setEditFile(
              e.target.files[0]
            )
          }
        />
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button
          className="btn btn-secondary"
          onClick={() =>
            setShowEditModal(false)
          }
        >
          Cancel
        </button>

        <button
          className="btn btn-primary"
          onClick={
            handleEditAttachment
          }
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}
        {showNewModal && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background:
        "rgba(0,0,0,.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 99999,
    }}
  >
    <div
      style={{
        width: "900px",
        maxWidth: "95%",
        background: "#fff",
        borderRadius: "25px",
        padding: "30px",
      }}
    >
      <h2 className="fw-bold mb-4">
        📎 Create New Attachment
      </h2>

      <div className="row">

        <div className="col-md-4 mb-3">
          <label className="fw-bold">
            User
          </label>

          <select
            className="form-control"
            value={selectedUser}
            onChange={(e) =>
              setSelectedUser(
                e.target.value
              )
            }
          >
            <option value="">
              Select User
            </option>

            {users.map((u) => (
              <option
                key={u.id}
                value={u.id}
              >
                {u.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4 mb-3">
          <label className="fw-bold">
            Project
          </label>

          <select
            className="form-control"
            value={selectedProject}
            onChange={(e) =>
              handleProjectChange(
                e.target.value
              )
            }
          >
            <option value="">
              Select Project
            </option>

            {projects.map((p) => (
              <option
                key={p.id}
                value={p.id}
              >
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4 mb-3">
          <label className="fw-bold">
            Task
          </label>

          <select
            className="form-control"
            value={selectedTask}
            onChange={(e) =>
              setSelectedTask(
                e.target.value
              )
            }
          >
            <option value="">
              Select Task
            </option>

            {tasks.map((t) => (
              <option
                key={t.id}
                value={t.id}
              >
                {t.title}
              </option>
            ))}
          </select>
        </div>

      </div>

      <div className="mb-3">
        <label className="fw-bold">
          Upload File
        </label>

        <input
          type="file"
          className="form-control"
          onChange={(e) =>
            setSelectedFile(
              e.target.files[0]
            )
          }
        />
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button
          className="btn btn-secondary"
          onClick={() =>
            setShowNewModal(false)
          }
        >
          Cancel
        </button>

        <button
          className="btn btn-primary"
          onClick={
            handleCreateAttachment
          }
        >
          Create Attachment
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