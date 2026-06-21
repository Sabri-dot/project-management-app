import { useEffect, useState } from "react";
import axios from "axios";

function AdminComments() {
  const token = localStorage.getItem("token");

  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [selectedComment, setSelectedComment] =
    useState(null);

  const [editComment, setEditComment] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");
 const [showNewModal, setShowNewModal] = useState(false);

const [projects, setProjects] = useState([]);
const [users, setUsers] = useState([]);
const [tasks, setTasks] = useState([]);

const [newComment, setNewComment] = useState("");
const [selectedProject, setSelectedProject] = useState("");
const [selectedTask, setSelectedTask] = useState("");
const [selectedUser, setSelectedUser] = useState(""); 
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteId, setDeleteId] = useState(null);
const openNewModal = () => {
  setShowNewModal(true);
  setSelectedProject("");
  setSelectedTask("");
  setSelectedUser("");
  setNewComment("");
  setTasks([]);
};
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/comments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments(res.data);
      setFilteredComments(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchDropdownData = async () => {
  try {
    const [p, u] = await Promise.all([
      axios.get("http://localhost:5000/api/admin/projects", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    setProjects(p.data);
    setUsers(u.data);
  } catch (err) {
    console.log(err);
  }
};
const handleProjectChange = async (projectId) => {
  setSelectedProject(projectId);

  try {
    const res = await axios.get(
      `http://localhost:5000/api/tasks/project/${projectId}/all`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setTasks(res.data);
  } catch (err) {
    console.log(err);
  }
};
const handleCreateComment = async () => {
  try {
    await axios.post(
      "http://localhost:5000/api/admin/comments",
      {
        comment: newComment,
        user_id: selectedUser,
        project_id: selectedProject,
        task_id: selectedTask,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setShowNewModal(false);
    setNewComment("");
    setSelectedProject("");
    setSelectedTask("");
    setSelectedUser("");

    fetchComments();
  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
    fetchComments();
    fetchDropdownData();
  }, []);

  useEffect(() => {
    const filtered = comments.filter(
      (comment) =>
        comment.comment
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        comment.full_name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        comment.task_title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        comment.project_title
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );

    setFilteredComments(filtered);
  }, [search, comments]);

  const handleEdit = (comment) => {
    setSelectedComment(comment);
    setEditComment(comment.comment);
    setShowEditModal(true);
  };

  const handleUpdateComment = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/comments/${selectedComment.id}`,
        {
          comment: editComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(
        "Comment updated successfully"
      );

      setShowEditModal(false);

      fetchComments();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setErrorMessage(
        "Failed to update comment"
      );

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  const handleDeleteComment = async (
    commentId
  ) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(
        "Comment deleted successfully"
      );

      fetchComments();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setErrorMessage(
        "Failed to delete comment"
      );

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

 return (
  <>
    <style>{`
.task-card {
  border-radius: 20px;
  padding: 18px;
  background: rgba(59, 130, 246, 0.18); /* më blu */
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(59, 130, 246, 0.35);
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.12);
}

.task-card:hover {
  transform: translateY(-8px) scale(1.06);
  box-shadow: 0 18px 50px rgba(59, 130, 246, 0.35);
  border: 1px solid rgba(59, 130, 246, 0.6);
  background: rgba(59, 130, 246, 0.25); /* bëhet më blu kur hover */
}
`}</style>

    <div
      className="container-fluid"
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "30px",
      }}
    >
      <div className="mb-4">
        <h1
          className="fw-bold mb-1"
          style={{
            fontSize: "42px",
          }}
        >
          All Comments
        </h1>

        <p
          className="text-secondary mb-0"
          style={{
            fontSize: "20px",
          }}
        >
          {filteredComments.length} comments
        </p>
      </div>

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger">
          {errorMessage}
        </div>
      )}
         
       <button
  type="button"
  className="btn btn-primary mb-3"
  style={{
    position: "relative",
    zIndex: 99999
  }}
  onClick={() => {
    console.log("clicked new comment");
    openNewModal();
  }}
>
  + New Comment
</button>

      <input
        type="text"
        className="form-control border-0 shadow-sm mb-4"
        placeholder="🔍 Search comments..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        style={{
          height: "58px",
          borderRadius: "18px",
        }}
      />

      {loading ? (
        <h4>Loading...</h4>
      ) : (
       <div className="row row-cols-1 row-cols-md-3 g-4">
  {filteredComments.map((comment) => (
    <div key={comment.id} className="col">
      <div className="task-card h-100">
                <div className="card-body p-4">

                  <div className="d-flex align-items-center mb-4">

                    <img
                      src={
                        comment.avatar
                          ? comment.avatar.startsWith(
                              "http"
                            )
                            ? comment.avatar
                            : `http://localhost:5000${comment.avatar}`
                          : `https://ui-avatars.com/api/?name=${comment.full_name}`
                      }
                      alt=""
                      className="rounded-circle me-3"
                      style={{
                        width: "55px",
                        height: "55px",
                        objectFit: "cover",
                      }}
                    />

                    <div>
                      <h5 className="mb-0">
                        {comment.full_name}
                      </h5>

                      <small className="text-secondary">
                        {new Date(
                          comment.created_at
                        ).toLocaleString()}
                      </small>
                    </div>

                  </div>

                  <h6 className="fw-bold">
                    Comment
                  </h6>

                  <p
                    className="text-secondary"
                    style={{
                      minHeight: "70px",
                    }}
                  >
                    {comment.comment}
                  </p>

                  <div className="mb-2">
                    <strong>
                      Project:
                    </strong>{" "}
                    {comment.project_title}
                  </div>

                  <div className="mb-4">
                    <strong>
                      Task:
                    </strong>{" "}
                    {comment.task_title}
                  </div>

                  <div className="d-flex gap-2">

                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        handleEdit(comment)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => {
  setDeleteId(comment.id);
  setShowDeleteModal(true);
}}
                    >
                      Delete
                    </button>

                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showEditModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,.5)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="bg-white p-4"
            style={{
              width: "700px",
              borderRadius: "24px",
            }}
          >
            <h3 className="fw-bold mb-4">
              Edit Comment
            </h3>

            <textarea
              rows="6"
              className="form-control"
              value={editComment}
              onChange={(e) =>
                setEditComment(
                  e.target.value
                )
              }
            />

            <div className="d-flex justify-content-end gap-2 mt-4">

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
                  handleUpdateComment
                }
              >
                Save Changes
              </button>

            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "20px",
        width: "450px",
        textAlign: "center",
      }}
    >
      <h4 className="fw-bold">Delete Comment</h4>

      <p className="text-secondary mt-2">
        Are you sure you want to delete this comment?
      </p>

      <div className="d-flex justify-content-center gap-2 mt-4">
        <button
          className="btn btn-secondary"
          onClick={() => setShowDeleteModal(false)}
        >
          Cancel
        </button>

        <button
          className="btn btn-danger"
          onClick={() => {
            handleDeleteComment(deleteId);
            setShowDeleteModal(false);
          }}
        >
          Delete
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
      background: "rgba(0,0,0,.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 99999,
    }}
  >
    <div
      style={{
        width: "950px",
        maxWidth: "95%",
        background: "#ffffff",
        borderRadius: "28px",
        padding: "35px",
        boxShadow: "0 25px 80px rgba(0,0,0,.35)",
      }}
    >
      <h2 className="fw-bold mb-4">✨ Create New Comment</h2>

      <textarea
        className="form-control mb-3"
        rows="4"
        placeholder="Write your comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        style={{
          borderRadius: "14px",
          padding: "12px",
        }}
      />

      <div className="row">
        {/* USER */}
        <div className="col-md-4 mb-3">
          <label className="fw-bold mb-2">User</label>
          <select
            className="form-control"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            style={{ borderRadius: "12px" }}
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* PROJECT */}
        <div className="col-md-4 mb-3">
          <label className="fw-bold mb-2">Project</label>
          <select
            className="form-control"
            value={selectedProject}
            onChange={(e) => handleProjectChange(e.target.value)}
            style={{ borderRadius: "12px" }}
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* TASK */}
        <div className="col-md-4 mb-3">
          <label className="fw-bold mb-2">Task</label>
          <select
            className="form-control"
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            style={{ borderRadius: "12px" }}
          >
            <option value="">Select Task</option>
            {tasks.length > 0 ? (
              tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))
            ) : (
              <option disabled>No tasks available</option>
            )}
          </select>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <button
          className="btn btn-light"
          onClick={() => setShowNewModal(false)}
        >
          Cancel
        </button>

        <button
          className="btn btn-primary px-4"
          onClick={handleCreateComment}
        >
          Create Comment
        </button>
      </div>
    </div>
  </div>
)}
    </div>
    </>
  );
}

export default AdminComments;