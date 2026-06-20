import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminProjects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

    const [activeFilter, setActiveFilter] =
  useState("all");

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
    setLoading(false);
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

      {loading ? (
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
    style={{
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "20px",
      padding: "26px",
      cursor: "pointer",
      height: "100%",
      transition: "0.2s",
      boxShadow:
        "0 2px 10px rgba(0,0,0,0.05)",
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
      }}
    >
      {project.title}
    </h3>

    <p
      style={{
        color: "#64748b",
        minHeight: "60px",
        fontSize: "16px",
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

    <div
      style={{
        height: "10px",
        background: "#e5e7eb",
        borderRadius: "20px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${project.progress}%`,
          background: "#3b82f6",
          height: "100%",
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
        {project.members?.slice(0, 4).map(
          (member, index) => (
            <img
              key={member.id}
              src={
                member.avatar ||
                "https://i.pravatar.cc/150"
              }
              alt=""
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid white",
                marginLeft:
                  index === 0
                    ? "0"
                    : "-10px",
              }}
            />
          )
        )}
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
    </div>
  );
}

export default AdminProjects;