import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ProjectDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/admin/projects/details/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProject(res.data.project || res.data);
        setTasks(res.data.tasks || []);
      } catch (err) {
        console.log(err.response?.data || err.message);
      }
    };

    fetchProject();
  }, [id]);

  if (!project) return <h5 className="p-4">Loading...</h5>;

  return (
   <div
  style={{
    background: "#f8fafc",
    minHeight: "100vh",
    padding: "30px",
  }}
>

      {/* BACK */}
      <div className="mb-3">
       <a
  href="/admin/projects"
  className="text-decoration-none"
  style={{
    color: "#475569",
    fontSize: "22px",
    fontWeight: "600",
  }}
>
          ← Back to Projects
        </a>
      </div>

      <div className="row g-4">

        {/* LEFT SIDE */}
        <div className="col-lg-8">

          {/* PROJECT CARD */}
        <div
  style={{
    background:
      "linear-gradient(135deg,#ffffff,#f8fafc)",
    border: "1px solid #e2e8f0",
    borderRadius: "24px",
    padding: "32px",
    boxShadow:
      "0 10px 30px rgba(15,23,42,0.05)",
  }}
>

            <div className="d-flex gap-2 mb-3">
            <span
  style={{
    background: "#dbeafe",
    color: "#2563eb",
    padding: "8px 16px",
    borderRadius: "999px",
    fontWeight: "600",
  }}
>
                {project.status}
              </span>

             <span
  style={{
    background: "#fee2e2",
    color: "#dc2626",
    padding: "8px 16px",
    borderRadius: "999px",
    fontWeight: "600",
  }}
>
                {project.priority}
              </span>
            </div>

           <h2
  style={{
    fontSize: "52px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "16px",
  }}
>{project.title}</h2>

            <p
  style={{
    color: "#475569",
    fontSize: "24px",
    lineHeight: "1.7",
    marginBottom: "40px",
  }}
>
              {project.description}
            </p>

            <div className="d-flex justify-content-between">
              <small className="text-muted">Overall Progress</small>
              <b>{project.progress}%</b>
            </div>

          <div
  style={{
    height: "14px",
    background: "#e2e8f0",
    borderRadius: "999px",
    overflow: "hidden",
    marginTop: "10px",
  }}
>
  <div
    style={{
      width: `${project.progress}%`,
      height: "100%",
      borderRadius: "999px",
      background:
        "linear-gradient(90deg,#2563eb,#3b82f6,#60a5fa)",
    }}
  />
</div>
          </div>

          {/* TASKS */}
         <div
  style={{
    background: "#fff",
    borderRadius: "24px",
    padding: "32px",
    border: "1px solid #e2e8f0",
    marginTop: "24px",
    boxShadow:
      "0 10px 30px rgba(15,23,42,0.05)",
      marginTop: "24px",
  }}
>

            <h5 className="mb-3 fw-bold">Tasks ({tasks.length})</h5>

           {tasks.map((task, i) => (
  <div
    key={task.id || i}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform =
        "translateY(-3px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform =
        "translateY(0)";
    }}
    className="d-flex justify-content-between align-items-center mb-3"
    style={{
      padding: "20px",
      borderRadius: "18px",
      border: "1px solid #e2e8f0",
      background:
        "linear-gradient(135deg,#ffffff,#f8fafc)",
      transition: "all .2s ease",
      cursor: "pointer",
    }}
  >

                {/* LEFT */}
                <div>
                  <h6 className="mb-1 fw-semibold">{task.title}</h6>
                  <small className="text-muted">
                      Due{" "}
                    {new Date(
                  task.due_date
              ).toLocaleDateString("en-GB")}
           </small>
                </div>

                {/* RIGHT */}
                <div className="d-flex align-items-center gap-2">

                  <span className={`badge rounded-pill px-3 py-2 ${
                    task.priority === "high" ? "bg-danger" : "bg-secondary"
                  }`}>
                    {task.priority}
                  </span>

                  <span className="badge rounded-pill bg-info px-3 py-2">
                    {task.status}
                  </span>

                  <img
                    src={task.avatar || "https://i.pravatar.cc/40"}
                    alt=""
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      objectFit: "cover"
                    }}
                  />
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="col-lg-4">

          {/* DETAILS */}
         <div
  style={{
    background: "#fff",
    borderRadius: "24px",
    padding: "32px",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 10px 30px rgba(15,23,42,0.05)",
  }}
>

            <h5 className="fw-bold mb-3">Details</h5>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Due Date</span>
              <b>
  {project.due_date
    ? new Date(
        project.due_date
      ).toLocaleDateString("en-GB")
    : "No due date"}
</b>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Tasks</span>
              <b>
  {
    tasks.filter(
      (t) =>
        t.status?.toLowerCase() ===
        "done"
    ).length
  }
  /
  {tasks.length}
</b>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Priority</span>
              <span className="badge rounded-pill bg-danger px-3 py-2">
                {project.priority}
              </span>
            </div>

            <div className="d-flex justify-content-between">
              <span className="text-muted">Members</span>
              <b>{project.members?.length || 0}</b>
            </div>
          </div>

          {/* TEAM */}
         <div
  style={{
    background: "#fff",
    borderRadius: "24px",
    padding: "32px",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 10px 30px rgba(15,23,42,0.05)",
  }}
>

            <h5 className="fw-bold mb-3">Team</h5>

            {project.members?.map((m, i) => (
              <div
                key={m.id || i}
                className="d-flex align-items-center gap-3 mb-3"
              >
                <img
                  src={m.avatar || "https://i.pravatar.cc/45"}
                  alt=""
                 style={{
  width: "56px",
  height: "56px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "3px solid white",
  boxShadow:
    "0 4px 12px rgba(0,0,0,0.1)",
}}
                />

                <div>
                  <div
  style={{
    fontWeight: "700",
    fontSize: "18px",
    color: "#0f172a",
  }}
>{m.name}</div>
                  <small className="text-muted">{m.role}</small>
                </div>
              </div>
            ))}

          </div>

        </div>

      </div>
    </div>
  );
}

export default ProjectDetails;