import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
function AdminProjects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] =
    useState([]);

    const [toast, setToast] = useState({
  show: false,
  message: "",
  type: "success", 
});

  
const showToast = (message, type = "success") => {
  setToast({
    show: true,
    message,
    type,
  });

  setTimeout(() => {
    setToast({
      show: false,
      message: "",
      type: "success",
    });
  }, 4000);
};
    const [showEditModal, setShowEditModal] = useState(false);
const [editingProject, setEditingProject] = useState(null);

const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deletingProjectId, setDeletingProjectId] = useState(null);

 const [loading, setLoading] = useState(false);
 
 const [pageLoading, setPageLoading] = useState(true);
const [creating, setCreating] = useState(false);

    const [users, setUsers] = useState([]);
   const [showCreateModal, setShowCreateModal] =
  useState(false);
  

  const [selectedUsers, setSelectedUsers] =
  useState([]);

  const [search, setSearch] =
    useState("");

    const [activeFilter, setActiveFilter] =
  useState("all");


const [newProject, setNewProject] =
  useState({
    title: "",
    description: "",
    status: "planning",
    priority: "medium",
    due_date: "",
  });
  const token =
    localStorage.getItem("token");

 const fetchProjects = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/admin/projects",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("PROJECTS =>", res.data);

    setProjects(res.data);
    setFilteredProjects(res.data);
  } catch (err) {
    console.log(err);
  } finally {
    setPageLoading(false);
  }
};
const fetchUsers = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/admin/users",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setUsers(res.data);
  } catch (err) {
    console.log(err);
  }
};
const handleCreateProject = async () => {
  if (creating) return;
setCreating(true);

  try {
    const projectRes = await axios.post(
      "http://localhost:5000/api/admin/projects",
      {
        title: newProject.title,
        description: newProject.description,
        status: newProject.status,
        priority: newProject.priority,
        due_date: newProject.due_date,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const projectId = projectRes.data.projectId;

    for (const userId of selectedUsers) {
  await axios.post(
  `http://localhost:5000/api/admin/project-members`,
  {
    project_id: projectId,
    user_id: userId,
  },
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
    }

    await fetchProjects();

    setNewProject({
      title: "",
      description: "",
      status: "planning",
      priority: "medium",
      due_date: "",
    });

    setSelectedUsers([]);

    setShowCreateModal(false);

    showToast("Project Created successfully", "success");

  } catch (err) {
    console.log(err);
     showToast("Error creating project", "danger");
  } finally {
  setCreating(false);
}
  
};
const handleEditProject = async () => {
  try {
    await axios.put(
      `http://localhost:5000/api/admin/projects/${editingProject.id}`,
      {
        title: editingProject.title,
        description: editingProject.description,
        status: editingProject.status,
        priority: editingProject.priority,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    await fetchProjects();

    setShowEditModal(false);
    setEditingProject(null);

    showToast("Project edited successfully", "success");
  } catch (err) {
    console.log(err);
 showToast("Error editing project", "danger");
  }
};
const handleDeleteProject = async () => {
  try {
    await axios.delete(
      `http://localhost:5000/api/admin/projects/${deletingProjectId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    await fetchProjects();

    setShowDeleteModal(false);
    setDeletingProjectId(null);

   showToast("Project deleted successfully", "success");
  } catch (err) {
    console.log(err);
    showToast("Error deleting project", "danger");
  }
};

 useEffect(() => {
  let filtered = [...projects];

  if (activeFilter !== "all") {
    filtered = filtered.filter(
      (p) => p.status === activeFilter
    );
  }

  if (search) {
    filtered = filtered.filter(
      (project) =>
        project.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        project.description
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );
  }

  setFilteredProjects(filtered);

}, [
  search,
  projects,
  activeFilter,
]);


useEffect(() => {
  fetchProjects();
  fetchUsers();
}, []);

  const activeProjects =
    projects.filter(
      (p) => p.status === "active"
    ).length;

  const completedProjects =
    projects.filter(
      (p) => p.status === "completed"
    ).length;

  return (
    <div
  className="container-fluid"
  style={{
    background: "#f8fafc",
    minHeight: "100vh",
    padding: "30px",
  }}
> 

     <div className="d-flex justify-content-between align-items-start mb-5">

  <div>

    <h1
      className="fw-bold mb-1"
      style={{
        fontSize: "48px",
      }}
    >
      All Projects
    </h1>

    <p
      style={{
        color: "#64748b",
        fontSize: "20px",
      }}
    >
      {filteredProjects.length} projects found
    </p>

  </div>

 <button
  className="btn"
  onClick={() =>
    setShowCreateModal(true)
  }
  style={{
    background: "#2563eb",
    color: "#fff",
    height: "52px",
    padding: "0 24px",
    borderRadius: "14px",
  }}
>
  + New Project
</button>

</div>

<div className="d-flex flex-wrap gap-3 mb-5">

  <input
    type="text"
    className="form-control"
    placeholder="Search projects..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    style={{
  width: "480px",
  height: "52px",
  borderRadius: "14px",
}}
  />

  <button
    className={`btn ${
      activeFilter === "all"
        ? "btn-primary"
        : "btn-light"
    }`}
    onClick={() =>
      setActiveFilter("all")
    }
  >
    All
  </button>

  <button
    className={`btn ${
      activeFilter === "active"
        ? "btn-primary"
        : "btn-light"
    }`}
    onClick={() =>
      setActiveFilter("active")
    }
  >
    Active
  </button>

  <button
    className={`btn ${
      activeFilter === "planning"
        ? "btn-primary"
        : "btn-light"
    }`}
    onClick={() =>
      setActiveFilter("planning")
    }
  >
    Planning
  </button>

  <button
    className={`btn ${
      activeFilter === "completed"
        ? "btn-primary"
        : "btn-light"
    }`}
    onClick={() =>
      setActiveFilter("completed")
    }
  >
    Completed
  </button>

  <button
    className={`btn ${
      activeFilter === "on_hold"
        ? "btn-primary"
        : "btn-light"
    }`}
    onClick={() =>
      setActiveFilter("on_hold")
    }
  >
    On Hold
  </button>

</div>

     {pageLoading ? (
  <h4>Loading...</h4>
      ) : (
        <div className="row g-4">

          {filteredProjects.map(
            (project) => (
             <div
  className="col-xl-4 col-lg-6"
  key={project.id}
>
  <div
  onClick={() =>
    navigate(`/admin/projects/${project.id}`)
  }
 onMouseEnter={(e) => {
  e.currentTarget.style.transform =
    "translateY(-10px) scale(1.03)";
  e.currentTarget.style.boxShadow =
    "0 25px 50px rgba(37,99,235,0.18)";
}}

onMouseLeave={(e) => {
  e.currentTarget.style.transform =
    "translateY(0) scale(1)";
  e.currentTarget.style.boxShadow =
    "0 8px 25px rgba(37,99,235,0.08)";
}}
style={{
  background:
    "linear-gradient(135deg,#eff6ff,#dbeafe)",
  border: "1px solid #bfdbfe",
  borderRadius: "20px",
  padding: "26px",
  cursor: "pointer",
  height: "100%",
  transition: "all .25s ease",
  boxShadow:
    "0 8px 25px rgba(37,99,235,0.08)",
}}
>
    <div className="d-flex justify-content-between mb-4">

      <span
        style={{
          background: "#dbeafe",
          color: "#2563eb",
          padding: "6px 14px",
          borderRadius: "20px",
          fontSize: "14px",
          fontWeight: "600",
        }}
      >
        {project.status}
      </span>

      <span
        style={{
          background:
            project.priority === "high"
              ? "#fee2e2"
              : "#fef3c7",
          color:
            project.priority === "high"
              ? "#dc2626"
              : "#d97706",
          padding: "6px 14px",
          borderRadius: "20px",
          fontSize: "14px",
          fontWeight: "600",
        }}
      >
        {project.priority}
      </span>

    </div>
<h3
  style={{
    fontWeight: "700",
    marginBottom: "14px",
    fontSize: "24px",
    color: "#1e40af",
  }}
>
  {project.title}
</h3>

    <p
  style={{
    color: "#475569",
    minHeight: "60px",
    fontSize: "16px",
    lineHeight: "1.6",
  }}
>
  {project.description}
</p>

    <div className="d-flex justify-content-between mt-4 mb-2">

      <span
        style={{
          fontWeight: "500",
        }}
      >
        Progress
      </span>

      <span
        style={{
          fontWeight: "700",
        }}
      >
        {project.progress}%
      </span>

    </div>
   <div className="d-flex gap-2 mt-3">

  <button
    className="btn btn-sm btn-warning"
    onClick={(e) => {
      e.stopPropagation();
      setEditingProject(project);
      setShowEditModal(true);
    }}
  >
    Edit
  </button>

  <button
    className="btn btn-sm btn-danger"
    onClick={(e) => {
      e.stopPropagation();
      setDeletingProjectId(project.id);
      setShowDeleteModal(true);
    }}
  >
    Delete
  </button>

</div>
    <div
  style={{
    height: "12px",
    background: "#edf2f7",
    borderRadius: "999px",
    overflow: "hidden",
  }}
>
     <div
  style={{
    width: `${project.progress}%`,
    background:
      "linear-gradient(90deg,#2563eb,#3b82f6,#60a5fa)",
    height: "100%",
    borderRadius: "999px",
    transition: "all .4s ease",
  }}
/>
    </div>

    <div
      className="d-flex justify-content-between align-items-center mt-4"
    >
      <div
        style={{
          display: "flex",
        }}
      >
        {project.members?.slice(0, 4).map((member, index) => (
  <img
    key={member.id}
    src={member.avatar || "https://i.pravatar.cc/150"}
    title={member.name || member.full_name}
    style={{
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      marginLeft: index === 0 ? "0" : "-12px",
    }}
  />
))}
      </div>

      <div
        style={{
          color: "#64748b",
          fontSize: "15px",
        }}
      >
        {project.completedTasks}/
        {project.totalTasks}
      </div>
    </div>

  </div>
</div>
            )
          )}

        </div>
      )}
      <Modal
  show={showCreateModal}
  onHide={() =>
    setShowCreateModal(false)
  }
  centered
  size="xl"
>

  <Modal.Header closeButton>
    <Modal.Title>
      Create Project
    </Modal.Title>
  </Modal.Header>

  <Modal.Body>

    <div className="mb-4">
      <label className="form-label fw-semibold">
        Project Name
      </label>

     <input
  type="text"
  className="form-control"
  value={newProject.title}
  onChange={(e) =>
    setNewProject({
      ...newProject,
      title: e.target.value,
    })
  }
  placeholder="e.g. Website Redesign"
/>
    </div>

    <div className="mb-4">
      <label className="form-label fw-semibold">
        Description
      </label>

      <textarea
  rows="4"
  className="form-control"
  value={newProject.description}
  onChange={(e) =>
    setNewProject({
      ...newProject,
      description: e.target.value,
    })
  }
/>
    </div>

    <div className="row mb-4">

      <div className="col-md-4">
        <label>Status</label>

        <select
  className="form-select"
  value={newProject.status}
  onChange={(e) =>
    setNewProject({
      ...newProject,
      status: e.target.value,
    })
  }
>
  <option value="planning">
    Planning
  </option>

  <option value="active">
    Active
  </option>

  <option value="completed">
    Completed
  </option>

  <option value="on_hold">
    On Hold
  </option>
</select>
      </div>

      <div className="col-md-4">
        <label>Priority</label>

       <select
  className="form-select"
  value={newProject.priority}
  onChange={(e) =>
    setNewProject({
      ...newProject,
      priority: e.target.value,
    })
  }
>
  <option value="low">
    Low
  </option>

  <option value="medium">
    Medium
  </option>

  <option value="high">
    High
  </option>
</select>
      </div>

      <div className="col-md-4">
        <label>Due Date</label>

       <input
  type="date"
  className="form-control"
  value={newProject.due_date}
  onChange={(e) =>
    setNewProject({
      ...newProject,
      due_date: e.target.value,
    })
  }
/>
      </div>

    </div>

    <h5 className="mb-3">
      Assign Team Members
    </h5>

    <div className="row">

      {users.map((user) => (
        <div
          key={user.id}
          className="col-md-4 mb-3"
        >
          <div
  onClick={() => {
    if (
      selectedUsers.includes(user.id)
    ) {
      setSelectedUsers(
        selectedUsers.filter(
          (id) => id !== user.id
        )
      );
    } else {
      setSelectedUsers([
        ...selectedUsers,
        user.id,
      ]);
    }
  }}
  className="d-flex align-items-center"
  style={{
    borderRadius: "14px",
    padding: "14px",
    cursor: "pointer",
    transition: "all .2s ease",
    background:
      selectedUsers.includes(user.id)
        ? "#eff6ff"
        : "linear-gradient(135deg,#ffffff,#f8fafc)",
    border:
      selectedUsers.includes(user.id)
        ? "2px solid #2563eb"
        : "1px solid #e2e8f0",
  }}
>

            <img
              src={
  user.avatar ||
  "https://i.pravatar.cc/40"
}
              alt=""
              width="40"
              height="40"
              className="rounded-circle me-3"
            />

            <span>
              {user.full_name}
            </span>

          </div>
        </div>
      ))}

    </div>

  </Modal.Body>

  <Modal.Footer>

  <button
  className="btn btn-primary"
  onClick={handleCreateProject}
>
  Create Project
</button>

    <button
      className="btn btn-light"
      onClick={() =>
        setShowCreateModal(false)
      }
    >
      Cancel
    </button>

  </Modal.Footer>

</Modal>
<Modal
  show={showEditModal}
  onHide={() => setShowEditModal(false)}
  centered
>
  <Modal.Header closeButton>
    <Modal.Title>Edit Project</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    {editingProject && (
      <>
        <input
          className="form-control mb-3"
          value={editingProject.title}
          onChange={(e) =>
            setEditingProject({
              ...editingProject,
              title: e.target.value,
            })
          }
        />

        <textarea
          className="form-control mb-3"
          rows="4"
          value={editingProject.description}
          onChange={(e) =>
            setEditingProject({
              ...editingProject,
              description: e.target.value,
            })
          }
        />

        <select
          className="form-select mb-3"
          value={editingProject.status}
          onChange={(e) =>
            setEditingProject({
              ...editingProject,
              status: e.target.value,
            })
          }
        >
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="on_hold">On Hold</option>
        </select>

        <select
          className="form-select"
          value={editingProject.priority}
          onChange={(e) =>
            setEditingProject({
              ...editingProject,
              priority: e.target.value,
            })
          }
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </>
    )}
  </Modal.Body>

  <Modal.Footer>
    <button className="btn btn-primary" onClick={handleEditProject}>
      Save Changes
    </button>

    <button className="btn btn-light" onClick={() => setShowEditModal(false)}>
      Cancel
    </button>
  </Modal.Footer>
</Modal>
<Modal
  show={showDeleteModal}
  onHide={() => setShowDeleteModal(false)}
  centered
>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Delete</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    Are you sure you want to delete this project?
  </Modal.Body>

  <Modal.Footer>
    <button className="btn btn-danger" onClick={handleDeleteProject}>
      Delete
    </button>

    <button className="btn btn-light" onClick={() => setShowDeleteModal(false)}>
      Cancel
    </button>
  </Modal.Footer>
</Modal>
{toast.show && (
  <div
    style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: 9999,
      minWidth: "280px",
      padding: "14px 18px",
      borderRadius: "12px",
      color: "#fff",
      fontWeight: "600",
      background:
        toast.type === "success"
          ? "linear-gradient(135deg,#22c55e,#16a34a)"
          : "linear-gradient(135deg,#ef4444,#dc2626)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      animation: "slideIn 0.3s ease",
    }}
  >
    {toast.message}
  </div>
)}
    </div>
  );
}

export default AdminProjects;